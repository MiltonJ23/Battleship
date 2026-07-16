package main

import (
	"encoding/binary"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"

	bolt "go.etcd.io/bbolt"
)

var (
	bucketPlayers = []byte("players")
	bucketChat    = []byte("chat")
	bucketLoans   = []byte("loans")
)

type PlayerRecord struct {
	Name   string `json:"name"`
	Points int    `json:"points"`
	Wins   int    `json:"wins"`
	Losses int    `json:"losses"`
}

type ChatRecord struct {
	From    string `json:"from"`
	Text    string `json:"text"`
	At      int64  `json:"at"`
	ReplyTo string `json:"replyTo,omitempty"`
}

type Store struct {
	db *bolt.DB
}

func NewStore(file string) *Store {
	os.MkdirAll(filepath.Dir(file), 0755)
	db, err := bolt.Open(file, 0600, nil)
	if err != nil {
		panic(err)
	}
	db.Update(func(tx *bolt.Tx) error {
		tx.CreateBucketIfNotExists(bucketPlayers)
		tx.CreateBucketIfNotExists(bucketChat)
		tx.CreateBucketIfNotExists(bucketLoans)
		return nil
	})
	s := &Store{db: db}
	s.migrateJSON(filepath.Join(filepath.Dir(file), "players.json"))
	return s
}

// migrateJSON imports legacy players.json if present, then removes it
func (s *Store) migrateJSON(jsonFile string) {
	data, err := os.ReadFile(jsonFile)
	if err != nil {
		return
	}
	var legacy struct {
		Players []*PlayerRecord `json:"players"`
	}
	if json.Unmarshal(data, &legacy) != nil {
		return
	}
	s.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket(bucketPlayers)
		for _, p := range legacy.Players {
			if b.Get([]byte(p.Name)) == nil {
				v, _ := json.Marshal(p)
				b.Put([]byte(p.Name), v)
			}
		}
		return nil
	})
	os.Remove(jsonFile)
}

func (s *Store) GetOrCreate(name string) *PlayerRecord {
	var p PlayerRecord
	s.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket(bucketPlayers)
		if v := b.Get([]byte(name)); v != nil {
			json.Unmarshal(v, &p)
			return nil
		}
		p = PlayerRecord{Name: name, Points: 100}
		v, _ := json.Marshal(&p)
		return b.Put([]byte(name), v)
	})
	return &p
}

func (s *Store) UpdateAfterGame(winner, loser string, wager int) {
	s.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket(bucketPlayers)
		var wp, lp PlayerRecord
		if v := b.Get([]byte(winner)); v != nil {
			json.Unmarshal(v, &wp)
		} else {
			return nil
		}
		if v := b.Get([]byte(loser)); v != nil {
			json.Unmarshal(v, &lp)
		} else {
			return nil
		}
		wp.Points += wager
		wp.Wins++
		lp.Points -= wager
		if lp.Points < 0 {
			lp.Points = 0
		}
		lp.Losses++
		wv, _ := json.Marshal(&wp)
		lv, _ := json.Marshal(&lp)
		b.Put([]byte(winner), wv)
		b.Put([]byte(loser), lv)
		return nil
	})
}

func (s *Store) AddPoints(name string, delta int) {
	s.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket(bucketPlayers)
		v := b.Get([]byte(name))
		if v == nil {
			return nil
		}
		var p PlayerRecord
		if json.Unmarshal(v, &p) != nil {
			return nil
		}
		p.Points += delta
		if p.Points < 0 {
			p.Points = 0
		}
		nv, _ := json.Marshal(&p)
		return b.Put([]byte(name), nv)
	})
}

func (s *Store) GetLeaderboard(limit int) []*PlayerRecord {
	var all []*PlayerRecord
	s.db.View(func(tx *bolt.Tx) error {
		return tx.Bucket(bucketPlayers).ForEach(func(_, v []byte) error {
			var p PlayerRecord
			if json.Unmarshal(v, &p) == nil {
				all = append(all, &p)
			}
			return nil
		})
	})
	sort.Slice(all, func(i, j int) bool { return all[i].Points > all[j].Points })
	if limit > len(all) {
		limit = len(all)
	}
	return all[:limit]
}

const chatHistoryMax = 200

func (s *Store) AppendChat(from, text string, at int64, replyTo string) string {
	var msgID string
	s.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket(bucketChat)
		id, _ := b.NextSequence()
		key := make([]byte, 8)
		binary.BigEndian.PutUint64(key, id)
		msgID = fmt.Sprintf("%d", id)
		v, _ := json.Marshal(&ChatRecord{From: from, Text: text, At: at, ReplyTo: replyTo})
		if err := b.Put(key, v); err != nil {
			return err
		}
		// prune old messages beyond chatHistoryMax
		c := b.Cursor()
		count := 0
		for k, _ := c.Last(); k != nil; k, _ = c.Prev() {
			count++
			if count > chatHistoryMax {
				b.Delete(k)
			}
		}
		return nil
	})
	return msgID
}

func (s *Store) GetChatSnippet(id string) string {
	if id == "" {
		return ""
	}
	var key [8]byte
	var num uint64
	fmt.Sscanf(id, "%d", &num)
	binary.BigEndian.PutUint64(key[:], num)
	var snippet string
	s.db.View(func(tx *bolt.Tx) error {
		v := tx.Bucket(bucketChat).Get(key[:])
		if v == nil {
			return nil
		}
		var m ChatRecord
		if json.Unmarshal(v, &m) == nil {
			t := m.Text
			if len(t) > 50 {
				t = t[:50] + "…"
			}
			snippet = t
		}
		return nil
	})
	return snippet
}

// ─── loan system ─────────────────────────────────────────────

type LoanRecord struct {
	Player      string `json:"player"`
	Principal   int    `json:"principal"`   // amount borrowed
	Remaining   int    `json:"remaining"`   // left to repay
	Rate        int    `json:"rate"`        // extra % cost
	Installment int    `json:"installment"` // 0 = lump sum, >0 = per-win auto-deduct
	Repaid      int    `json:"repaid"`
}

// ApproveLoan creates a loan and credits the player immediately.
func (s *Store) ApproveLoan(player string, amount, rate, installment int) {
	s.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket(bucketLoans)
		// only one active loan per player
		if b.Get([]byte(player)) != nil {
			return nil
		}
		rec := &LoanRecord{Player: player, Principal: amount, Remaining: amount + (amount * rate / 100), Rate: rate, Installment: installment}
		v, _ := json.Marshal(rec)
		b.Put([]byte(player), v)

		pb := tx.Bucket(bucketPlayers)
		if pv := pb.Get([]byte(player)); pv != nil {
			var p PlayerRecord
			json.Unmarshal(pv, &p)
			p.Points += amount
			nv, _ := json.Marshal(&p)
			pb.Put([]byte(player), nv)
		}
		return nil
	})
}

func (s *Store) GetLoan(player string) *LoanRecord {
	var rec LoanRecord
	s.db.View(func(tx *bolt.Tx) error {
		v := tx.Bucket(bucketLoans).Get([]byte(player))
		if v != nil {
			json.Unmarshal(v, &rec)
		}
		return nil
	})
	if rec.Player == "" {
		return nil
	}
	return &rec
}

// CollectCommission deducts from winner's wager toward loan repayment.
// Returns (collected, loanFullyRepaid).
func (s *Store) CollectCommission(winner string, wager int) (int, bool) {
	collected := 0
	paid := false
	s.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket(bucketLoans)
		raw := b.Get([]byte(winner))
		if raw == nil {
			return nil
		}
		var rec LoanRecord
		json.Unmarshal(raw, &rec)
		if rec.Remaining <= 0 {
			b.Delete([]byte(winner))
			return nil
		}
		var take int
		if rec.Installment > 0 {
			take = rec.Installment
		} else {
			take = rec.Remaining // lump sum
		}
		if take > wager {
			take = wager
		}
		if take > rec.Remaining {
			take = rec.Remaining
		}
		rec.Remaining -= take
		rec.Repaid += take
		if rec.Remaining <= 0 {
			b.Delete([]byte(winner))
			paid = true
		} else {
			v, _ := json.Marshal(&rec)
			b.Put([]byte(winner), v)
		}
		collected = take

		pb := tx.Bucket(bucketPlayers)
		if pv := pb.Get([]byte(winner)); pv != nil {
			var p PlayerRecord
			json.Unmarshal(pv, &p)
			p.Points -= take
			if p.Points < 0 {
				p.Points = 0
			}
			nv, _ := json.Marshal(&p)
			pb.Put([]byte(winner), nv)
		}
		return nil
	})
	return collected, paid
}

func (s *Store) GetRecentChat(limit int) []map[string]interface{} {
	var msgs []map[string]interface{}
	s.db.View(func(tx *bolt.Tx) error {
		c := tx.Bucket(bucketChat).Cursor()
		for k, v := c.Last(); k != nil && len(msgs) < limit; k, v = c.Prev() {
			var m ChatRecord
			if json.Unmarshal(v, &m) == nil {
				id := binary.BigEndian.Uint64(k)
				msgs = append(msgs, map[string]interface{}{
					"id":       fmt.Sprintf("%d", id),
					"from":     m.From,
					"text":     m.Text,
					"at":       m.At,
					"replyTo":  m.ReplyTo,
				})
			}
		}
		return nil
	})
	for i, j := 0, len(msgs)-1; i < j; i, j = i+1, j-1 {
		msgs[i], msgs[j] = msgs[j], msgs[i]
	}
	return msgs
}
