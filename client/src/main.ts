import "./style.css";
import { audio } from "./sounds";
import { confetti } from "./confetti";

const GRID = 10;
const SHIP_SIZES = [5, 4, 3, 3, 2];

type Screen = "join" | "lobby" | "placement" | "battle" | "gameover" | "spectate";

interface Placement {
  row: number;
  col: number;
  horiz: boolean;
}

let screen: Screen = "join";
let myName = "";
let myPoints = 0;
let myWins = 0;
let myLosses = 0;
let myIdx = 0;
let opponent = "";
let wager = 0;
let myTurn = false;
let waitingOpponent = false;

let players: any[] = [];
let leaderboard: any[] = [];

let myShips: Placement[] = [];
let shipOrientation = true;

let enemyGrid: number[][] = emptyGrid(); // 0 unknown, 2 miss, 3 hit
let ownGrid: number[][] = emptyGrid(); // 0 empty, 1 ship, 2 miss, 3 hit

let iWon = false;
let pointsEarned = 0;
let forfeitWin = false;
let zoneReady = false;
let zoneMode = false;

let chatMessages: { id?: string; from: string; text: string; scope: string; replyTo?: string; replySnip?: string }[] = [];
let replyTarget: { id: string; from: string; text: string } | null = null;
let activeLoan: { principal: number; remaining: number; rate: number; installment: number; repaid: number } | null = null;

let ws: WebSocket;

function emptyGrid(): number[][] {
  return Array.from({ length: GRID }, () => Array(GRID).fill(0));
}

function connect() {
  const proto = location.protocol === "https:" ? "wss" : "ws";
  ws = new WebSocket(`${proto}://${location.host}/ws`);
  ws.onopen = () => {
    if (myName && screen !== "join") send({ type: "join", name: myName });
  };
  ws.onmessage = (e) => {
    try {
      handleMessage(JSON.parse(e.data));
    } catch {}
  };
  ws.onclose = () => {
    setTimeout(connect, 2000);
  };
}

function send(data: Record<string, any>) {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
}

function handleMessage(msg: any) {
  switch (msg.type) {
    case "joined":
      myName = msg.name;
      myPoints = msg.points;
      myWins = msg.wins;
      myLosses = msg.losses;
      sessionStorage.setItem("bs_name", myName);
      screen = "lobby";
      send({ type: "loan_status" });
      render();
      break;

    case "lobby_update":
      players = msg.players || [];
      leaderboard = msg.leaderboard || [];
      if (msg.me) {
        myPoints = msg.me.points;
        myWins = msg.me.wins;
        myLosses = msg.me.losses;
      }
      if (screen === "lobby") render();
      break;

    case "challenge_sent":
      toast(`Défi envoyé à ${msg.target} — mise ${msg.wager} pts ⏳`);
      break;

    case "challenge_received":
      showChallengeDialog(msg.challenger, msg.wager);
      break;

    case "challenge_declined":
      toast(`${msg.target} a refusé ton défi 😤`);
      break;

    case "game_start":
      opponent = msg.opponent;
      wager = msg.wager;
      myIdx = msg.playerIdx ?? 0;
      myShips = [];
      shipOrientation = true;
      myTurn = false;
      waitingOpponent = false;
      zoneReady = false;
      zoneMode = false;
      enemyGrid = emptyGrid();
      ownGrid = emptyGrid();
      chatMessages = chatMessages.filter((m) => m.scope !== "game");
      screen = "placement";
      render();
      break;

    case "ships_accepted":
      waitingOpponent = true;
      if (screen === "placement") render();
      break;

    case "opponent_ready":
      toast(`${opponent} est prêt ! ⚓`);
      break;

    case "battle_start":
      myTurn = !!msg.yourTurn;
      screen = "battle";
      render();
      break;

    case "fire_result": {
      const { x, y, result, ship, shooter } = msg;
      const isHit = result === "hit" || result === "sunk";
      if (shooter === myIdx) {
        enemyGrid[y][x] = isHit ? 3 : 2;
        audio.play(result === "sunk" ? "sunk" : isHit ? "hit" : "miss");
        if (result === "sunk") toast(`💥 ${ship} ennemi coulé !`);
        else if (isHit) toast("🎯 Touché !");
      } else {
        ownGrid[y][x] = isHit ? 3 : 2;
        audio.play(isHit ? "hit" : "miss");
        if (result === "sunk") toast(`☠️ Ton ${ship} a été coulé...`);
      }
      myTurn = !!msg.yourTurn;
      if (screen === "battle" && !msg.gameOver) {
        updateTurnUI();
        renderBattleGrids();
        animateShot(shooter === myIdx ? "enemy-grid" : "own-grid", x, y, isHit);
      }
      break;
    }

    case "loan_approved":
      if (typeof msg.newPoints === "number") myPoints = msg.newPoints;
      activeLoan = { principal: msg.amount, remaining: msg.amount + (msg.amount * msg.rate / 100), rate: msg.rate, installment: msg.installment || 0, repaid: 0 };
      toast(`🏦 Prêt de ${msg.amount} pts accordé ! Taux: ${msg.rate}%. Nouveau solde: ${myPoints} pts`);
      if (screen === "lobby") render();
      break;

    case "loan_status":
      activeLoan = { principal: msg.principal, remaining: msg.remaining, rate: msg.rate, installment: msg.installment || 0, repaid: msg.repaid };
      if (screen === "lobby") render();
      break;

    case "game_over":
      iWon = !!msg.won;
      pointsEarned = msg.pointsEarned || 0;
      forfeitWin = msg.reason === "forfeit";
      if (typeof msg.newPoints === "number") myPoints = msg.newPoints;
      screen = "gameover";
      audio.play(iWon ? "win" : "lose");
      render();
      if (iWon) setTimeout(() => confetti(document.body), 200);
      break;

    case "rematch_requested":
      toast(`${opponent} veut une revanche ! 🔄`);
      break;

    case "opponent_left":
      toast(`${opponent} a quitté`);
      if (screen === "gameover") render();
      break;

    case "spin_result":
      if (typeof msg.spinnerPoints === "number" && msg.youSpun) myPoints = msg.spinnerPoints;
      showSpinWheel(!!msg.youBenefit, !!msg.youSpun, () => {
        if (msg.youBenefit) {
          zoneReady = true;
          toast("💣 Attaque de zone 3×3 débloquée !");
        } else {
          toast(`😱 ${opponent} a gagné l'attaque de zone !`);
        }
        if (screen === "battle") renderBattle();
      });
      break;

    case "zone_result": {
      const isMine = msg.shooter === myIdx;
      audio.play("zone");
      let sunkShips: string[] = [];
      (msg.cells || []).forEach((cell: any, i: number) => {
        const { x, y, result } = cell;
        if (result === "skip") return;
        const isHit = result === "hit" || result === "sunk";
        if (result === "sunk" && cell.ship) sunkShips.push(cell.ship);
        setTimeout(() => {
          if (isMine) enemyGrid[y][x] = isHit ? 3 : 2;
          else ownGrid[y][x] = isHit ? 3 : 2;
          if (screen === "battle") {
            renderBattleGrids();
            animateShot(isMine ? "enemy-grid" : "own-grid", x, y, isHit);
          }
        }, i * 110);
      });
      if (isMine) {
        zoneReady = false;
        zoneMode = false;
      }
      myTurn = !!msg.yourTurn;
      setTimeout(() => {
        if (sunkShips.length) {
          toast(isMine ? `💥 Coulé : ${sunkShips.join(", ")} !` : `☠️ Coulé : ${sunkShips.join(", ")}...`);
          audio.play("sunk");
        }
        if (screen === "battle" && !msg.gameOver) renderBattle();
      }, 1100);
      break;
    }

    case "chat_history":
    case "live_matches":
      liveMatches = msg.matches || [];
      if (screen === "lobby") renderLiveMatchesPanel();
      break;

    case "spectate_start":
      specP1 = msg.p1;
      specP2 = msg.p2;
      specBoard1 = msg.board1 || emptyGrid();
      specBoard2 = msg.board2 || emptyGrid();
      specEvents = msg.events || [];
      specTurnName = msg.turnName;
      screen = "spectate";
      render();
      break;

    case "spectate_fire": {
      const { x, y, result, shooter } = msg;
      const isHit = result === "hit" || result === "sunk";
      const targetBoard = shooter === 0 ? specBoard2 : specBoard1;
      targetBoard[y][x] = isHit ? 3 : 2;
      specTurnName = msg.turnName;
      if (screen === "spectate") {
        renderSpectateGrids();
        setTimeout(() => animateShot("spec-grid-" + (shooter === 0 ? 2 : 1), x, y, isHit), 100);
      }
      break;
    }

    case "spectate_end":
      screen = "lobby";
      render();
      break;

    case "bets_resolved":
      toast(`⚡ Paris résolus : ${msg.kind}`);
      break;
      chatMessages = (msg.messages || [])
        .map((m: any) => ({ id: m.id, from: m.from, text: m.text, scope: "lobby", replyTo: m.replyTo || undefined }))
        .concat(chatMessages.filter((m) => m.scope !== "lobby"));
      renderChatList();
      break;

    case "chat":
      chatMessages.push({
        id: msg.id,
        from: msg.from,
        text: msg.text,
        scope: msg.scope || "lobby",
        replyTo: msg.replyTo || undefined,
        replySnip: msg.replySnip || undefined,
      });
      if (chatMessages.length > 150) chatMessages.shift();
      renderChatList();
      break;

    case "mention":
      audio.play("hit");
      const mentionText = msg.text.slice(0, 60) + (msg.text.length > 60 ? "…" : "");
      const t = document.createElement("div");
      t.className = "toast toast-mention";
      t.innerHTML = `🔔 <strong>${esc(msg.from)}</strong> t'a mentionné<br/><em>${esc(mentionText)}</em>`;
      t.onclick = () => {
        if (screen === "battle" || screen === "placement") return;
        const el = document.getElementById("chat-messages");
        if (el) el.scrollTop = el.scrollHeight;
      };
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 3500);
      if (chatMessages.length < 150) chatMessages.push({ from: msg.from, text: msg.text, scope: "lobby" });
      renderChatList();
      break;

    case "bet_placed":
      toast(`🎲 Pari placé : ${msg.kind} → mise ${msg.amount} pts, cote ${msg.odds}x`);
      break;

    case "bet_won":
      toast(`💰 Pari gagné ! +${msg.amount} pts (${msg.kind})`);
      break;

    case "error":
      toast(`⚠️ ${msg.message}`);
      break;
  }
}

// ─── rendering ──────────────────────────────────────────────
const app = document.getElementById("app")!;

function render() {
  switch (screen) {
    case "join":
      renderJoin();
      break;
    case "lobby":
      renderLobby();
      break;
    case "placement":
      renderPlacement();
      break;
    case "battle":
      renderBattle();
      break;
    case "gameover":
      renderGameOver();
      break;
    case "spectate":
      renderSpectate();
      break;
  }
}

function renderJoin() {
  const saved = sessionStorage.getItem("bs_name") || "";
  app.innerHTML = `
    <div class="join-screen">
      <div class="ocean-waves"></div>
      <div class="join-content">
        <div class="logo-anchor">⚓</div>
        <h1 class="game-title">BATAILLE<br/>NAVALE</h1>
        <p class="tagline">Duels · Mises · Gloire</p>
        <div class="join-form">
          <input id="name-input" type="text" placeholder="Ton pseudo, capitaine" maxlength="20" value="${escAttr(saved)}" autocomplete="off" />
          <button id="join-btn" class="btn-primary btn-glow">⚔️ ENTRER AU COMBAT</button>
        </div>
        <p class="hint">100 points offerts aux nouveaux capitaines</p>
        <div class="join-chat panel">
          <h3>💬 Ça discute au port...</h3>
          <div id="join-chat-msgs" class="chat-msgs join-chat-msgs"></div>
        </div>
      </div>
    </div>`;
  const input = document.getElementById("name-input") as HTMLInputElement;
  const go = () => {
    const name = input.value.trim();
    if (!name) return;
    myName = name;
    send({ type: "join", name });
  };
  document.getElementById("join-btn")!.onclick = go;
  input.onkeydown = (e) => {
    if (e.key === "Enter") go();
  };
  input.focus();
  renderChatList();
}

function renderLobby() {
  app.innerHTML = `
    <div class="lobby-screen">
      <header class="lobby-header">
        <div class="header-left">
          <span class="header-logo">⚓</span>
          <span class="header-title">BATAILLE NAVALE</span>
        </div>
        <div class="my-badge">
          <span class="badge-name">${esc(myName)}</span>
          <span class="badge-points">💰 ${myPoints} pts</span>
          <span class="badge-record">${myWins}V / ${myLosses}D</span>
        </div>
        ${renderLoanBadge()}
      </header>
      <div class="lobby-body">
        <section class="panel players-panel">
          <h2>🌊 Capitaines en ligne <span class="count">${players.length}</span></h2>
          <div id="player-list" class="player-list"></div>
        </section>
        <section class="panel leaderboard-panel">
          <h2>🏆 Classement</h2>
          <ol id="lb-list" class="lb-list"></ol>
        </section>
        <section class="panel live-matches-panel">
          <h2>🎮 Matchs en direct</h2>
          <div id="live-matches" class="live-matches"></div>
        </section>
        <section class="panel chat-panel">
          <h2>💬 Chat du port</h2>
          <div id="chat-messages" class="chat-msgs"></div>
          <div class="chat-input">
            <input id="chat-inp" type="text" placeholder="Ton message..." maxlength="300" autocomplete="off" />
            <button id="chat-send-btn">➤</button>
          </div>
        </section>
      </div>
    </div>`;

  const lb = document.getElementById("lb-list")!;
  const medals = ["🥇", "🥈", "🥉"];
  lb.innerHTML = leaderboard
    .map(
      (e: any, i: number) => `
    <li class="${e.name === myName ? "me" : ""}">
      <span class="lb-rank">${medals[i] || i + 1}</span>
      <span class="lb-name">${esc(e.name)}</span>
      <span class="lb-pts">${e.points}</span>
    </li>`
    )
    .join("");

  const pl = document.getElementById("player-list")!;
  const others = players.filter((p) => p.name !== myName);
  pl.innerHTML = others.length
    ? others
        .map(
          (p: any) => `
    <div class="player-row ${p.inGame ? "ingame" : ""}">
      <div class="p-avatar">${p.name[0].toUpperCase()}</div>
      <div class="p-info">
        <span class="p-name">${esc(p.name)}</span>
        <span class="p-stats">${p.points} pts · ${p.wins}V/${p.losses}D</span>
      </div>
      ${
        p.inGame
          ? '<span class="p-status">⚔️ En duel</span>'
          : `<button class="btn-challenge" data-target="${escAttr(p.name)}">DÉFIER</button>`
      }
    </div>`
        )
        .join("")
    : '<p class="empty-msg">Personne d\'autre en ligne...<br/>Partage l\'adresse à tes amis !</p>';

  pl.querySelectorAll(".btn-challenge").forEach((btn) => {
    btn.addEventListener("click", () => showWagerDialog((btn as HTMLElement).dataset.target!));
  });

  renderChatList();
  setupChatInput();

  const borrowBtn = document.getElementById("borrow-btn");
  if (borrowBtn) borrowBtn.onclick = showBorrowModal;
  send({ type: "loan_status" });
  send({ type: "live_matches" });
}

function renderLiveMatchesPanel() {
  const el = document.getElementById("live-matches");
  if (!el) return;
  if (liveMatches.length === 0) {
    el.innerHTML = '<p class="empty-msg">Pas de match en cours</p>';
    return;
  }
  el.innerHTML = liveMatches.map((g: any) => `
    <div class="live-match">
      <div class="lm-players">
        <span>${esc(g.p1)} (${g.p1Ships}⚓)</span>
        <span class="vs">VS</span>
        <span>${esc(g.p2)} (${g.p2Ships}⚓)</span>
      </div>
      <div class="lm-info">
        <span>${g.phase ? "📐 Placement" : "🎯 Tour: " + esc(g.turnName)}</span>
        <span>💰 ${g.wager} pts</span>
        <span>👁 ${g.spectators}</span>
      </div>
      <button class="btn-challenge" data-game="${g.id}">REGARDER</button>
    </div>
  `).join("");

  el.querySelectorAll(".btn-challenge").forEach((b) => {
    b.addEventListener("click", () => send({ type: "spectate", gameId: (b as HTMLElement).dataset.game }));
  });
}

function renderLoanBadge(): string {
  if (!activeLoan) {
    if (myPoints < 75) return `<div class="loan-cta"><button id="borrow-btn" class="btn-spin">🏦 Emprunter à la banque</button></div>`;
    return "";
  }
  const pct = Math.round((1 - activeLoan.remaining / (activeLoan.principal * (1 + activeLoan.rate / 100))) * 100);
  return `<div class="loan-cta"><span class="loan-status">🏦 Dette: ${activeLoan.remaining} pts (${pct}% remboursé${activeLoan.installment > 0 ? ` · -${activeLoan.installment}/victoire` : " · en une fois"})</span></div>`;
}

function showWagerDialog(target: string) {
  closeModals();
  const dlg = document.createElement("div");
  dlg.className = "modal-overlay";
  dlg.innerHTML = `
    <div class="modal">
      <h3>⚔️ Défier ${esc(target)}</h3>
      <label>Mise (tu as ${myPoints} pts)</label>
      <div class="wager-quick">
        <button data-w="0">Amical</button>
        <button data-w="10">10</button>
        <button data-w="25">25</button>
        <button data-w="50">50</button>
      </div>
      <input id="wager-input" type="number" min="0" max="${myPoints}" value="10" inputmode="numeric" />
      <div class="modal-btns">
        <button id="wager-cancel">Annuler</button>
        <button id="wager-ok" class="btn-primary">ENVOYER LE DÉFI</button>
      </div>
    </div>`;
  document.body.appendChild(dlg);
  dlg.onclick = (e) => e.target === dlg && dlg.remove();
  dlg.querySelectorAll(".wager-quick button").forEach((b) => {
    (b as HTMLElement).onclick = () => {
      (document.getElementById("wager-input") as HTMLInputElement).value = (b as HTMLElement).dataset.w!;
    };
  });
  document.getElementById("wager-cancel")!.onclick = () => dlg.remove();
  document.getElementById("wager-ok")!.onclick = () => {
    const raw = +(document.getElementById("wager-input") as HTMLInputElement).value || 0;
    const w = Math.max(0, Math.min(myPoints, raw));
    send({ type: "challenge", target, wager: w });
    dlg.remove();
  };
}

function showBorrowModal() {
  if (activeLoan) { toast("Tu as déjà un prêt en cours !"); return; }
  closeModals();
  const dlg = document.createElement("div");
  dlg.className = "modal-overlay";
  dlg.innerHTML = `
    <div class="modal">
      <h3>🏦 Banque du Port</h3>
      <p style="color:var(--text-dim);font-size:14px">Solde actuel : ${myPoints} pts</p>
      <label>Montant</label>
      <div class="wager-quick">
        <button data-m="50">50 pts</button>
        <button data-m="100">100 pts</button>
        <button data-m="200">200 pts</button>
        <button data-m="500">500 pts</button>
      </div>
      <input id="loan-amount" type="number" min="20" max="500" value="100" inputmode="numeric" />
      <label>Taux d'intérêt</label>
      <select id="loan-rate">
        <option value="10">10% — standard</option>
        <option value="20">20% — rapide</option>
        <option value="35">35% — usurier</option>
      </select>
      <label>Remboursement</label>
      <select id="loan-installment">
        <option value="0">En une fois (sur prochaine victoire)</option>
        <option value="10">10 pts par victoire</option>
        <option value="25">25 pts par victoire</option>
        <option value="50">50 pts par victoire</option>
      </select>
      <p style="color:var(--red);font-size:12px">Les versements fractionnés coûtent +10% d'intérêts</p>
      <div class="modal-btns">
        <button id="loan-cancel">Annuler</button>
        <button id="loan-ok" class="btn-primary">EMPRUNTER</button>
      </div>
    </div>`;
  document.body.appendChild(dlg);
  dlg.onclick = (e) => e.target === dlg && dlg.remove();
  dlg.querySelectorAll(".wager-quick button").forEach((b) => {
    (b as HTMLElement).onclick = () => {
      (document.getElementById("loan-amount") as HTMLInputElement).value = (b as HTMLElement).dataset.m!;
    };
  });
  document.getElementById("loan-cancel")!.onclick = () => dlg.remove();
  document.getElementById("loan-ok")!.onclick = () => {
    const amount = +(document.getElementById("loan-amount") as HTMLInputElement).value || 100;
    let rate = +(document.getElementById("loan-rate") as HTMLSelectElement).value || 10;
    const installment = +(document.getElementById("loan-installment") as HTMLSelectElement).value || 0;
    if (installment > 0) rate += 10; // installment penalty
    send({ type: "borrow", amount, rate, installment });
    dlg.remove();
  };
}

function showChallengeDialog(challenger: string, w: number) {
  closeModals();
  const dlg = document.createElement("div");
  dlg.className = "modal-overlay";
  dlg.innerHTML = `
    <div class="modal modal-challenge">
      <div class="challenge-icon">⚔️</div>
      <h3>DÉFI REÇU !</h3>
      <p><strong>${esc(challenger)}</strong> te défie en duel</p>
      <p class="wager-display">Mise : <strong>${w} pts</strong></p>
      <div class="modal-btns">
        <button id="ch-decline">Refuser</button>
        <button id="ch-accept" class="btn-primary btn-glow">ACCEPTER</button>
      </div>
    </div>`;
  document.body.appendChild(dlg);
  document.getElementById("ch-decline")!.onclick = () => {
    send({ type: "decline_challenge", challenger });
    dlg.remove();
  };
  document.getElementById("ch-accept")!.onclick = () => {
    send({ type: "accept_challenge", challenger });
    dlg.remove();
  };
}

function closeModals() {
  document.querySelectorAll(".modal-overlay").forEach((m) => m.remove());
}

// ─── placement ──────────────────────────────────────────────
function renderPlacement() {
  const placed = myShips.length;
  const done = placed === SHIP_SIZES.length;
  app.innerHTML = `
    <div class="place-screen">
      <header class="battle-header">
        <span class="vs-text">${esc(myName)} <span class="vs">VS</span> ${esc(opponent)}</span>
        <span class="wager-badge">💰 ${wager} pts</span>
      </header>
      <h2 class="phase-title">${waitingOpponent ? "⏳ En attente de " + esc(opponent) + "..." : "⚓ Déploie ta flotte"}</h2>
      ${
        waitingOpponent
          ? '<div class="waiting-spinner"></div>'
          : `
      <div class="place-progress">${SHIP_SIZES.map((s, i) => `<span class="prog-dot ${i < placed ? "done" : i === placed ? "current" : ""}">${s}</span>`).join("")}</div>
      <div id="place-grid" class="grid place-grid"></div>
      <div class="place-actions">
        <button id="rotate-btn" class="btn-action">↻ ${shipOrientation ? "Horizontal" : "Vertical"}</button>
        <button id="random-btn" class="btn-action">🎲 Aléatoire</button>
        ${placed > 0 && !done ? '<button id="reset-btn" class="btn-action">🗑️ Effacer</button>' : ""}
        ${done ? '<button id="confirm-btn" class="btn-primary btn-glow">✓ PRÊT AU COMBAT</button>' : ""}
      </div>
      ${!done ? `<p class="help-text">Touche la grille pour placer le bateau de ${SHIP_SIZES[placed]} cases</p>` : ""}
      `
      }
    </div>`;

  if (waitingOpponent) return;

  renderPlacementGrid();

  document.getElementById("rotate-btn")!.onclick = () => {
    shipOrientation = !shipOrientation;
    render();
  };
  document.getElementById("random-btn")!.onclick = () => {
    randomizeShips();
    render();
  };
  const reset = document.getElementById("reset-btn");
  if (reset)
    reset.onclick = () => {
      myShips = [];
      ownGrid = emptyGrid();
      render();
    };
  const confirm = document.getElementById("confirm-btn");
  if (confirm)
    confirm.onclick = () => {
      send({ type: "place_ships", ships: myShips });
      audio.play("fire");
    };
}

function occupiedCells(): Set<string> {
  const set = new Set<string>();
  myShips.forEach((s, i) => {
    for (let k = 0; k < SHIP_SIZES[i]; k++) {
      const r = s.horiz ? s.row : s.row + k;
      const c = s.horiz ? s.col + k : s.col;
      set.add(`${r},${c}`);
    }
  });
  return set;
}

function canPlace(row: number, col: number, size: number, horiz: boolean): boolean {
  const occ = occupiedCells();
  for (let k = 0; k < size; k++) {
    const r = horiz ? row : row + k;
    const c = horiz ? col + k : col;
    if (r < 0 || r >= GRID || c < 0 || c >= GRID || occ.has(`${r},${c}`)) return false;
  }
  return true;
}

function syncOwnGrid() {
  ownGrid = emptyGrid();
  myShips.forEach((s, i) => {
    for (let k = 0; k < SHIP_SIZES[i]; k++) {
      const r = s.horiz ? s.row : s.row + k;
      const c = s.horiz ? s.col + k : s.col;
      ownGrid[r][c] = 1;
    }
  });
}

function randomizeShips() {
  myShips = [];
  for (const size of SHIP_SIZES) {
    for (let t = 0; t < 500; t++) {
      const horiz = Math.random() > 0.5;
      const row = Math.floor(Math.random() * GRID);
      const col = Math.floor(Math.random() * GRID);
      if (canPlace(row, col, size, horiz)) {
        myShips.push({ row, col, horiz });
        break;
      }
    }
  }
  syncOwnGrid();
}

function renderPlacementGrid() {
  const grid = document.getElementById("place-grid");
  if (!grid) return;
  syncOwnGrid();
  const size = myShips.length < SHIP_SIZES.length ? SHIP_SIZES[myShips.length] : 0;
  grid.innerHTML = "";

  const clearPreview = () => grid.querySelectorAll(".preview, .preview-bad").forEach((el) => el.classList.remove("preview", "preview-bad"));
  const showPreview = (r: number, c: number) => {
    clearPreview();
    if (!size) return;
    const ok = canPlace(r, c, size, shipOrientation);
    for (let k = 0; k < size; k++) {
      const pr = shipOrientation ? r : r + k;
      const pc = shipOrientation ? c + k : c;
      if (pr >= 0 && pr < GRID && pc >= 0 && pc < GRID) {
        grid.children[pr * GRID + pc]?.classList.add(ok ? "preview" : "preview-bad");
      }
    }
  };

  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const cell = document.createElement("div");
      cell.className = "gcell";
      if (ownGrid[r][c] === 1) { cell.classList.add("ship"); cell.classList.add("removable"); }
      cell.addEventListener("pointerenter", () => showPreview(r, c));
      cell.addEventListener("click", () => {
        // tap on own ship = remove it
        if (ownGrid[r][c] === 1) {
          const shipIdx = myShips.findIndex((s, idx) => {
            for (let k = 0; k < SHIP_SIZES[idx]; k++) {
              const sr = s.horiz ? s.row : s.row + k;
              const sc = s.horiz ? s.col + k : s.col;
              if (sr === r && sc === c) return true;
            }
            return false;
          });
          if (shipIdx >= 0) {
            myShips.splice(shipIdx, 1);
            audio.play("miss");
            render();
          }
          return;
        }
        if (!size) return;
        if (canPlace(r, c, size, shipOrientation)) {
          myShips.push({ row: r, col: c, horiz: shipOrientation });
          audio.play("miss");
          render();
        }
      });
      grid.appendChild(cell);
    }
  }
  grid.addEventListener("pointerleave", clearPreview);
}

// ─── battle ─────────────────────────────────────────────────
function renderBattle() {
  app.innerHTML = `
    <div class="battle-screen">
      <header class="battle-header">
        <span class="vs-text">${esc(myName)} <span class="vs">VS</span> ${esc(opponent)}</span>
        <span class="wager-badge">💰 ${wager} pts</span>
        <span class="points-badge">Solde : ${myPoints} pts</span>
      </header>
      <div id="turn-indicator" class="turn-indicator ${myTurn ? "my-turn" : ""}">
        ${myTurn ? (zoneMode ? "💣 CHOISIS LE CENTRE DE LA ZONE 3×3" : "🎯 À TOI DE TIRER !") : "⏳ " + esc(opponent) + " vise..."}
      </div>
      <div class="battle-grids">
        <div class="battle-section enemy-section">
          <h3>🎯 Flotte de ${esc(opponent)}</h3>
          <div id="enemy-grid" class="grid enemy-grid ${zoneMode ? "zone-mode" : ""}"></div>
        </div>
        <div class="battle-section own-section">
          <h3>🛡️ Ta flotte</h3>
          <div id="own-grid" class="grid own-grid small"></div>
        </div>
      </div>
      <div class="power-bar">
        <button id="spin-btn" class="btn-spin" ${myPoints < 10 || zoneReady ? "disabled" : ""}>
          🎰 Roulette <span class="spin-cost">-10 pts</span>
        </button>
        ${zoneReady && myTurn ? `<button id="zone-btn" class="btn-zone ${zoneMode ? "active" : ""}">💣 ZONE 3×3 ${zoneMode ? "— annuler" : ""}</button>` : ""}
        ${zoneReady && !myTurn ? '<span class="zone-pending">💣 Zone 3×3 prête pour ton tour</span>' : ""}
      </div>
      <div class="battle-bottom">
        <div class="chat-panel panel game-chat">
          <div id="chat-messages" class="chat-msgs"></div>
          <div class="chat-input">
            <input id="chat-inp" type="text" placeholder="Chambre ton adversaire..." maxlength="300" autocomplete="off" />
            <button id="chat-send-btn">➤</button>
          </div>
        </div>
        <button id="forfeit-btn" class="btn-danger">🏳️ Abandonner</button>
      </div>
    </div>`;

  renderBattleGrids();
  document.getElementById("forfeit-btn")!.onclick = () => {
    if (confirm("Abandonner ? Tu perds la mise !")) {
      send({ type: "leave_game" });
      screen = "lobby";
      render();
    }
  };
  const spinBtn = document.getElementById("spin-btn");
  if (spinBtn)
    spinBtn.onclick = () => {
      audio.play("spin");
      send({ type: "spin" });
    };
  const zoneBtn = document.getElementById("zone-btn");
  if (zoneBtn)
    zoneBtn.onclick = () => {
      zoneMode = !zoneMode;
      renderBattle();
    };
  renderChatList();
  setupChatInput();
}

function updateTurnUI() {
  const el = document.getElementById("turn-indicator");
  if (!el) return;
  el.className = `turn-indicator ${myTurn ? "my-turn" : ""}`;
  el.innerHTML = myTurn ? "🎯 À TOI DE TIRER !" : "⏳ " + esc(opponent) + " vise...";
}

function renderBattleGrids() {
  const enemy = document.getElementById("enemy-grid");
  if (enemy) {
    enemy.innerHTML = "";
    const clearZone = () => enemy.querySelectorAll(".zone-target").forEach((el) => el.classList.remove("zone-target"));
    const showZone = (r: number, c: number) => {
      clearZone();
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < GRID && nc >= 0 && nc < GRID) enemy.children[nr * GRID + nc]?.classList.add("zone-target");
        }
    };
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const cell = document.createElement("div");
        cell.className = "gcell water";
        const v = enemyGrid[r][c];
        if (v === 2) {
          cell.classList.add("miss");
          cell.textContent = "•";
        }
        if (v === 3) {
          cell.classList.add("hit");
          cell.textContent = "✕";
        }
        if (myTurn && zoneMode) {
          cell.classList.add("clickable");
          cell.addEventListener("pointerenter", () => showZone(r, c));
          cell.onclick = () => {
            if (!myTurn || !zoneReady) return;
            audio.play("fire");
            send({ type: "fire_zone", x: c, y: r });
            zoneMode = false;
          };
        } else if (v === 0 && myTurn) {
          cell.classList.add("clickable");
          cell.onclick = () => {
            if (!myTurn) return;
            audio.play("fire");
            send({ type: "fire", x: c, y: r });
          };
        }
        enemy.appendChild(cell);
      }
    }
    if (zoneMode) enemy.addEventListener("pointerleave", clearZone);
  }
  const own = document.getElementById("own-grid");
  if (own) {
    own.innerHTML = "";
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const cell = document.createElement("div");
        cell.className = "gcell water";
        const v = ownGrid[r][c];
        if (v === 1) cell.classList.add("ship");
        if (v === 2) {
          cell.classList.add("miss");
          cell.textContent = "•";
        }
        if (v === 3) {
          cell.classList.add("hit", "ship-hit");
          cell.textContent = "✕";
        }
        own.appendChild(cell);
      }
    }
  }
}

function showSpinWheel(youBenefit: boolean, youSpun: boolean, onDone: () => void) {
  closeModals();
  const dlg = document.createElement("div");
  dlg.className = "modal-overlay";
  dlg.innerHTML = `
    <div class="modal spin-modal">
      <h3>🎰 ROULETTE DU DESTIN</h3>
      <p class="spin-sub">${youSpun ? "Tu as lancé la roulette..." : esc(opponent) + " a lancé la roulette..."}</p>
      <div class="wheel-wrap">
        <div class="wheel-arrow">▼</div>
        <div id="spin-wheel" class="wheel">
          <div class="wheel-half wheel-me">TOI</div>
          <div class="wheel-half wheel-opp">${esc(opponent).slice(0, 8).toUpperCase()}</div>
        </div>
      </div>
      <p id="spin-verdict" class="spin-verdict"></p>
    </div>`;
  document.body.appendChild(dlg);
  audio.play("spin");

  const wheel = document.getElementById("spin-wheel")!;
  // TOI occupies right half (0deg at top going clockwise: 0-180 = me side)
  // Land angle: center of my half = 90deg, opponent half = 270deg
  const landing = youBenefit ? 90 : 270;
  const jitter = Math.random() * 100 - 50;
  const total = 5 * 360 + (360 - landing) + jitter * 0.6;
  requestAnimationFrame(() => {
    wheel.style.transition = "transform 2.4s cubic-bezier(0.15, 0.9, 0.25, 1)";
    wheel.style.transform = `rotate(${total}deg)`;
  });

  setTimeout(() => {
    const verdict = document.getElementById("spin-verdict");
    if (verdict) {
      verdict.textContent = youBenefit ? "💣 TU GAGNES L'ATTAQUE DE ZONE !" : `😈 ${opponent} gagne l'attaque de zone !`;
      verdict.className = `spin-verdict show ${youBenefit ? "good" : "bad"}`;
    }
    audio.play(youBenefit ? "win" : "lose");
  }, 2500);

  setTimeout(() => {
    dlg.remove();
    onDone();
  }, 4200);
}

function animateShot(gridId: string, x: number, y: number, hit: boolean) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const cell = grid.children[y * GRID + x] as HTMLElement;
  if (!cell) return;
  cell.classList.add(hit ? "explode" : "splash");
  setTimeout(() => cell.classList.remove("explode", "splash"), 700);
}

// ─── game over ──────────────────────────────────────────────
function renderGameOver() {
  app.innerHTML = `
    <div class="gameover-screen ${iWon ? "win" : "lose"}">
      <div class="go-icon">${iWon ? "🏆" : "💀"}</div>
      <h1>${iWon ? "VICTOIRE !" : "DÉFAITE"}</h1>
      <p class="go-detail">
        ${forfeitWin ? esc(opponent) + " a abandonné !" : iWon ? "Tu as coulé toute la flotte de " + esc(opponent) + " !" : esc(opponent) + " a coulé toute ta flotte..."}
      </p>
      ${pointsEarned > 0 ? `<p class="go-points ${iWon ? "gain" : "loss"}">${iWon ? "+" : "-"}${pointsEarned} points</p>` : ""}
      <p class="go-balance">Solde : <strong>${myPoints} pts</strong></p>
      <div class="gameover-btns">
        ${!forfeitWin ? '<button id="rematch-btn" class="btn-primary btn-glow">🔄 REVANCHE</button>' : ""}
        <button id="lobby-btn" class="btn-action">⚓ Retour au port</button>
      </div>
    </div>`;
  const rematch = document.getElementById("rematch-btn");
  if (rematch)
    rematch.onclick = () => {
      send({ type: "rematch" });
      toast("Revanche proposée, en attente...");
      rematch.setAttribute("disabled", "true");
      rematch.textContent = "⏳ En attente...";
    };
  document.getElementById("lobby-btn")!.onclick = () => {
    send({ type: "leave_game" });
    screen = "lobby";
    render();
  };
}

// ─── shared ─────────────────────────────────────────────────
function renderChatList() {
  const joinEl = document.getElementById("join-chat-msgs");
  if (joinEl) {
    joinEl.innerHTML = chatMessages
      .filter((m) => m.scope === "lobby")
      .slice(-15)
      .map((m) => renderChatBubble(m))
      .join("") || '<p class="empty-msg">Silence radio pour le moment...</p>';
    joinEl.scrollTop = joinEl.scrollHeight;
  }
  const el = document.getElementById("chat-messages");
  if (!el) return;
  const scope = screen === "battle" || screen === "placement" ? "game" : "lobby";
  const msgs = chatMessages.filter((m) => m.scope === scope);
  el.innerHTML = msgs.map((m, idx) => renderChatBubble(m, idx)).join("");
  el.scrollTop = el.scrollHeight;

  el.querySelectorAll(".chat-reply-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const msgEl = (btn as HTMLElement).closest(".chat-msg") as HTMLElement;
      const idx = parseInt(msgEl?.dataset.i || "0");
      const m = msgs[idx];
      if (m) replyTarget = { id: m.id || "", from: m.from, text: m.text };
      setupReplyBar();
    });
  });

  el.querySelectorAll(".chat-mention").forEach((span) => {
    span.addEventListener("click", () => {
      const name = span.getAttribute("data-name") || "";
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].from === name) {
          const target = el.children[i] as HTMLElement;
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
            target.classList.add("msg-flash");
            setTimeout(() => target.classList.remove("msg-flash"), 1800);
          }
          return;
        }
      }
      toast(`${name} n'a pas de message récent ici`);
    });
  });
}

function renderChatBubble(m: any, idx?: number): string {
  const isMine = m.from === myName;
  const replyHtml = m.replyTo
    ? `<div class="reply-quote"><span class="reply-quote-bar"></span><span class="reply-quote-text">${esc(m.replySnip || "")}</span></div>`
    : "";
  const textHtml = renderMentions(m.text);
  const idxAttr = idx !== undefined ? ` data-i="${idx}"` : "";
  return `<div class="chat-msg ${isMine ? "mine" : ""}"${idxAttr}>
    ${replyHtml}
    <span class="chat-from">${esc(m.from)}</span>
    <span class="chat-text">${textHtml}</span>
    <button class="chat-reply-btn" title="Répondre">↩</button>
  </div>`;
}

function renderMentions(text: string): string {
  return text.replace(/(^| )@([a-zA-Z0-9_-]+)/g,
    (_, sp, name) => `${sp}<span class="chat-mention" data-name="${escAttr(name)}">@${esc(name)}</span>`);
}

function setupReplyBar() {
  document.getElementById("reply-bar")?.remove();
  if (!replyTarget) return;
  const panel = document.querySelector(".chat-input")?.parentElement;
  if (!panel) return;
  const bar = document.createElement("div");
  bar.id = "reply-bar";
  bar.className = "reply-bar";
  bar.innerHTML = `
    <div class="reply-bar-top"></div>
    <span class="reply-bar-label">Répondre à <strong>${esc(replyTarget.from)}</strong></span>
    <span class="reply-bar-snip">${esc(replyTarget.text.slice(0, 50))}${replyTarget.text.length > 50 ? "…" : ""}</span>
    <button class="reply-bar-cancel">✕</button>
  `;
  panel.insertBefore(bar, panel.firstChild);
  bar.querySelector(".reply-bar-cancel")!.addEventListener("click", () => {
    replyTarget = null;
    setupReplyBar();
  });
}

function setupChatInput() {
  const inp = document.getElementById("chat-inp") as HTMLInputElement;
  const btn = document.getElementById("chat-send-btn");
  if (!inp || !btn) return;
  const sendChat = () => {
    const text = inp.value.trim();
    if (!text) return;
    const payload: any = { type: "chat", text };
    if (replyTarget) { payload.replyTo = replyTarget.id; replyTarget = null; setupReplyBar(); }
    send(payload);
    inp.value = "";
  };
  (btn as HTMLElement).onclick = sendChat;
  inp.onkeydown = (e) => { if (e.key === "Enter") sendChat(); };
  setupReplyBar();
}

let toastTimer: ReturnType<typeof setTimeout>;
function toast(msg: string) {
  document.querySelectorAll(".toast").forEach((t) => t.remove());
  clearTimeout(toastTimer);
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  toastTimer = setTimeout(() => el.remove(), 2800);
}

function esc(str: string) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// ─── spectate / betting ─────────────────────────────────────────

let liveMatches: any[] = [];
let specP1 = "", specP2 = "";
let specBoard1: number[][] = emptyGrid();
let specBoard2: number[][] = emptyGrid();
let specEvents: any[] = [];
let specTurnName = "";
let specOdds: { kind: string; odds0: number; odds1: number } | null = null;
let specGameId = "";

function renderSpectate() {
  app.innerHTML = `<div class="spectate-screen">
    <header class="battle-header">
      <span class="vs-text">${esc(specP1)} <span class="vs">VS</span> ${esc(specP2)}</span>
      <button id="unspectate-btn" class="btn-danger">Quitter</button>
    </header>
    <div class="turn-indicator">Tour de ${esc(specTurnName)}</div>
    <div class="spectate-grids">
      <div class="battle-section"><h3>${esc(specP1)}</h3><div id="spec-grid-1" class="grid spec-grid"></div></div>
      <div class="battle-section"><h3>${esc(specP2)}</h3><div id="spec-grid-2" class="grid spec-grid"></div></div>
    </div>
    <div class="spec-bets card">
      <h3>🎲 Paris en direct</h3>
      <div id="spec-odds" class="spec-odds-row"></div>
      <div id="spec-bet-btns" class="spec-bet-btns"></div>
    </div>
    <div class="spec-events card">
      <h3>📡 Événements</h3>
      <div id="spec-events" class="spec-event-list"></div>
    </div>
  </div>`;
  renderSpectateGrids();
  document.getElementById("unspectate-btn")!.onclick = () => { send({ type: "unspectate" }); screen = "lobby"; render(); };
  renderSpecEvents();
  renderSpecOdds();
}

function renderSpectateGrids() {
  const g1 = document.getElementById("spec-grid-1"); if (g1) renderSpecGrid(g1, specBoard1);
  const g2 = document.getElementById("spec-grid-2"); if (g2) renderSpecGrid(g2, specBoard2);
}

function renderSpecGrid(el: HTMLElement, data: number[][]) {
  el.innerHTML = "";
  for (let r = 0; r < GRID; r++) for (let c = 0; c < GRID; c++) {
    const cell = document.createElement("div");
    cell.className = "gcell water";
    const v = data[r][c];
    if (v === 1) cell.classList.add("ship");
    if (v === 2) { cell.classList.add("miss"); cell.textContent = "•"; }
    if (v === 3) { cell.classList.add("hit", "ship-hit"); cell.textContent = "✕"; }
    el.appendChild(cell);
  }
}

function renderSpecEvents() {
  const el = document.getElementById("spec-events"); if (!el) return;
  el.innerHTML = specEvents.slice(-10).reverse().map((e: any) => {
    const name = e.player === 0 ? specP1 : specP2;
    const d = e.data || {};
    const icon = d.result === "hit" ? "🎯" : d.result === "sunk" ? "💥" : "💧";
    return `<div class="spec-event">${icon} <strong>${esc(name)}</strong> ${d.x},${d.y} ${d.ship||""}</div>`;
  }).join("");
}

function renderSpecOdds() {
  const oddsEl = document.getElementById("spec-odds"), btnEl = document.getElementById("spec-bet-btns");
  if (!oddsEl || !btnEl || !specOdds) return;
  oddsEl.innerHTML = `<span class="odd-chip">${esc(specP1)}: ${specOdds.odds0}x</span><span class="odd-chip">${esc(specP2)}: ${specOdds.odds1}x</span>`;
  btnEl.innerHTML = `
    <button class="btn-bet" data-kind="match_winner" data-pick="1">Parier sur ${esc(specP1)}</button>
    <button class="btn-bet" data-kind="match_winner" data-pick="2">Parier sur ${esc(specP2)}</button>
    <button class="btn-bet" data-kind="next_hit" data-pick="1">Prochain hit: ${esc(specP1)}</button>
    <button class="btn-bet" data-kind="next_hit" data-pick="2">Prochain hit: ${esc(specP2)}</button>
  `;
  btnEl.querySelectorAll(".btn-bet").forEach(b => b.addEventListener("click", () => {
    const kind = (b as HTMLElement).dataset.kind!, pick = parseInt((b as HTMLElement).dataset.pick!);
    showBetModal(kind, pick);
  }));
}

function showBetModal(kind: string, pick: number) {
  closeModals();
  const dlg = document.createElement("div");
  dlg.className = "modal-overlay";
  dlg.innerHTML = `<div class="modal">
    <h3>🎲 Pari: ${kind.replace("_"," ")}</h3>
    <p>Tu paries sur <strong>${esc(pick===1?specP1:specP2)}</strong></p>
    <label>Mise (max ${myPoints} pts)</label>
    <input id="bet-amount" type="number" min="5" max="${myPoints}" value="10" inputmode="numeric"/>
    <div class="modal-btns">
      <button id="bet-cancel">Annuler</button>
      <button id="bet-ok" class="btn-primary">PARIER</button>
    </div>
  </div>`;
  document.body.appendChild(dlg);
  dlg.onclick = e => e.target===dlg && dlg.remove();
  document.getElementById("bet-cancel")!.onclick = () => dlg.remove();
  document.getElementById("bet-ok")!.onclick = () => {
    const amount = Math.min(myPoints, Math.max(5, +(document.getElementById("bet-amount") as HTMLInputElement).value||10));
    send({ type: "bet", gameId: specGameId, kind, pick, amount });
    myPoints -= amount;
    dlg.remove();
  };
}

function escAttr(str: string) {
  return str.replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

window.addEventListener("error", (e) => {
  send({ type: "client_log", level: "error", message: `${e.message} @ ${e.filename}:${e.lineno}` });
});
window.addEventListener("unhandledrejection", (e) => {
  send({ type: "client_log", level: "error", message: `unhandled rejection: ${e.reason}` });
});

connect();
render();
