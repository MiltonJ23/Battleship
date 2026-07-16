package main

import (
	"fmt"
	"log"
	"os"
	"strings"
	"sync"
	"time"
)

// LogBuffer keeps the last N log lines in memory and tees everything to stdout,
// so logs are visible both in `railway logs` (stdout) and via GET /logs.
type LogBuffer struct {
	mu      sync.Mutex
	entries []string
	max     int
}

func NewLogBuffer(max int) *LogBuffer {
	return &LogBuffer{max: max}
}

func (l *LogBuffer) Write(p []byte) (int, error) {
	l.mu.Lock()
	defer l.mu.Unlock()
	line := strings.TrimRight(string(p), "\n")
	if line != "" {
		l.entries = append(l.entries, line)
		if len(l.entries) > l.max {
			l.entries = l.entries[len(l.entries)-l.max:]
		}
	}
	return len(p), nil
}

func (l *LogBuffer) Tail(n int) []string {
	l.mu.Lock()
	defer l.mu.Unlock()
	if n <= 0 || n > len(l.entries) {
		n = len(l.entries)
	}
	out := make([]string, n)
	copy(out, l.entries[len(l.entries)-n:])
	return out
}

var logBuf = NewLogBuffer(1000)

func initLogging() {
	log.SetFlags(0)
	log.SetOutput(os.Stdout)
	// tee: stdout + ring buffer
	log.SetOutput(teeWriter{})
}

type teeWriter struct{}

func (teeWriter) Write(p []byte) (int, error) {
	os.Stdout.Write(p)
	return logBuf.Write(p)
}

func logf(level, component, format string, args ...interface{}) {
	ts := time.Now().Format("2006-01-02T15:04:05.000Z07:00")
	log.Printf("%s %-5s [%s] %s", ts, level, component, fmt.Sprintf(format, args...))
}

func logInfo(component, format string, args ...interface{})  { logf("INFO", component, format, args...) }
func logWarn(component, format string, args ...interface{})  { logf("WARN", component, format, args...) }
func logError(component, format string, args ...interface{}) { logf("ERROR", component, format, args...) }
