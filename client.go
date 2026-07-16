package main

import (
	"encoding/json"
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	Conn   *websocket.Conn
	Send   chan []byte
	Hub    *Hub
	Name   string
	GameID string
	Addr   string
}

func (c *Client) sendJSON(v interface{}) {
	defer func() { recover() }()
	data, err := json.Marshal(v)
	if err != nil {
		return
	}
	select {
	case c.Send <- data:
	default:
	}
}

func (c *Client) readPump() {
	defer func() {
		recover()
		close(c.Send)
	}()
	c.Conn.SetReadLimit(4096)
	c.Conn.SetReadDeadline(time.Now().Add(120 * time.Second))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(120 * time.Second))
		return nil
	})
	for {
		_, msgBytes, err := c.Conn.ReadMessage()
		if err != nil {
			return
		}
		var msg map[string]json.RawMessage
		if err := json.Unmarshal(msgBytes, &msg); err != nil {
			continue
		}
		typeRaw, ok := msg["type"]
		if !ok {
			continue
		}
		var msgType string
		json.Unmarshal(typeRaw, &msgType)

		c.Hub.mu.Lock()
		c.Hub.handleMessage(c, msgType, msg)
		c.Hub.mu.Unlock()
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(30 * time.Second)
	defer func() {
		ticker.Stop()
		recover()
		c.Conn.Close()
		c.Hub.handleDisconnect(c)
	}()
	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}
		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
