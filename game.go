package main

import (
	"math/rand"
	"sync"
	"time"
)

const GridSize = 10

var ShipSizes = []int{5, 4, 3, 3, 2}
var ShipNames = []string{"Porte-avions", "Croiseur", "Contre-torpilleur", "Sous-marin", "Torpilleur"}

type CellState int

const (
	CellEmpty CellState = iota
	CellShip
	CellMiss
	CellHit
)

type Ship struct {
	Name   string `json:"name"`
	Size   int    `json:"size"`
	Row    int    `json:"row"`
	Col    int    `json:"col"`
	Horiz  bool   `json:"horiz"`
	Hits   int    `json:"hits"`
	Sunk   bool   `json:"sunk"`
}

type PlayerBoard struct {
	Grid  [GridSize][GridSize]CellState
	Ships []*Ship
	Ready bool
}

type GamePhase int

const (
	PhasePlacement GamePhase = iota
	PhaseBattle
	PhaseOver
)

type Game struct {
	ID             string
	Players        [2]string
	Boards         [2]*PlayerBoard
	Turn           int
	Phase          GamePhase
	Wager          int
	Winner         string
	RematchVotes   [2]bool
	PendingZone    [2]bool
	Spectators     map[string]*Client
	Events         []GameEvent
	Bets           *BettingPool
	mu             sync.Mutex
}

type GameEvent struct {
	Type   string                 `json:"type"`
	Player int                    `json:"player"`
	Data   map[string]interface{} `json:"data"`
}

func (g *Game) AddEvent(evt GameEvent) {
	g.mu.Lock()
	g.Events = append(g.Events, evt)
	if len(g.Events) > 50 {
		g.Events = g.Events[len(g.Events)-50:]
	}
	g.mu.Unlock()
}

func (g *Game) RecentEvents(n int) []GameEvent {
	g.mu.Lock()
	defer g.mu.Unlock()
	if n <= 0 || n > len(g.Events) {
		n = len(g.Events)
	}
	return g.Events[len(g.Events)-n:]
}

func NewGame(id string, p1, p2 string, wager int) *Game {
	return &Game{
		ID:         id,
		Players:    [2]string{p1, p2},
		Boards:     [2]*PlayerBoard{{}, {}},
		Turn:       rand.Intn(2),
		Phase:      PhasePlacement,
		Wager:      wager,
		Spectators: make(map[string]*Client),
		Events:     make([]GameEvent, 0),
		Bets:       NewBettingPool(),
	}
}

func (g *Game) PlayerIndex(name string) int {
	if g.Players[0] == name {
		return 0
	}
	if g.Players[1] == name {
		return 1
	}
	return -1
}

type ShipPlacement struct {
	Row   int  `json:"row"`
	Col   int  `json:"col"`
	Horiz bool `json:"horiz"`
}

func (g *Game) PlaceShips(playerIdx int, placements []ShipPlacement) bool {
	g.mu.Lock()
	defer g.mu.Unlock()

	if g.Phase != PhasePlacement || len(placements) != len(ShipSizes) {
		return false
	}
	board := &PlayerBoard{}
	for i, p := range placements {
		size := ShipSizes[i]
		if !canPlace(board, p.Row, p.Col, size, p.Horiz) {
			return false
		}
		ship := &Ship{Name: ShipNames[i], Size: size, Row: p.Row, Col: p.Col, Horiz: p.Horiz}
		board.Ships = append(board.Ships, ship)
		for k := 0; k < size; k++ {
			r, c := p.Row, p.Col
			if p.Horiz {
				c += k
			} else {
				r += k
			}
			board.Grid[r][c] = CellShip
		}
	}
	board.Ready = true
	g.Boards[playerIdx] = board

	if g.Boards[0].Ready && g.Boards[1].Ready {
		g.Phase = PhaseBattle
	}
	return true
}

func canPlace(b *PlayerBoard, row, col, size int, horiz bool) bool {
	for k := 0; k < size; k++ {
		r, c := row, col
		if horiz {
			c += k
		} else {
			r += k
		}
		if r < 0 || r >= GridSize || c < 0 || c >= GridSize {
			return false
		}
		if b.Grid[r][c] != CellEmpty {
			return false
		}
	}
	return true
}

func RandomPlacements() []ShipPlacement {
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))
	for {
		board := &PlayerBoard{}
		placements := make([]ShipPlacement, 0, len(ShipSizes))
		ok := true
		for _, size := range ShipSizes {
			placed := false
			for try := 0; try < 200; try++ {
				horiz := rng.Intn(2) == 0
				row := rng.Intn(GridSize)
				col := rng.Intn(GridSize)
				if canPlace(board, row, col, size, horiz) {
					placements = append(placements, ShipPlacement{Row: row, Col: col, Horiz: horiz})
					for k := 0; k < size; k++ {
						r, c := row, col
						if horiz {
							c += k
						} else {
							r += k
						}
						board.Grid[r][c] = CellShip
					}
					placed = true
					break
				}
			}
			if !placed {
				ok = false
				break
			}
		}
		if ok {
			return placements
		}
	}
}

type FireResult struct {
	Valid     bool
	Hit       bool
	Sunk      bool
	SunkShip  *Ship
	GameOver  bool
	Row, Col  int
	NextTurn  int
}

func (g *Game) Fire(playerIdx, row, col int) FireResult {
	g.mu.Lock()
	defer g.mu.Unlock()

	res := FireResult{Row: row, Col: col}
	if g.Phase != PhaseBattle || g.Turn != playerIdx {
		return res
	}
	if row < 0 || row >= GridSize || col < 0 || col >= GridSize {
		return res
	}
	enemy := g.Boards[1-playerIdx]
	cell := enemy.Grid[row][col]
	if cell == CellMiss || cell == CellHit {
		return res
	}
	res.Valid = true

	if cell == CellShip {
		enemy.Grid[row][col] = CellHit
		res.Hit = true
		for _, s := range enemy.Ships {
			if s.Sunk {
				continue
			}
			inShip := false
			for k := 0; k < s.Size; k++ {
				r, c := s.Row, s.Col
				if s.Horiz {
					c += k
				} else {
					r += k
				}
				if r == row && c == col {
					inShip = true
					break
				}
			}
			if inShip {
				s.Hits++
				if s.Hits >= s.Size {
					s.Sunk = true
					res.Sunk = true
					res.SunkShip = s
				}
				break
			}
		}
		allSunk := true
		for _, s := range enemy.Ships {
			if !s.Sunk {
				allSunk = false
				break
			}
		}
		if allSunk {
			g.Phase = PhaseOver
			g.Winner = g.Players[playerIdx]
			res.GameOver = true
		}
		// hit => same player plays again (règle classique)
	} else {
		enemy.Grid[row][col] = CellMiss
		g.Turn = 1 - playerIdx
	}
	res.NextTurn = g.Turn
	return res
}

// ShipsLeft returns number of unsunk ships for a player
func (g *Game) ShipsLeft(playerIdx int) int {
	n := 0
	for _, s := range g.Boards[playerIdx].Ships {
		if !s.Sunk {
			n++
		}
	}
	return n
}

type ZoneCellResult struct {
	Row    int    `json:"y"`
	Col    int    `json:"x"`
	Result string `json:"result"` // "hit", "miss", "sunk", "skip" (already shot)
	Ship   string `json:"ship,omitempty"`
}

type ZoneResult struct {
	Valid    bool
	Cells    []ZoneCellResult
	GameOver bool
	NextTurn int
}

// FireZone shoots a 3x3 zone centered on (row,col). Requires PendingZone.
func (g *Game) FireZone(playerIdx, row, col int) ZoneResult {
	g.mu.Lock()
	defer g.mu.Unlock()

	res := ZoneResult{}
	if g.Phase != PhaseBattle || g.Turn != playerIdx || !g.PendingZone[playerIdx] {
		return res
	}
	if row < 0 || row >= GridSize || col < 0 || col >= GridSize {
		return res
	}
	g.PendingZone[playerIdx] = false
	res.Valid = true
	enemy := g.Boards[1-playerIdx]

	for dr := -1; dr <= 1; dr++ {
		for dc := -1; dc <= 1; dc++ {
			r, c := row+dr, col+dc
			if r < 0 || r >= GridSize || c < 0 || c >= GridSize {
				continue
			}
			cell := enemy.Grid[r][c]
			cr := ZoneCellResult{Row: r, Col: c}
			switch cell {
			case CellMiss, CellHit:
				cr.Result = "skip"
			case CellShip:
				enemy.Grid[r][c] = CellHit
				cr.Result = "hit"
				for _, s := range enemy.Ships {
					if s.Sunk {
						continue
					}
					for k := 0; k < s.Size; k++ {
						sr, sc := s.Row, s.Col
						if s.Horiz {
							sc += k
						} else {
							sr += k
						}
						if sr == r && sc == c {
							s.Hits++
							if s.Hits >= s.Size {
								s.Sunk = true
								cr.Result = "sunk"
								cr.Ship = s.Name
							}
							break
						}
					}
				}
			default:
				enemy.Grid[r][c] = CellMiss
				cr.Result = "miss"
			}
			res.Cells = append(res.Cells, cr)
		}
	}

	allSunk := true
	for _, s := range enemy.Ships {
		if !s.Sunk {
			allSunk = false
			break
		}
	}
	if allSunk {
		g.Phase = PhaseOver
		g.Winner = g.Players[playerIdx]
		res.GameOver = true
	} else {
		anyHit := false
		for _, c := range res.Cells {
			if c.Result == "hit" || c.Result == "sunk" {
				anyHit = true
				break
			}
		}
		if !anyHit {
			g.Turn = 1 - playerIdx
		}
	}
	res.NextTurn = g.Turn
	return res
}
