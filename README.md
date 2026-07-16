# ⚓ Bataille Navale — Multijoueur temps réel

Jeu de bataille navale multijoueur (web, mobile + desktop) avec chat, système de
points et mises. Serveur Go ultra-rapide, front TypeScript ~6 KB gzip.

## Fonctionnalités

- **Duels 1v1** : lobby avec liste des joueurs en ligne, système de défis
- **Mises** : chaque joueur démarre avec 100 points, le gagnant rafle la mise
- **Persistance** : points, victoires et défaites rattachés au pseudo,
  stockés dans une base **bbolt** embarquée (`data/battleship.db`),
  conservés entre les sessions et redémarrages
- **Chat** : chat du lobby (historique persisté, les 50 derniers messages
  sont rechargés à la connexion) + chat privé pendant les parties
- **Classement** : top 10 en temps réel dans le lobby
- **Règle classique** : un tir par tour, on rejoue si on touche
- **Parties simultanées** : le serveur gère un nombre illimité de duels en parallèle
- **Roulette du destin** 🎰 : pendant un duel, mise 10 points pour lancer la
  roue — 50/50 entre toi et l'adversaire ; le gagnant débloque une
  **attaque de zone 3×3** (animée et sonorisée)
- **Revanche** en un clic avec la même mise
- **Abandon/déconnexion** = forfait, la mise va à l'adversaire

## Stack

| Côté    | Techno                                        |
| ------- | --------------------------------------------- |
| Serveur | Go + gorilla/websocket, état en mémoire       |
| Front   | Vite + TypeScript vanilla (zéro framework)    |
| Données | bbolt — base clé/valeur embarquée (`data/battleship.db`) |

## Lancer en local

Prérequis : Go 1.21+, Node 18+.

```bash
# 1. Builder le front (une seule fois, ou après modification du client)
cd client
npm install
npm run build      # génère ../static/

# 2. Builder et lancer le serveur
cd ..
go build -o battleship .
PORT=3000 ./battleship
```

Ouvre <http://localhost:3000> — c'est prêt.

> Le port par défaut est `8080` (variable d'environnement `PORT` pour changer).

### Développement front avec hot-reload

```bash
# Terminal 1 : serveur Go
PORT=3000 go run .

# Terminal 2 : Vite en mode dev (proxy /ws vers le serveur)
cd client && npm run dev
```

Note : le proxy Vite pointe vers `ws://localhost:8080` par défaut
(`client/vite.config.ts`), adapte-le si tu utilises un autre port.

## Jouer sur le réseau local

1. Lance le serveur : `PORT=3000 ./battleship`
2. Trouve ton IP locale :
   ```bash
   ipconfig getifaddr en0   # macOS (Wi-Fi)
   ```
3. Les autres joueurs se connectent depuis leur téléphone/PC sur le même
   Wi-Fi : `http://TON_IP:3000` (ex. `http://192.168.1.42:3000`)

## Déployer sur Railway

Railway détecte automatiquement le projet Go via `go.mod`.

1. Pousse le repo sur GitHub **avec le dossier `static/` buildé**
   (lance `npm run build` dans `client/` avant de commit)
2. Sur [railway.app](https://railway.app) : *New Project → Deploy from GitHub repo*
3. Railway build et lance le binaire automatiquement ; la variable `PORT`
   est injectée par Railway, rien à configurer
4. (Optionnel) Ajoute un **Volume** monté sur `/app/data` pour conserver
   les scores entre les déploiements

## Structure du projet

```
├── main.go        # HTTP + WebSocket + fichiers statiques
├── hub.go         # Lobby, défis, chat, routage des messages
├── game.go        # Logique de jeu (placement, tirs, victoire)
├── client.go      # Connexion WebSocket (read/write pumps)
├── store.go       # Persistance joueurs + chat (bbolt embarqué)
├── client/        # Sources front (Vite + TypeScript)
│   └── src/
│       ├── main.ts      # UI et logique client
│       ├── style.css    # Thème néon océanique
│       ├── sounds.ts    # Effets sonores (Web Audio API)
│       └── confetti.ts  # Effet de victoire
├── static/        # Front buildé (servi par le serveur Go)
└── data/          # Base bbolt (créée au premier lancement)
```

## Observabilité & débogage

Les logs sont structurés et centralisés, au format :
`2026-07-16T01:36:46+01:00 INFO [composant] message clé=valeur`

Composants : `boot`, `ws` (connexions), `join`, `challenge`, `game`
(début/fin/forfait), `spin` (roulette), `zone` (attaques 3×3), `client`
(erreurs JavaScript remontées automatiquement depuis les navigateurs).

| Endpoint  | Usage                                                        |
| --------- | ------------------------------------------------------------ |
| `/health` | JSON : uptime, joueurs en ligne, connexions, parties actives |
| `/logs`   | 200 dernières lignes de log (`?n=500` pour plus)             |

- **En local** : les logs sortent sur stdout + `curl localhost:4000/logs`
- **Sur Railway** : stdout est capté automatiquement → onglet *Deployments →
  View Logs* (ou `railway logs`) ; `/logs` reste dispo pour un accès HTTP rapide
- **Sécurité prod** : définis la variable d'environnement `LOGS_TOKEN` pour
  protéger l'endpoint → `/logs?token=TON_TOKEN`

## Règles du jeu

- Grille 10×10, 5 bateaux : Porte-avions (5), Croiseur (4),
  Contre-torpilleur (3), Sous-marin (3), Torpilleur (2)
- Chacun place sa flotte (manuellement ou aléatoirement)
- Un tir par tour ; **si tu touches, tu rejoues**
- Premier à couler toute la flotte adverse gagne la mise
