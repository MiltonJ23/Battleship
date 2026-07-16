package main

import (
	"fmt"
	"math"
	"math/rand"
	"sort"
	"sync"
)

// ─── bet types ────────────────────────────────────────────────

type BetPick int

const (
	PickNone    BetPick = 0
	PickPlayer0 BetPick = 1
	PickPlayer1 BetPick = 2
)

type BetKind string

const (
	BetMatchWinner BetKind = "match_winner"
	BetNextHit     BetKind = "next_hit"   // who will hit
	BetNextSunk    BetKind = "next_sunk"  // who will sink a ship
	BetSpinWinner  BetKind = "spin_winner"
)

var AllBetKinds = []BetKind{BetMatchWinner, BetNextHit, BetNextSunk, BetSpinWinner}

// bet placed by a user or bank
type Bet struct {
	ID       string  `json:"id"`
	Player   string  `json:"player"` // "" = bank
	Kind     BetKind `json:"kind"`
	Pick     BetPick `json:"pick"` // Player0 or Player1
	Amount   int     `json:"amount"`
	Odds     float64 `json:"odds"` // multiplier
	Resolved bool    `json:"resolved"`
	Won      bool    `json:"won"`
}

// open betting pool per game
type BettingPool struct {
	mu   sync.Mutex
	bets []*Bet
	seq  int
}

func NewBettingPool() *BettingPool {
	return &BettingPool{bets: make([]*Bet, 0)}
}

func (bp *BettingPool) Place(player string, kind BetKind, pick BetPick, amount int, odds float64) *Bet {
	bp.mu.Lock()
	defer bp.mu.Unlock()
	bp.seq++
	b := &Bet{
		ID:     fmt.Sprintf("b_%d", bp.seq),
		Player: player,
		Kind:   kind,
		Pick:   pick,
		Amount: amount,
		Odds:   odds,
	}
	bp.bets = append(bp.bets, b)
	return b
}

func (bp *BettingPool) ResolveByEvent(kind BetKind, winner BetPick) []*Bet {
	bp.mu.Lock()
	defer bp.mu.Unlock()
	var resolved []*Bet
	for _, b := range bp.bets {
		if b.Resolved {
			continue
		}
		if b.Kind == kind {
			b.Resolved = true
			b.Won = b.Pick == winner
			resolved = append(resolved, b)
		}
	}
	return resolved
}

func (bp *BettingPool) ResolveMatchWinner(winner BetPick) []*Bet {
	bp.mu.Lock()
	defer bp.mu.Unlock()
	var resolved []*Bet
	for _, b := range bp.bets {
		if b.Resolved {
			continue
		}
		if b.Kind == BetMatchWinner {
			b.Resolved = true
			b.Won = b.Pick == winner
			resolved = append(resolved, b)
		}
	}
	return resolved
}

// returns unresolved bets for a player
func (bp *BettingPool) PendingFor(player string) []*Bet {
	bp.mu.Lock()
	defer bp.mu.Unlock()
	var r []*Bet
	for _, b := range bp.bets {
		if b.Player == player && !b.Resolved {
			r = append(r, b)
		}
	}
	return r
}

// ─── odds engine ──────────────────────────────────────────────

type OddsEngine struct{}

func (oe *OddsEngine) CalcMatchOdds(game *Game) (float64, float64) {
	game.mu.Lock()
	ships0 := float64(game.ShipsLeft(0))
	ships1 := float64(game.ShipsLeft(1))
	game.mu.Unlock()
	total := ships0 + ships1
	if total == 0 {
		return 2.0, 2.0
	}
	o0 := 1.0 + (ships1 / total) // more ships on other side → better odds
	o1 := 1.0 + (ships0 / total)
	if o0 < 1.1 {
		o0 = 1.1
	}
	if o1 < 1.1 {
		o1 = 1.1
	}
	return math.Round(o0*10) / 10, math.Round(o1*10) / 10
}

func (oe *OddsEngine) CalcNextHitOdds(game *Game) (float64, float64) {
	game.mu.Lock()
	ships0 := float64(game.ShipsLeft(0))
	ships1 := float64(game.ShipsLeft(1))
	game.mu.Unlock()
	total := ships0 + ships1
	if total == 0 {
		return 1.5, 1.5
	}
	return 1.0 + (ships1/(total))*2.0, 1.0 + (ships0/(total))*2.0
}

func (oe *OddsEngine) CalcNextSunkOdds(game *Game) (float64, float64) {
	return oe.CalcNextHitOdds(game) // similar logic, just less likely => same odds
}

func (oe *OddsEngine) CalcSpinOdds(game *Game) (float64, float64) {
	return 1.8, 1.8 // 50/50 with house edge
}

// ─── bank auto-betting ────────────────────────────────────────

type Bank struct {
	store *Store
	oe    *OddsEngine
}

func NewBank(store *Store) *Bank {
	return &Bank{store: store, oe: &OddsEngine{}}
}

func (bk *Bank) PlaceBankBets(pool *BettingPool, game *Game) []*Bet {
	var placed []*Bet
	for _, kind := range AllBetKinds {
		var o0, o1 float64
		switch kind {
		case BetMatchWinner:
			o0, o1 = bk.oe.CalcMatchOdds(game)
		case BetNextHit:
			o0, o1 = bk.oe.CalcNextHitOdds(game)
		case BetNextSunk:
			o0, o1 = bk.oe.CalcNextSunkOdds(game)
		case BetSpinWinner:
			o0, o1 = bk.oe.CalcSpinOdds(game)
		}
		bankWager := 20 + rand.Intn(81) // 20-100
		// bet against stronger (more bets on weaker)
		pick := PickPlayer0
		bankOdds := o1
		if o0 > o1 {
			pick = PickPlayer1
			bankOdds = o0
		}
		// 60% chance bet on favorite, 40% on underdog
		if rand.Float64() > 0.6 {
			if pick == PickPlayer0 {
				pick = PickPlayer1
				bankOdds = o0
			} else {
				pick = PickPlayer0
				bankOdds = o1
			}
		}
		b := pool.Place("banque", kind, pick, bankWager, bankOdds)
		placed = append(placed, b)
	}
	return placed
}

// ─── bet result notification ──────────────────────────────────

func (bp *BettingPool) Snapshot() []*Bet {
	bp.mu.Lock()
	defer bp.mu.Unlock()
	out := make([]*Bet, len(bp.bets))
	copy(out, bp.bets)
	return out
}

func (bp *BettingPool) OpenBetsByKind(kind BetKind) []*Bet {
	bp.mu.Lock()
	defer bp.mu.Unlock()
	var out []*Bet
	for _, b := range bp.bets {
		if !b.Resolved && b.Kind == kind {
			out = append(out, b)
		}
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Amount > out[j].Amount })
	return out
}
