package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

var startTime = time.Now()

func serveWS(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		logError("ws", "upgrade failed from %s: %v", r.RemoteAddr, err)
		return
	}
	logInfo("ws", "connection opened from %s", r.RemoteAddr)
	client := &Client{
		Conn: conn,
		Send: make(chan []byte, 256),
		Hub:  hub,
		Addr: r.RemoteAddr,
	}
	go client.writePump()
	go client.readPump()
	hub.addConn(client)

	client.sendJSON(map[string]interface{}{
		"type":     "chat_history",
		"messages": hub.store.GetRecentChat(50),
	})
}

func main() {
	initLogging()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	store := NewStore(filepath.Join("data", "battleship.db"))
	hub := NewHub(store)

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWS(hub, w, r)
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		hub.mu.Lock()
		stats := map[string]interface{}{
			"status":        "ok",
			"uptime":        time.Since(startTime).Round(time.Second).String(),
			"playersOnline": len(hub.clients),
			"connections":   len(hub.conns),
			"activeGames":   len(hub.games),
		}
		hub.mu.Unlock()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(stats)
	})

	http.HandleFunc("/logs", func(w http.ResponseWriter, r *http.Request) {
		token := os.Getenv("LOGS_TOKEN")
		if token != "" && r.URL.Query().Get("token") != token {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		n := 200
		if q := r.URL.Query().Get("n"); q != "" {
			if v, err := strconv.Atoi(q); err == nil {
				n = v
			}
		}
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		for _, line := range logBuf.Tail(n) {
			w.Write([]byte(line + "\n"))
		}
	})

	fs := http.FileServer(http.Dir("static"))
	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/assets/") {
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		} else {
			w.Header().Set("Cache-Control", "no-cache")
		}
		fs.ServeHTTP(w, r)
	}))

	logInfo("boot", "battleship server starting on :%s (pid %d)", port, os.Getpid())
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
