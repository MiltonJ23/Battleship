PORT ?= 8080

.PHONY: run build build-client build-server dev clean

run: build
	PORT=$(PORT) ./out

build: build-client build-server

build-client:
	cd client && npm install --no-audit --no-fund && npm run build

build-server:
	go build -o out .

dev:
	PORT=$(PORT) go run . & cd client && npm run dev

clean:
	rm -rf battleship static client/node_modules
