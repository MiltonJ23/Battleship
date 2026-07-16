(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function o(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(t){if(t.ep)return;t.ep=!0;const n=o(t);fetch(t.href,n)}})();class se{ctx=null;getCtx(){return this.ctx||(this.ctx=new AudioContext),this.ctx}play(s){try{const o=this.getCtx(),a=o.createOscillator(),t=o.createGain();a.connect(t),t.connect(o.destination);const n=o.currentTime;switch(s){case"tick":{a.type="square",a.frequency.setValueAtTime(1200,n),t.gain.setValueAtTime(.05,n),t.gain.exponentialRampToValueAtTime(.001,n+.04),a.start(n),a.stop(n+.04);break}case"spin":{for(let l=0;l<20;l++){const c=n+Math.pow(l/20,1.6)*2.2,d=o.createOscillator(),u=o.createGain();d.connect(u),u.connect(o.destination),d.type="square",d.frequency.setValueAtTime(1e3+Math.random()*300,c),u.gain.setValueAtTime(.05,c),u.gain.exponentialRampToValueAtTime(.001,c+.04),d.start(c),d.stop(c+.05)}break}case"zone":{for(let l=0;l<5;l++){const c=n+l*.12,d=o.createOscillator(),u=o.createGain();d.connect(u),u.connect(o.destination),d.type="sawtooth",d.frequency.setValueAtTime(160-l*15,c),d.frequency.exponentialRampToValueAtTime(40,c+.35),u.gain.setValueAtTime(.18,c),u.gain.exponentialRampToValueAtTime(.001,c+.4),d.start(c),d.stop(c+.4)}break}case"fire":a.type="sawtooth",a.frequency.setValueAtTime(150,n),a.frequency.exponentialRampToValueAtTime(60,n+.15),t.gain.setValueAtTime(.15,n),t.gain.exponentialRampToValueAtTime(.001,n+.2),a.start(n),a.stop(n+.2);break;case"hit":a.type="square",a.frequency.setValueAtTime(200,n),a.frequency.exponentialRampToValueAtTime(80,n+.4),t.gain.setValueAtTime(.2,n),t.gain.exponentialRampToValueAtTime(.001,n+.5),a.start(n),a.stop(n+.5);const i=o.createOscillator(),r=o.createGain();i.connect(r),r.connect(o.destination),i.type="triangle",i.frequency.setValueAtTime(400,n),i.frequency.exponentialRampToValueAtTime(100,n+.3),r.gain.setValueAtTime(.1,n),r.gain.exponentialRampToValueAtTime(.001,n+.35),i.start(n),i.stop(n+.35);break;case"sunk":for(let l=0;l<3;l++){const c=o.createOscillator(),d=o.createGain();c.connect(d),d.connect(o.destination),c.type="sawtooth",c.frequency.setValueAtTime(100-l*30,n+l*.15),c.frequency.exponentialRampToValueAtTime(30,n+l*.15+.5),d.gain.setValueAtTime(.2,n+l*.15),d.gain.exponentialRampToValueAtTime(.001,n+l*.15+.6),c.start(n+l*.15),c.stop(n+l*.15+.6)}break;case"miss":a.type="sine",a.frequency.setValueAtTime(600,n),a.frequency.exponentialRampToValueAtTime(300,n+.15),t.gain.setValueAtTime(.05,n),t.gain.exponentialRampToValueAtTime(.001,n+.2),a.start(n),a.stop(n+.2);break;case"win":[523,659,784,1047].forEach((l,c)=>{const d=o.createOscillator(),u=o.createGain();d.connect(u),u.connect(o.destination),d.type="triangle",d.frequency.setValueAtTime(l,n+c*.15),u.gain.setValueAtTime(.15,n+c*.15),u.gain.exponentialRampToValueAtTime(.001,n+c*.15+.4),d.start(n+c*.15),d.stop(n+c*.15+.4)});break;case"lose":[400,300,250,200].forEach((l,c)=>{const d=o.createOscillator(),u=o.createGain();d.connect(u),u.connect(o.destination),d.type="sawtooth",d.frequency.setValueAtTime(l,n+c*.2),u.gain.setValueAtTime(.12,n+c*.2),u.gain.exponentialRampToValueAtTime(.001,n+c*.2+.5),d.start(n+c*.2),d.stop(n+c*.2+.5)});break}}catch{}}}const T=new se;function oe(e){const s=["#00f0ff","#ff0055","#ffe600","#00ff88","#ff6600","#cc00ff"];for(let o=0;o<60;o++){const a=document.createElement("div");a.style.cssText=`
      position:fixed;width:8px;height:8px;border-radius:50%;
      background:${s[o%s.length]};pointer-events:none;z-index:9999;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation: confettiFall ${1+Math.random()*2}s ease-out forwards;
      animation-delay:${Math.random()*.5}s;
      opacity:1;
    `,e.appendChild(a),setTimeout(()=>a.remove(),3e3)}}const f=10,V=[5,4,3,3,2];let m="join",k="",$=0,j=0,G=0,z=0,h="",W=0,v=!1,R=!1,P=[],ee=[],A=[],L=!0,H=S(),M=S(),x=!1,D=0,U=!1,B=!1,w=!1,E=[],I=null,q;function S(){return Array.from({length:f},()=>Array(f).fill(0))}function te(){const e=location.protocol==="https:"?"wss":"ws";q=new WebSocket(`${e}://${location.host}/ws`),q.onopen=()=>{k&&m!=="join"&&b({type:"join",name:k})},q.onmessage=s=>{try{ie(JSON.parse(s.data))}catch{}},q.onclose=()=>{setTimeout(te,2e3)}}function b(e){q&&q.readyState===WebSocket.OPEN&&q.send(JSON.stringify(e))}function ie(e){switch(e.type){case"joined":k=e.name,$=e.points,j=e.wins,G=e.losses,sessionStorage.setItem("bs_name",k),m="lobby",g();break;case"lobby_update":P=e.players||[],ee=e.leaderboard||[],e.me&&($=e.me.points,j=e.me.wins,G=e.me.losses),m==="lobby"&&g();break;case"challenge_sent":y(`Défi envoyé à ${e.target} — mise ${e.wager} pts ⏳`);break;case"challenge_received":de(e.challenger,e.wager);break;case"challenge_declined":y(`${e.target} a refusé ton défi 😤`);break;case"game_start":h=e.opponent,W=e.wager,z=e.playerIdx??0,A=[],L=!0,v=!1,R=!1,B=!1,w=!1,H=S(),M=S(),E=E.filter(a=>a.scope!=="game"),m="placement",g();break;case"ships_accepted":R=!0,m==="placement"&&g();break;case"opponent_ready":y(`${h} est prêt ! ⚓`);break;case"battle_start":v=!!e.yourTurn,m="battle",g();break;case"fire_result":{const{x:a,y:t,result:n,ship:i,shooter:r}=e,l=n==="hit"||n==="sunk";r===z?(H[t][a]=l?3:2,T.play(n==="sunk"?"sunk":l?"hit":"miss"),n==="sunk"?y(`💥 ${i} ennemi coulé !`):l&&y("🎯 Touché !")):(M[t][a]=l?3:2,T.play(l?"hit":"miss"),n==="sunk"&&y(`☠️ Ton ${i} a été coulé...`)),v=!!e.yourTurn,m==="battle"&&!e.gameOver&&(he(),Z(),Q(r===z?"enemy-grid":"own-grid",a,t,l));break}case"game_over":x=!!e.won,D=e.pointsEarned||0,U=e.reason==="forfeit",typeof e.newPoints=="number"&&($=e.newPoints),m="gameover",T.play(x?"win":"lose"),g(),x&&setTimeout(()=>oe(document.body),200);break;case"rematch_requested":y(`${h} veut une revanche ! 🔄`);break;case"opponent_left":y(`${h} a quitté`),m==="gameover"&&g();break;case"spin_result":typeof e.spinnerPoints=="number"&&e.youSpun&&($=e.spinnerPoints),be(!!e.youBenefit,!!e.youSpun,()=>{e.youBenefit?(B=!0,y("💣 Attaque de zone 3×3 débloquée !")):y(`😱 ${h} a gagné l'attaque de zone !`),m==="battle"&&N()});break;case"zone_result":{const a=e.shooter===z;T.play("zone");let t=[];(e.cells||[]).forEach((n,i)=>{const{x:r,y:l,result:c}=n;if(c==="skip")return;const d=c==="hit"||c==="sunk";c==="sunk"&&n.ship&&t.push(n.ship),setTimeout(()=>{a?H[l][r]=d?3:2:M[l][r]=d?3:2,m==="battle"&&(Z(),Q(a?"enemy-grid":"own-grid",r,l,d))},i*110)}),a&&(B=!1,w=!1),v=!!e.yourTurn,setTimeout(()=>{t.length&&(y(a?`💥 Coulé : ${t.join(", ")} !`:`☠️ Coulé : ${t.join(", ")}...`),T.play("sunk")),m==="battle"&&!e.gameOver&&N()},1100);break}case"chat_history":E=(e.messages||[]).map(a=>({id:a.id,from:a.from,text:a.text,scope:"lobby",replyTo:a.replyTo||void 0})).concat(E.filter(a=>a.scope!=="lobby")),C();break;case"chat":E.push({id:e.id,from:e.from,text:e.text,scope:e.scope||"lobby",replyTo:e.replyTo||void 0,replySnip:e.replySnip||void 0}),E.length>150&&E.shift(),C();break;case"mention":T.play("hit");const s=e.text.slice(0,60)+(e.text.length>60?"…":""),o=document.createElement("div");o.className="toast toast-mention",o.innerHTML=`🔔 <strong>${p(e.from)}</strong> t'a mentionné<br/><em>${p(s)}</em>`,o.onclick=()=>{if(m==="battle"||m==="placement")return;const a=document.getElementById("chat-messages");a&&(a.scrollTop=a.scrollHeight)},document.body.appendChild(o),setTimeout(()=>o.remove(),3500),E.length<150&&E.push({from:e.from,text:e.text,scope:"lobby"}),C();break;case"error":y(`⚠️ ${e.message}`);break}}const O=document.getElementById("app");function g(){switch(m){case"join":le();break;case"lobby":ce();break;case"placement":pe();break;case"battle":N();break;case"gameover":ye();break}}function le(){const e=sessionStorage.getItem("bs_name")||"";O.innerHTML=`
    <div class="join-screen">
      <div class="ocean-waves"></div>
      <div class="join-content">
        <div class="logo-anchor">⚓</div>
        <h1 class="game-title">BATAILLE<br/>NAVALE</h1>
        <p class="tagline">Duels · Mises · Gloire</p>
        <div class="join-form">
          <input id="name-input" type="text" placeholder="Ton pseudo, capitaine" maxlength="20" value="${K(e)}" autocomplete="off" />
          <button id="join-btn" class="btn-primary btn-glow">⚔️ ENTRER AU COMBAT</button>
        </div>
        <p class="hint">100 points offerts aux nouveaux capitaines</p>
        <div class="join-chat panel">
          <h3>💬 Ça discute au port...</h3>
          <div id="join-chat-msgs" class="chat-msgs join-chat-msgs"></div>
        </div>
      </div>
    </div>`;const s=document.getElementById("name-input"),o=()=>{const a=s.value.trim();a&&(k=a,b({type:"join",name:a}))};document.getElementById("join-btn").onclick=o,s.onkeydown=a=>{a.key==="Enter"&&o()},s.focus(),C()}function ce(){O.innerHTML=`
    <div class="lobby-screen">
      <header class="lobby-header">
        <div class="header-left">
          <span class="header-logo">⚓</span>
          <span class="header-title">BATAILLE NAVALE</span>
        </div>
        <div class="my-badge">
          <span class="badge-name">${p(k)}</span>
          <span class="badge-points">💰 ${$} pts</span>
          <span class="badge-record">${j}V / ${G}D</span>
        </div>
      </header>
      <div class="lobby-body">
        <section class="panel players-panel">
          <h2>🌊 Capitaines en ligne <span class="count">${P.length}</span></h2>
          <div id="player-list" class="player-list"></div>
        </section>
        <section class="panel leaderboard-panel">
          <h2>🏆 Classement</h2>
          <ol id="lb-list" class="lb-list"></ol>
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
    </div>`;const e=document.getElementById("lb-list"),s=["🥇","🥈","🥉"];e.innerHTML=ee.map((t,n)=>`
    <li class="${t.name===k?"me":""}">
      <span class="lb-rank">${s[n]||n+1}</span>
      <span class="lb-name">${p(t.name)}</span>
      <span class="lb-pts">${t.points}</span>
    </li>`).join("");const o=document.getElementById("player-list"),a=P.filter(t=>t.name!==k);o.innerHTML=a.length?a.map(t=>`
    <div class="player-row ${t.inGame?"ingame":""}">
      <div class="p-avatar">${t.name[0].toUpperCase()}</div>
      <div class="p-info">
        <span class="p-name">${p(t.name)}</span>
        <span class="p-stats">${t.points} pts · ${t.wins}V/${t.losses}D</span>
      </div>
      ${t.inGame?'<span class="p-status">⚔️ En duel</span>':`<button class="btn-challenge" data-target="${K(t.name)}">DÉFIER</button>`}
    </div>`).join(""):`<p class="empty-msg">Personne d'autre en ligne...<br/>Partage l'adresse à tes amis !</p>`,o.querySelectorAll(".btn-challenge").forEach(t=>{t.addEventListener("click",()=>re(t.dataset.target))}),C(),ae()}function re(e){J();const s=document.createElement("div");s.className="modal-overlay",s.innerHTML=`
    <div class="modal">
      <h3>⚔️ Défier ${p(e)}</h3>
      <label>Mise (tu as ${$} pts)</label>
      <div class="wager-quick">
        <button data-w="0">Amical</button>
        <button data-w="10">10</button>
        <button data-w="25">25</button>
        <button data-w="50">50</button>
      </div>
      <input id="wager-input" type="number" min="0" max="${$}" value="10" inputmode="numeric" />
      <div class="modal-btns">
        <button id="wager-cancel">Annuler</button>
        <button id="wager-ok" class="btn-primary">ENVOYER LE DÉFI</button>
      </div>
    </div>`,document.body.appendChild(s),s.onclick=o=>o.target===s&&s.remove(),s.querySelectorAll(".wager-quick button").forEach(o=>{o.onclick=()=>{document.getElementById("wager-input").value=o.dataset.w}}),document.getElementById("wager-cancel").onclick=()=>s.remove(),document.getElementById("wager-ok").onclick=()=>{const o=+document.getElementById("wager-input").value||0,a=Math.max(0,Math.min($,o));b({type:"challenge",target:e,wager:a}),s.remove()}}function de(e,s){J();const o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`
    <div class="modal modal-challenge">
      <div class="challenge-icon">⚔️</div>
      <h3>DÉFI REÇU !</h3>
      <p><strong>${p(e)}</strong> te défie en duel</p>
      <p class="wager-display">Mise : <strong>${s} pts</strong></p>
      <div class="modal-btns">
        <button id="ch-decline">Refuser</button>
        <button id="ch-accept" class="btn-primary btn-glow">ACCEPTER</button>
      </div>
    </div>`,document.body.appendChild(o),document.getElementById("ch-decline").onclick=()=>{b({type:"decline_challenge",challenger:e}),o.remove()},document.getElementById("ch-accept").onclick=()=>{b({type:"accept_challenge",challenger:e}),o.remove()}}function J(){document.querySelectorAll(".modal-overlay").forEach(e=>e.remove())}function pe(){const e=A.length,s=e===V.length;if(O.innerHTML=`
    <div class="place-screen">
      <header class="battle-header">
        <span class="vs-text">${p(k)} <span class="vs">VS</span> ${p(h)}</span>
        <span class="wager-badge">💰 ${W} pts</span>
      </header>
      <h2 class="phase-title">${R?"⏳ En attente de "+p(h)+"...":"⚓ Déploie ta flotte"}</h2>
      ${R?'<div class="waiting-spinner"></div>':`
      <div class="place-progress">${V.map((t,n)=>`<span class="prog-dot ${n<e?"done":n===e?"current":""}">${t}</span>`).join("")}</div>
      <div id="place-grid" class="grid place-grid"></div>
      <div class="place-actions">
        <button id="rotate-btn" class="btn-action">↻ ${L?"Horizontal":"Vertical"}</button>
        <button id="random-btn" class="btn-action">🎲 Aléatoire</button>
        ${e>0&&!s?'<button id="reset-btn" class="btn-action">🗑️ Effacer</button>':""}
        ${s?'<button id="confirm-btn" class="btn-primary btn-glow">✓ PRÊT AU COMBAT</button>':""}
      </div>
      ${s?"":`<p class="help-text">Touche la grille pour placer le bateau de ${V[e]} cases</p>`}
      `}
    </div>`,R)return;fe(),document.getElementById("rotate-btn").onclick=()=>{L=!L,g()},document.getElementById("random-btn").onclick=()=>{me(),g()};const o=document.getElementById("reset-btn");o&&(o.onclick=()=>{A=[],M=S(),g()});const a=document.getElementById("confirm-btn");a&&(a.onclick=()=>{b({type:"place_ships",ships:A}),T.play("fire")})}function ue(){const e=new Set;return A.forEach((s,o)=>{for(let a=0;a<V[o];a++){const t=s.horiz?s.row:s.row+a,n=s.horiz?s.col+a:s.col;e.add(`${t},${n}`)}}),e}function F(e,s,o,a){const t=ue();for(let n=0;n<o;n++){const i=a?e:e+n,r=a?s+n:s;if(i<0||i>=f||r<0||r>=f||t.has(`${i},${r}`))return!1}return!0}function ne(){M=S(),A.forEach((e,s)=>{for(let o=0;o<V[s];o++){const a=e.horiz?e.row:e.row+o,t=e.horiz?e.col+o:e.col;M[a][t]=1}})}function me(){A=[];for(const e of V)for(let s=0;s<500;s++){const o=Math.random()>.5,a=Math.floor(Math.random()*f),t=Math.floor(Math.random()*f);if(F(a,t,e,o)){A.push({row:a,col:t,horiz:o});break}}ne()}function fe(){const e=document.getElementById("place-grid");if(!e)return;ne();const s=A.length<V.length?V[A.length]:0;e.innerHTML="";const o=()=>e.querySelectorAll(".preview, .preview-bad").forEach(t=>t.classList.remove("preview","preview-bad")),a=(t,n)=>{if(o(),!s)return;const i=F(t,n,s,L);for(let r=0;r<s;r++){const l=L?t:t+r,c=L?n+r:n;l>=0&&l<f&&c>=0&&c<f&&e.children[l*f+c]?.classList.add(i?"preview":"preview-bad")}};for(let t=0;t<f;t++)for(let n=0;n<f;n++){const i=document.createElement("div");i.className="gcell",M[t][n]===1&&i.classList.add("ship"),i.addEventListener("pointerenter",()=>a(t,n)),i.addEventListener("click",()=>{s&&F(t,n,s,L)&&(A.push({row:t,col:n,horiz:L}),T.play("miss"),g())}),e.appendChild(i)}e.addEventListener("pointerleave",o)}function N(){O.innerHTML=`
    <div class="battle-screen">
      <header class="battle-header">
        <span class="vs-text">${p(k)} <span class="vs">VS</span> ${p(h)}</span>
        <span class="wager-badge">💰 ${W} pts</span>
        <span class="points-badge">Solde : ${$} pts</span>
      </header>
      <div id="turn-indicator" class="turn-indicator ${v?"my-turn":""}">
        ${v?w?"💣 CHOISIS LE CENTRE DE LA ZONE 3×3":"🎯 À TOI DE TIRER !":"⏳ "+p(h)+" vise..."}
      </div>
      <div class="battle-grids">
        <div class="battle-section enemy-section">
          <h3>🎯 Flotte de ${p(h)}</h3>
          <div id="enemy-grid" class="grid enemy-grid ${w?"zone-mode":""}"></div>
        </div>
        <div class="battle-section own-section">
          <h3>🛡️ Ta flotte</h3>
          <div id="own-grid" class="grid own-grid small"></div>
        </div>
      </div>
      <div class="power-bar">
        <button id="spin-btn" class="btn-spin" ${$<10||B?"disabled":""}>
          🎰 Roulette <span class="spin-cost">-10 pts</span>
        </button>
        ${B&&v?`<button id="zone-btn" class="btn-zone ${w?"active":""}">💣 ZONE 3×3 ${w?"— annuler":""}</button>`:""}
        ${B&&!v?'<span class="zone-pending">💣 Zone 3×3 prête pour ton tour</span>':""}
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
    </div>`,Z(),document.getElementById("forfeit-btn").onclick=()=>{confirm("Abandonner ? Tu perds la mise !")&&(b({type:"leave_game"}),m="lobby",g())};const e=document.getElementById("spin-btn");e&&(e.onclick=()=>{T.play("spin"),b({type:"spin"})});const s=document.getElementById("zone-btn");s&&(s.onclick=()=>{w=!w,N()}),C(),ae()}function he(){const e=document.getElementById("turn-indicator");e&&(e.className=`turn-indicator ${v?"my-turn":""}`,e.innerHTML=v?"🎯 À TOI DE TIRER !":"⏳ "+p(h)+" vise...")}function Z(){const e=document.getElementById("enemy-grid");if(e){e.innerHTML="";const o=()=>e.querySelectorAll(".zone-target").forEach(t=>t.classList.remove("zone-target")),a=(t,n)=>{o();for(let i=-1;i<=1;i++)for(let r=-1;r<=1;r++){const l=t+i,c=n+r;l>=0&&l<f&&c>=0&&c<f&&e.children[l*f+c]?.classList.add("zone-target")}};for(let t=0;t<f;t++)for(let n=0;n<f;n++){const i=document.createElement("div");i.className="gcell water";const r=H[t][n];r===2&&(i.classList.add("miss"),i.textContent="•"),r===3&&(i.classList.add("hit"),i.textContent="✕"),v&&w?(i.classList.add("clickable"),i.addEventListener("pointerenter",()=>a(t,n)),i.onclick=()=>{!v||!B||(T.play("fire"),b({type:"fire_zone",x:n,y:t}),w=!1)}):r===0&&v&&(i.classList.add("clickable"),i.onclick=()=>{v&&(T.play("fire"),b({type:"fire",x:n,y:t}))}),e.appendChild(i)}w&&e.addEventListener("pointerleave",o)}const s=document.getElementById("own-grid");if(s){s.innerHTML="";for(let o=0;o<f;o++)for(let a=0;a<f;a++){const t=document.createElement("div");t.className="gcell water";const n=M[o][a];n===1&&t.classList.add("ship"),n===2&&(t.classList.add("miss"),t.textContent="•"),n===3&&(t.classList.add("hit","ship-hit"),t.textContent="✕"),s.appendChild(t)}}}function be(e,s,o){J();const a=document.createElement("div");a.className="modal-overlay",a.innerHTML=`
    <div class="modal spin-modal">
      <h3>🎰 ROULETTE DU DESTIN</h3>
      <p class="spin-sub">${s?"Tu as lancé la roulette...":p(h)+" a lancé la roulette..."}</p>
      <div class="wheel-wrap">
        <div class="wheel-arrow">▼</div>
        <div id="spin-wheel" class="wheel">
          <div class="wheel-half wheel-me">TOI</div>
          <div class="wheel-half wheel-opp">${p(h).slice(0,8).toUpperCase()}</div>
        </div>
      </div>
      <p id="spin-verdict" class="spin-verdict"></p>
    </div>`,document.body.appendChild(a),T.play("spin");const t=document.getElementById("spin-wheel"),n=e?90:270,i=Math.random()*100-50,r=5*360+(360-n)+i*.6;requestAnimationFrame(()=>{t.style.transition="transform 2.4s cubic-bezier(0.15, 0.9, 0.25, 1)",t.style.transform=`rotate(${r}deg)`}),setTimeout(()=>{const l=document.getElementById("spin-verdict");l&&(l.textContent=e?"💣 TU GAGNES L'ATTAQUE DE ZONE !":`😈 ${h} gagne l'attaque de zone !`,l.className=`spin-verdict show ${e?"good":"bad"}`),T.play(e?"win":"lose")},2500),setTimeout(()=>{a.remove(),o()},4200)}function Q(e,s,o,a){const t=document.getElementById(e);if(!t)return;const n=t.children[o*f+s];n&&(n.classList.add(a?"explode":"splash"),setTimeout(()=>n.classList.remove("explode","splash"),700))}function ye(){O.innerHTML=`
    <div class="gameover-screen ${x?"win":"lose"}">
      <div class="go-icon">${x?"🏆":"💀"}</div>
      <h1>${x?"VICTOIRE !":"DÉFAITE"}</h1>
      <p class="go-detail">
        ${U?p(h)+" a abandonné !":x?"Tu as coulé toute la flotte de "+p(h)+" !":p(h)+" a coulé toute ta flotte..."}
      </p>
      ${D>0?`<p class="go-points ${x?"gain":"loss"}">${x?"+":"-"}${D} points</p>`:""}
      <p class="go-balance">Solde : <strong>${$} pts</strong></p>
      <div class="gameover-btns">
        ${U?"":'<button id="rematch-btn" class="btn-primary btn-glow">🔄 REVANCHE</button>'}
        <button id="lobby-btn" class="btn-action">⚓ Retour au port</button>
      </div>
    </div>`;const e=document.getElementById("rematch-btn");e&&(e.onclick=()=>{b({type:"rematch"}),y("Revanche proposée, en attente..."),e.setAttribute("disabled","true"),e.textContent="⏳ En attente..."}),document.getElementById("lobby-btn").onclick=()=>{b({type:"leave_game"}),m="lobby",g()}}function C(){const e=document.getElementById("join-chat-msgs");e&&(e.innerHTML=E.filter(t=>t.scope==="lobby").slice(-15).map(t=>Y(t)).join("")||'<p class="empty-msg">Silence radio pour le moment...</p>',e.scrollTop=e.scrollHeight);const s=document.getElementById("chat-messages");if(!s)return;const o=m==="battle"||m==="placement"?"game":"lobby",a=E.filter(t=>t.scope===o);s.innerHTML=a.map((t,n)=>Y(t,n)).join(""),s.scrollTop=s.scrollHeight,s.querySelectorAll(".chat-reply-btn").forEach(t=>{t.addEventListener("click",n=>{n.stopPropagation();const i=t.closest(".chat-msg"),r=parseInt(i?.dataset.i||"0"),l=a[r];l&&(I={id:l.id||"",from:l.from,text:l.text}),_()})}),s.querySelectorAll(".chat-mention").forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-name")||"";for(let i=a.length-1;i>=0;i--)if(a[i].from===n){const r=s.children[i];r&&(r.scrollIntoView({behavior:"smooth",block:"center"}),r.classList.add("msg-flash"),setTimeout(()=>r.classList.remove("msg-flash"),1800));return}y(`${n} n'a pas de message récent ici`)})})}function Y(e,s){const o=e.from===k,a=e.replyTo?`<div class="reply-quote"><span class="reply-quote-bar"></span><span class="reply-quote-text">${p(e.replySnip||"")}</span></div>`:"",t=ge(e.text),n=s!==void 0?` data-i="${s}"`:"";return`<div class="chat-msg ${o?"mine":""}"${n}>
    ${a}
    <span class="chat-from">${p(e.from)}</span>
    <span class="chat-text">${t}</span>
    <button class="chat-reply-btn" title="Répondre">↩</button>
  </div>`}function ge(e){return e.replace(/(^| )@([a-zA-Z0-9_-]+)/g,(s,o,a)=>`${o}<span class="chat-mention" data-name="${K(a)}">@${p(a)}</span>`)}function _(){if(document.getElementById("reply-bar")?.remove(),!I)return;const e=document.querySelector(".chat-input")?.parentElement;if(!e)return;const s=document.createElement("div");s.id="reply-bar",s.className="reply-bar",s.innerHTML=`
    <div class="reply-bar-top"></div>
    <span class="reply-bar-label">Répondre à <strong>${p(I.from)}</strong></span>
    <span class="reply-bar-snip">${p(I.text.slice(0,50))}${I.text.length>50?"…":""}</span>
    <button class="reply-bar-cancel">✕</button>
  `,e.insertBefore(s,e.firstChild),s.querySelector(".reply-bar-cancel").addEventListener("click",()=>{I=null,_()})}function ae(){const e=document.getElementById("chat-inp"),s=document.getElementById("chat-send-btn");if(!e||!s)return;const o=()=>{const a=e.value.trim();if(!a)return;const t={type:"chat",text:a};I&&(t.replyTo=I.id,I=null,_()),b(t),e.value=""};s.onclick=o,e.onkeydown=a=>{a.key==="Enter"&&o()},_()}let X;function y(e){document.querySelectorAll(".toast").forEach(o=>o.remove()),clearTimeout(X);const s=document.createElement("div");s.className="toast",s.textContent=e,document.body.appendChild(s),X=setTimeout(()=>s.remove(),2800)}function p(e){const s=document.createElement("div");return s.textContent=e,s.innerHTML}function K(e){return e.replace(/"/g,"&quot;").replace(/</g,"&lt;")}window.addEventListener("error",e=>{b({type:"client_log",level:"error",message:`${e.message} @ ${e.filename}:${e.lineno}`})});window.addEventListener("unhandledrejection",e=>{b({type:"client_log",level:"error",message:`unhandled rejection: ${e.reason}`})});te();g();
