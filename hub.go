package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"sync"
	"time"
)

type Challenge struct {
	Challenger string
	Target     string
	Wager      int
}

type Hub struct {
	store      *Store
	clients    map[string]*Client
	conns      map[*Client]bool
	challenges map[string][]*Challenge
	games      map[string]*Game
	bank       *Bank
	mu         sync.Mutex
	gameIDSeq  int
}

func NewHub(store *Store) *Hub {
	return &Hub{
		store:      store,
		clients:    make(map[string]*Client),
		conns:      make(map[*Client]bool),
		challenges: make(map[string][]*Challenge),
		games:      make(map[string]*Game),
		bank:       NewBank(store),
	}
}

func (h *Hub) addConn(c *Client) {
	h.mu.Lock()
	h.conns[c] = true
	h.mu.Unlock()
}

func (h *Hub) handleDisconnect(c *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	delete(h.conns, c)
	logInfo("ws", "connection closed name=%q addr=%s", c.Name, c.Addr)

	if c.Name == "" {
		return
	}
	if existing, ok := h.clients[c.Name]; !ok || existing != c {
		return
	}

	h.forfeitGame(c)

	delete(h.challenges, c.Name)
	for target, chs := range h.challenges {
		filtered := chs[:0]
		for _, ch := range chs {
			if ch.Challenger != c.Name {
				filtered = append(filtered, ch)
			}
		}
		if len(filtered) == 0 {
			delete(h.challenges, target)
		} else {
			h.challenges[target] = filtered
		}
	}

	delete(h.clients, c.Name)
	h.broadcastLobby()
}

func (h *Hub) forfeitGame(c *Client) {
	if c.GameID == "" {
		return
	}
	gameID := c.GameID
	game, ok := h.games[gameID]
	if !ok {
		c.GameID = ""
		return
	}
	game.mu.Lock()
	over := game.Phase == PhaseOver
	if !over {
		oppIdx := 1 - game.PlayerIndex(c.Name)
		oppName := game.Players[oppIdx]
		game.Phase = PhaseOver
		game.Winner = oppName
		game.mu.Unlock()

		logInfo("game", "forfeit game=%s loser=%s winner=%s wager=%d", gameID, c.Name, oppName, game.Wager)
		// refund wager since it was a forfeit during active play, not a normal end
		// but the wager was deducted on challenge accept. Let's just not double-deduct.
		game.mu.Unlock()

		// resolve match winner bets
		winnerPick := PickPlayer0
		if oppIdx == 1 {
			winnerPick = PickPlayer1
		}
		resolved := game.Bets.ResolveMatchWinner(winnerPick)
		for _, b := range resolved {
			if b.Player == "banque" {
				continue
			}
			if b.Won {
				h.store.AddPoints(b.Player, int(float64(b.Amount)*b.Odds))
			}
		}

		if oppClient, ok := h.clients[oppName]; ok {
			oppClient.sendJSON(map[string]interface{}{
				"type":         "game_over",
				"winner":       oppName,
				"won":          true,
				"pointsEarned": game.Wager,
				"reason":       "forfeit",
			})
			oppClient.GameID = ""
		}

		// notify spectators
		h.notifySpectators(game, map[string]interface{}{
			"type":   "game_over",
			"winner": oppName,
			"reason": "forfeit",
		})
		h.kickSpectators(game)
	} else {
		game.mu.Unlock()
		oppIdx := 1 - game.PlayerIndex(c.Name)
		oppName := game.Players[oppIdx]
		if oppClient, ok := h.clients[oppName]; ok && oppClient.GameID == gameID {
			oppClient.sendJSON(map[string]string{"type": "opponent_left"})
			oppClient.GameID = ""
		}
	}
	c.GameID = ""
	delete(h.games, gameID)
}

func (h *Hub) notifySpectators(game *Game, msg map[string]interface{}) {
	defer func() { recover() }()
	for _, sp := range game.Spectators {
		sp.sendJSON(msg)
	}
}

func (h *Hub) kickSpectators(game *Game) {
	defer func() { recover() }()
	for _, sp := range game.Spectators {
		sp.sendJSON(map[string]string{"type": "spectate_end"})
		sp.GameID = ""
	}
}

func (h *Hub) handleMessage(c *Client, msgType string, raw map[string]json.RawMessage) {
	getStr := func(key string) string {
		var s string
		if v, ok := raw[key]; ok {
			json.Unmarshal(v, &s)
		}
		return s
	}
	getInt := func(key string) int {
		var f float64
		if v, ok := raw[key]; ok {
			json.Unmarshal(v, &f)
		}
		return int(f)
	}

	switch msgType {
	case "join":
		name := getStr("name")
		if name == "" || len(name) > 20 {
			c.sendJSON(map[string]string{"type": "error", "message": "Pseudo invalide (1-20 caracteres)"})
			return
		}
		if _, exists := h.clients[name]; exists {
			c.sendJSON(map[string]string{"type": "error", "message": "Ce pseudo est deja connecte"})
			return
		}
		player := h.store.GetOrCreate(name)
		c.Name = name
		h.clients[name] = c
		logInfo("join", "player=%s points=%d addr=%s online=%d", name, player.Points, c.Addr, len(h.clients))
		c.sendJSON(map[string]interface{}{
			"type":   "joined",
			"name":   name,
			"points": player.Points,
			"wins":   player.Wins,
			"losses": player.Losses,
		})
		c.sendJSON(map[string]interface{}{
			"type":     "chat_history",
			"messages": h.store.GetRecentChat(50),
		})
		h.broadcastLobby()

	case "challenge":
		target := getStr("target")
		wager := getInt("wager")
		if c.Name == "" || target == "" || target == c.Name {
			return
		}
		targetClient, ok := h.clients[target]
		if !ok {
			c.sendJSON(map[string]string{"type": "error", "message": "Ce joueur n'est pas connecte"})
			return
		}
		if targetClient.GameID != "" || c.GameID != "" {
			c.sendJSON(map[string]string{"type": "error", "message": "Vous ou votre adversaire etes deja en jeu"})
			return
		}
		if wager < 0 {
			wager = 0
		}
		cRec := h.store.GetOrCreate(c.Name)
		tRec := h.store.GetOrCreate(target)
		if cRec.Points < wager {
			c.sendJSON(map[string]string{"type": "error", "message": "Vous n'avez pas assez de points"})
			return
		}
		if tRec.Points < wager {
			c.sendJSON(map[string]string{"type": "error", "message": "L'adversaire n'a pas assez de points"})
			return
		}

		chs := h.challenges[target]
		filtered := chs[:0]
		for _, ch := range chs {
			if ch.Challenger != c.Name {
				filtered = append(filtered, ch)
			}
		}
		h.challenges[target] = append(filtered, &Challenge{Challenger: c.Name, Target: target, Wager: wager})
		logInfo("challenge", "from=%s to=%s wager=%d", c.Name, target, wager)

		c.sendJSON(map[string]interface{}{"type": "challenge_sent", "target": target, "wager": wager})
		targetClient.sendJSON(map[string]interface{}{"type": "challenge_received", "challenger": c.Name, "wager": wager})

	case "accept_challenge":
		challenger := getStr("challenger")
		ch := h.takeChallenge(c.Name, challenger)
		if ch == nil {
			c.sendJSON(map[string]string{"type": "error", "message": "Defi expire"})
			return
		}
		challengerClient, ok := h.clients[ch.Challenger]
		if !ok || challengerClient.GameID != "" || c.GameID != "" {
			c.sendJSON(map[string]string{"type": "error", "message": "Defi indisponible"})
			return
		}
		cRec := h.store.GetOrCreate(c.Name)
		tRec := h.store.GetOrCreate(ch.Challenger)
		if cRec.Points < ch.Wager || tRec.Points < ch.Wager {
			c.sendJSON(map[string]string{"type": "error", "message": "Points insuffisants"})
			return
		}
		h.startGame(challengerClient, c, ch.Wager)

	case "decline_challenge":
		challenger := getStr("challenger")
		ch := h.takeChallenge(c.Name, challenger)
		if ch != nil {
			if client, ok := h.clients[challenger]; ok {
				client.sendJSON(map[string]interface{}{"type": "challenge_declined", "target": c.Name})
			}
		}

	case "place_ships":
		game := h.games[c.GameID]
		if game == nil {
			return
		}
		var placements []ShipPlacement
		if v, ok := raw["ships"]; ok {
			json.Unmarshal(v, &placements)
		}
		playerIdx := game.PlayerIndex(c.Name)
		if playerIdx < 0 {
			return
		}
		if !game.PlaceShips(playerIdx, placements) {
			c.sendJSON(map[string]string{"type": "error", "message": "Placement invalide"})
			return
		}
		c.sendJSON(map[string]string{"type": "ships_accepted"})

		game.mu.Lock()
		battle := game.Phase == PhaseBattle
		turn := game.Turn
		game.mu.Unlock()

		if battle {
			for i, name := range game.Players {
				if pc, ok := h.clients[name]; ok {
					pc.sendJSON(map[string]interface{}{"type": "battle_start", "yourTurn": turn == i})
				}
			}
		} else {
			oppIdx := 1 - playerIdx
			if opp, ok := h.clients[game.Players[oppIdx]]; ok {
				opp.sendJSON(map[string]string{"type": "opponent_ready"})
			}
		}

	case "spin":
		game := h.games[c.GameID]
		if game == nil {
			return
		}
		playerIdx := game.PlayerIndex(c.Name)
		if playerIdx < 0 {
			return
		}
		game.mu.Lock()
		if game.Phase != PhaseBattle || game.PendingZone[playerIdx] {
			game.mu.Unlock()
			return
		}
		game.mu.Unlock()

		rec := h.store.GetOrCreate(c.Name)
		if rec.Points < SpinCost {
			c.sendJSON(map[string]string{"type": "error", "message": "Il faut 10 points pour lancer la roulette"})
			return
		}
		h.store.AddPoints(c.Name, -SpinCost)

		beneficiaryIdx := playerIdx
		if rand.Intn(2) == 1 {
			beneficiaryIdx = 1 - playerIdx
		}
		game.mu.Lock()
		game.PendingZone[beneficiaryIdx] = true
		game.mu.Unlock()
		logInfo("spin", "game=%s spinner=%s beneficiary=%s cost=%d", c.GameID, c.Name, game.Players[beneficiaryIdx], SpinCost)

		// resolve spin winner bets
		spinBets := game.Bets.ResolveByEvent(BetSpinWinner, BetPick(beneficiaryIdx+1))
		for _, b := range spinBets {
			if b.Won && b.Player != "banque" {
				h.store.AddPoints(b.Player, int(float64(b.Amount)*b.Odds))
				if pc, ok := h.clients[b.Player]; ok {
					pc.sendJSON(map[string]interface{}{
						"type":   "bet_won",
						"kind":   string(b.Kind),
						"amount": int(float64(b.Amount) * b.Odds),
					})
				}
			}
		}
		if len(spinBets) > 0 {
			h.broadcastToSpectators(game, map[string]interface{}{"type": "bets_resolved", "kind": "spin_winner", "bets": spinBets})
		}

		newRec := h.store.GetOrCreate(c.Name)
		for i, name := range game.Players {
			if pc, ok := h.clients[name]; ok {
				pc.sendJSON(map[string]interface{}{
					"type":        "spin_result",
					"spinner":     playerIdx,
					"beneficiary": beneficiaryIdx,
					"youBenefit":  beneficiaryIdx == i,
					"youSpun":     playerIdx == i,
					"spinnerPoints": newRec.Points,
				})
			}
		}

	case "fire_zone":
		game := h.games[c.GameID]
		if game == nil {
			return
		}
		playerIdx := game.PlayerIndex(c.Name)
		if playerIdx < 0 {
			return
		}
		x := getInt("x")
		y := getInt("y")

		res := game.FireZone(playerIdx, y, x)
		if !res.Valid {
			logWarn("zone", "invalid zone fire game=%s player=%s xy=(%d,%d)", c.GameID, c.Name, x, y)
			return
		}
		hits := 0
		for _, cl := range res.Cells {
			if cl.Result == "hit" || cl.Result == "sunk" {
				hits++
			}
		}
		logInfo("zone", "game=%s shooter=%s center=(%d,%d) hits=%d gameOver=%v", c.GameID, c.Name, x, y, hits, res.GameOver)

		for i, name := range game.Players {
			if pc, ok := h.clients[name]; ok {
				pc.sendJSON(map[string]interface{}{
					"type":     "zone_result",
					"cells":    res.Cells,
					"cx":       x,
					"cy":       y,
					"shooter":  playerIdx,
					"yourTurn": res.NextTurn == i,
					"gameOver": res.GameOver,
				})
			}
		}

		if res.GameOver {
			winnerPick := PickPlayer1
			if playerIdx == 0 {
				winnerPick = PickPlayer0
			}
			matchBets := game.Bets.ResolveMatchWinner(winnerPick)
			for _, b := range matchBets {
				if b.Won && b.Player != "banque" {
					h.store.AddPoints(b.Player, int(float64(b.Amount)*b.Odds))
				}
			}
			h.broadcastToSpectators(game, map[string]interface{}{"type": "bets_resolved", "kind": "match_winner", "bets": matchBets})
			h.kickSpectators(game)
			h.finishGame(game, playerIdx, c.GameID)
		}

	case "fire":
		game := h.games[c.GameID]
		if game == nil {
			return
		}
		playerIdx := game.PlayerIndex(c.Name)
		if playerIdx < 0 {
			return
		}
		x := getInt("x")
		y := getInt("y")

		res := game.Fire(playerIdx, y, x)
		if !res.Valid {
			return
		}

		resultType := "miss"
		sunkShip := ""
		if res.Hit {
			resultType = "hit"
			if res.Sunk && res.SunkShip != nil {
				resultType = "sunk"
				sunkShip = res.SunkShip.Name
			}
		}
		game.AddEvent(GameEvent{Type: "fire", Player: playerIdx, Data: map[string]interface{}{"x": res.Col, "y": res.Row, "result": resultType, "ship": sunkShip}})

		// resolve bets
		betResolved := []*Bet{}
		if res.Hit {
			resolved := game.Bets.ResolveByEvent(BetNextHit, BetPick(playerIdx+1))
			for _, b := range resolved {
				if b.Won && b.Player != "banque" {
					h.store.AddPoints(b.Player, int(float64(b.Amount)*b.Odds))
					if pc, ok := h.clients[b.Player]; ok {
						pc.sendJSON(map[string]interface{}{"type": "bet_won", "kind": "next_hit", "amount": int(float64(b.Amount) * b.Odds)})
					}
				}
			}
			betResolved = append(betResolved, resolved...)
		}
		if res.Sunk {
			resolved := game.Bets.ResolveByEvent(BetNextSunk, BetPick(playerIdx+1))
			for _, b := range resolved {
				if b.Won && b.Player != "banque" {
					h.store.AddPoints(b.Player, int(float64(b.Amount)*b.Odds))
					if pc, ok := h.clients[b.Player]; ok {
						pc.sendJSON(map[string]interface{}{"type": "bet_won", "kind": "next_sunk", "amount": int(float64(b.Amount) * b.Odds)})
					}
				}
			}
			betResolved = append(betResolved, resolved...)
		}
		if !res.Hit {
			resolved := game.Bets.ResolveByEvent(BetNextMiss, BetPick(playerIdx+1))
			for _, b := range resolved {
				if b.Won && b.Player != "banque" {
					h.store.AddPoints(b.Player, int(float64(b.Amount)*b.Odds))
					if pc, ok := h.clients[b.Player]; ok {
						pc.sendJSON(map[string]interface{}{"type": "bet_won", "kind": "next_miss", "amount": int(float64(b.Amount) * b.Odds)})
					}
				}
			}
			betResolved = append(betResolved, resolved...)
		}

		for i, name := range game.Players {
			if pc, ok := h.clients[name]; ok {
				pc.sendJSON(map[string]interface{}{
					"type":     "fire_result",
					"x":        res.Col,
					"y":        res.Row,
					"result":   resultType,
					"ship":     sunkShip,
					"shooter":  playerIdx,
					"yourTurn": res.NextTurn == i,
					"gameOver": res.GameOver,
				})
			}
		}

		if res.GameOver {
			// resolve match winner bets
			winnerPick := PickPlayer1
			if playerIdx == 0 {
				winnerPick = PickPlayer0
			}
			matchBets := game.Bets.ResolveMatchWinner(winnerPick)
			for _, b := range matchBets {
				if b.Won && b.Player != "banque" {
					h.store.AddPoints(b.Player, int(float64(b.Amount)*b.Odds))
					if pc, ok := h.clients[b.Player]; ok {
						pc.sendJSON(map[string]interface{}{
							"type":   "bet_won",
							"kind":   string(b.Kind),
							"amount": int(float64(b.Amount) * b.Odds),
						})
					}
				}
			}
			h.broadcastToSpectators(game, map[string]interface{}{"type": "bets_resolved", "kind": "match_winner", "bets": matchBets})
			h.kickSpectators(game)
			h.finishGame(game, playerIdx, c.GameID)
		}

		if len(betResolved) > 0 {
			h.broadcastToSpectators(game, map[string]interface{}{"type": "bets_resolved", "kind": "fire_event", "bets": betResolved})
		}

		h.broadcastToSpectators(game, map[string]interface{}{
			"type":     "spectate_fire",
			"x":        res.Col,
			"y":        res.Row,
			"result":   resultType,
			"ship":     sunkShip,
			"shooter":  playerIdx,
			"turn":     game.Turn,
			"turnName": game.Players[game.Turn],
			"p1Ships":  game.ShipsLeft(0),
			"p2Ships":  game.ShipsLeft(1),
		})
		if !res.GameOver {
			h.updateSpectatorsOdds(game)
		}

	case "rematch":
		game := h.games[c.GameID]
		if game == nil {
			return
		}
		game.mu.Lock()
		if game.Phase != PhaseOver {
			game.mu.Unlock()
			return
		}
		playerIdx := game.PlayerIndex(c.Name)
		if playerIdx < 0 {
			game.mu.Unlock()
			return
		}
		game.RematchVotes[playerIdx] = true
		both := game.RematchVotes[0] && game.RematchVotes[1]
		p1Name, p2Name, wager := game.Players[0], game.Players[1], game.Wager
		game.mu.Unlock()

		if both {
			p1, ok1 := h.clients[p1Name]
			p2, ok2 := h.clients[p2Name]
			if !ok1 || !ok2 {
				return
			}
			r1 := h.store.GetOrCreate(p1Name)
			r2 := h.store.GetOrCreate(p2Name)
			if r1.Points < wager || r2.Points < wager {
				msg := map[string]string{"type": "error", "message": "Points insuffisants pour rejouer avec cette mise"}
				p1.sendJSON(msg)
				p2.sendJSON(msg)
				return
			}
			delete(h.games, c.GameID)
			h.startGame(p1, p2, wager)
		} else {
			oppIdx := 1 - playerIdx
			if opp, ok := h.clients[game.Players[oppIdx]]; ok {
				opp.sendJSON(map[string]string{"type": "rematch_requested"})
			}
		}

	case "leave_game":
		h.forfeitGame(c)
		h.broadcastLobby()

	case "client_log":
		lvl := getStr("level")
		text := getStr("message")
		if len(text) > 500 {
			text = text[:500]
		}
		logWarn("client", "name=%q addr=%s level=%s msg=%s", c.Name, c.Addr, lvl, text)

	case "borrow":
		if c.Name == "" {
			return
		}
		if h.store.GetLoan(c.Name) != nil {
			c.sendJSON(map[string]string{"type": "error", "message": "Tu as déjà un prêt en cours. Rembourse-le d'abord."})
			return
		}
		amount := getInt("amount")
		rate := getInt("rate")
		installment := getInt("installment")
		if amount < 20 || amount > 500 {
			c.sendJSON(map[string]string{"type": "error", "message": "Montant entre 20 et 500 pts"})
			return
		}
		if rate < 5 || rate > 50 {
			c.sendJSON(map[string]string{"type": "error", "message": "Taux entre 5 et 50%"})
			return
		}
		if installment < 0 || installment > amount || (installment > 0 && installment < 5) {
			c.sendJSON(map[string]string{"type": "error", "message": "Versement invalide"})
			return
		}
		h.store.ApproveLoan(c.Name, amount, rate, installment)
		rec := h.store.GetOrCreate(c.Name)
		c.sendJSON(map[string]interface{}{
			"type":        "loan_approved",
			"amount":      amount,
			"rate":        rate,
			"installment": installment,
			"newPoints":   rec.Points,
		})
		logInfo("loan", "approved player=%s amount=%d rate=%d%% installment=%d", c.Name, amount, rate, installment)
		h.broadcastLobby()

	case "loan_status":
		if c.Name == "" {
			return
		}
		if rec := h.store.GetLoan(c.Name); rec != nil {
			c.sendJSON(map[string]interface{}{
				"type":        "loan_status",
				"principal":   rec.Principal,
				"remaining":   rec.Remaining,
				"rate":        rec.Rate,
				"installment": rec.Installment,
				"repaid":      rec.Repaid,
			})
		}

	case "live_matches":
		var matches []map[string]interface{}
		for id, g := range h.games {
			if g.Phase == PhasePlacement || g.Phase == PhaseBattle {
				g.mu.Lock()
				matches = append(matches, map[string]interface{}{
					"id":       id,
					"p1":       g.Players[0],
					"p2":       g.Players[1],
					"phase":    g.Phase == PhasePlacement,
					"wager":    g.Wager,
					"turn":     g.Turn,
					"turnName": g.Players[g.Turn],
					"p1Ships":  g.ShipsLeft(0),
					"p2Ships":  g.ShipsLeft(1),
					"spectators": len(g.Spectators),
				})
				g.mu.Unlock()
			}
		}
		c.sendJSON(map[string]interface{}{"type": "live_matches", "matches": matches})

	case "spectate":
		gameID := getStr("gameId")
		game, ok := h.games[gameID]
		if !ok || game.Phase == PhaseOver {
			return
		}
		// remove from any previous spectate
		for _, g := range h.games {
			delete(g.Spectators, c.Name)
		}
		game.Spectators[c.Name] = c
		c.GameID = gameID
		logInfo("spectate", "player=%s game=%s spectators=%d", c.Name, gameID, len(game.Spectators))

		// send full board state
		c.sendJSON(map[string]interface{}{
			"type":     "spectate_start",
			"gameId":   gameID,
			"p1":       game.Players[0],
			"p2":       game.Players[1],
			"wager":    game.Wager,
			"turn":     game.Turn,
			"turnName": game.Players[game.Turn],
			"p1Ships":  game.ShipsLeft(0),
			"p2Ships":  game.ShipsLeft(1),
			"board1":   game.Boards[0].Grid,
			"board2":   game.Boards[1].Grid,
			"events":   game.RecentEvents(30),
			"openBets": game.Bets.OpenBetsByKind(""),
		})
		// send odds
		o0, o1 := h.bank.oe.CalcMatchOdds(game)
		c.sendJSON(map[string]interface{}{"type": "odds", "kind": "match_winner", "odds0": o0, "odds1": o1})

	case "unspectate":
		gameID := c.GameID
		if game, ok := h.games[gameID]; ok {
			delete(game.Spectators, c.Name)
			logInfo("spectate", "player=%s left game=%s", c.Name, gameID)
		}
		c.GameID = ""
		c.sendJSON(map[string]string{"type": "spectate_end"})

	case "bet":
		gameID := getStr("gameId")
		kind := BetKind(getStr("kind"))
		pick := BetPick(getInt("pick"))
		amount := getInt("amount")
		game, ok := h.games[gameID]
		if !ok || game.Phase == PhasePlacement || game.Phase == PhaseOver {
			c.sendJSON(map[string]string{"type": "error", "message": "Match indisponible pour les paris"})
			return
		}
		if pick != PickPlayer0 && pick != PickPlayer1 {
			c.sendJSON(map[string]string{"type": "error", "message": "Choix invalide"})
			return
		}
		if amount < 5 || amount > 500 {
			c.sendJSON(map[string]string{"type": "error", "message": "Mise entre 5 et 500 pts"})
			return
		}
		rec := h.store.GetOrCreate(c.Name)
		if rec.Points < amount {
			c.sendJSON(map[string]string{"type": "error", "message": "Points insuffisants"})
			return
		}
		var odds float64
		switch kind {
		case BetMatchWinner:
			o0, o1 := h.bank.oe.CalcMatchOdds(game)
			if pick == PickPlayer0 {
				odds = o0
			} else {
				odds = o1
			}
		case BetNextHit:
			o0, o1 := h.bank.oe.CalcNextHitOdds(game)
			if pick == PickPlayer0 {
				odds = o0
			} else {
				odds = o1
			}
		case BetNextSunk:
			o0, o1 := h.bank.oe.CalcNextSunkOdds(game)
			if pick == PickPlayer0 {
				odds = o0
			} else {
				odds = o1
			}
		case BetSpinWinner:
			o0, o1 := h.bank.oe.CalcSpinOdds(game)
			if pick == PickPlayer0 {
				odds = o0
			} else {
				odds = o1
			}
		case BetFirstBlood:
			o0, o1 := h.bank.oe.CalcFirstBloodOdds(0, 0)
			if pick == PickPlayer0 {
				odds = o0
			} else {
				odds = o1
			}
		case BetNextMiss:
			o0, o1 := h.bank.oe.CalcNextMissOdds(game)
			if pick == PickPlayer0 {
				odds = o0
			} else {
				odds = o1
			}
		default:
			c.sendJSON(map[string]string{"type": "error", "message": "Type de pari invalide"})
			return
		}
		h.store.AddPoints(c.Name, -amount)
		game.Bets.Place(c.Name, kind, pick, amount, odds)
		newRec := h.store.GetOrCreate(c.Name)
		c.sendJSON(map[string]interface{}{
			"type":      "bet_placed",
			"kind":      string(kind),
			"pick":      int(pick),
			"amount":    amount,
			"odds":      odds,
			"newPoints": newRec.Points,
		})
		logInfo("bet", "player=%s game=%s kind=%s pick=%d amount=%d odds=%.1f", c.Name, gameID, kind, pick, amount, odds)
		h.updateSpectatorsOdds(game)

	case "bet_history":
		// handled by store

	case "chat":
		text := getStr("text")
		replyTo := getStr("replyTo")
		if c.Name == "" || text == "" || len(text) > 300 {
			return
		}
		var replySnip string
		if replyTo != "" {
			replySnip = h.store.GetChatSnippet(replyTo)
		}
		msgID := h.store.AppendChat(c.Name, text, time.Now().Unix(), replyTo)
		chatMsg := map[string]interface{}{
			"type":      "chat",
			"id":        msgID,
			"from":      c.Name,
			"text":      text,
			"replyTo":   replyTo,
			"replySnip": replySnip,
		}
		if c.GameID != "" {
			game := h.games[c.GameID]
			if game != nil {
				isSpectator := false
				for _, name := range game.Players {
					if c.Name == name {
						isSpectator = false
						break
					}
					isSpectator = true
				}
				// spectator chat: broadcast to all spectators + players
				if _, isSp := game.Spectators[c.Name]; isSp || isSpectator {
					chatMsg["scope"] = "spec"
				} else {
					chatMsg["scope"] = "game"
				}
				if chatMsg["scope"] == "spec" {
					for _, name := range game.Players {
						if pc, ok := h.clients[name]; ok {
							pc.sendJSON(chatMsg)
						}
					}
					for _, sp := range game.Spectators {
						sp.sendJSON(chatMsg)
					}
				} else {
					for _, name := range game.Players {
						if pc, ok := h.clients[name]; ok {
							pc.sendJSON(chatMsg)
						}
					}
				}
			}
		} else {
			chatMsg["scope"] = "lobby"
			for cl := range h.conns {
				if cl.Name == "" {
					cl.sendJSON(chatMsg)
				}
			}
			for _, cl := range h.clients {
				if cl.GameID == "" {
					cl.sendJSON(chatMsg)
				}
			}
			if mentioned := parseMention(text); mentioned != "" {
				if mc, ok := h.clients[mentioned]; ok {
					mc.sendJSON(map[string]interface{}{
						"type": "mention",
						"from": c.Name,
						"text": text,
					})
				}
			}
		}
	}
}

func parseMention(text string) string {
	for i := 0; i < len(text); i++ {
		if text[i] == '@' && (i == 0 || text[i-1] == ' ') {
			end := i + 1
			for end < len(text) && isNameChar(text[end]) {
				end++
			}
			if end > i+1 {
				return text[i+1 : end]
			}
		}
	}
	return ""
}

func isNameChar(c byte) bool {
	return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c == '_' || c == '-'
}

const SpinCost = 10

// finishGame must be called with h.mu held
func (h *Hub) finishGame(game *Game, winnerIdx int, gameID string) {
	loser := game.Players[1-winnerIdx]
	winner := game.Winner
	logInfo("game", "over game=%s winner=%s loser=%s wager=%d", gameID, winner, loser, game.Wager)
	h.store.UpdateAfterGame(winner, loser, game.Wager)
	wRec := h.store.GetOrCreate(winner)
	lRec := h.store.GetOrCreate(loser)

	// loan commission on win
	collected, paid := h.store.CollectCommission(winner, game.Wager)
	if collected > 0 {
		logInfo("loan", "commission winner=%s collected=%d paid=%v", winner, collected, paid)
		wRec = h.store.GetOrCreate(winner) // refresh after deduction
	}

	for _, name := range game.Players {
		if pc, ok := h.clients[name]; ok {
			won := name == winner
			pts := wRec.Points
			if !won {
				pts = lRec.Points
			}
			pc.sendJSON(map[string]interface{}{
				"type":         "game_over",
				"winner":       winner,
				"won":          won,
				"pointsEarned": game.Wager,
				"newPoints":    pts,
			})
		}
	}
	h.broadcastLobby()
}

func (h *Hub) updateSpectatorsOdds(game *Game) {
	o0, o1 := h.bank.oe.CalcMatchOdds(game)
	for _, sp := range game.Spectators {
		sp.sendJSON(map[string]interface{}{"type": "odds", "kind": "match_winner", "odds0": o0, "odds1": o1})
	}
}

func (h *Hub) broadcastToSpectators(game *Game, msg map[string]interface{}) {
	for _, sp := range game.Spectators {
		sp.sendJSON(msg)
	}
}

func (h *Hub) takeChallenge(target, challenger string) *Challenge {
	chs, ok := h.challenges[target]
	if !ok {
		return nil
	}
	for i, ch := range chs {
		if ch.Challenger == challenger {
			h.challenges[target] = append(chs[:i], chs[i+1:]...)
			if len(h.challenges[target]) == 0 {
				delete(h.challenges, target)
			}
			return ch
		}
	}
	return nil
}

func (h *Hub) startGame(p1, p2 *Client, wager int) {
	h.gameIDSeq++
	gameID := fmt.Sprintf("game_%d", h.gameIDSeq)
	game := NewGame(gameID, p1.Name, p2.Name, wager)
	h.games[gameID] = game
	p1.GameID = gameID
	p2.GameID = gameID
	logInfo("game", "start game=%s p1=%s p2=%s wager=%d activeGames=%d", gameID, p1.Name, p2.Name, wager, len(h.games))
	go func() {
		time.Sleep(500 * time.Millisecond)
		game.mu.Lock()
		if game.Phase == PhasePlacement || game.Phase == PhaseBattle {
			game.mu.Unlock()
			h.mu.Lock()
			h.bank.PlaceBankBets(game.Bets, game)
			h.mu.Unlock()
		} else {
			game.mu.Unlock()
		}
	}()

	p1.sendJSON(map[string]interface{}{"type": "game_start", "opponent": p2.Name, "wager": wager, "playerIdx": 0})
	p2.sendJSON(map[string]interface{}{"type": "game_start", "opponent": p1.Name, "wager": wager, "playerIdx": 1})
	h.broadcastLobby()
}

func (h *Hub) broadcastLobby() {
	type PlayerInfo struct {
		Name   string `json:"name"`
		Points int    `json:"points"`
		Wins   int    `json:"wins"`
		Losses int    `json:"losses"`
		InGame bool   `json:"inGame"`
	}

	players := []PlayerInfo{}
	for _, c := range h.clients {
		rec := h.store.GetOrCreate(c.Name)
		players = append(players, PlayerInfo{
			Name:   c.Name,
			Points: rec.Points,
			Wins:   rec.Wins,
			Losses: rec.Losses,
			InGame: c.GameID != "",
		})
	}

	leaderboard := h.store.GetLeaderboard(10)
	for _, c := range h.clients {
		rec := h.store.GetOrCreate(c.Name)
		c.sendJSON(map[string]interface{}{
			"type":        "lobby_update",
			"players":     players,
			"leaderboard": leaderboard,
			"me": PlayerInfo{
				Name:   c.Name,
				Points: rec.Points,
				Wins:   rec.Wins,
				Losses: rec.Losses,
				InGame: c.GameID != "",
			},
		})
	}
}
