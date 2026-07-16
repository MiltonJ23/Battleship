(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const t of n)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function o(n){const t={};return n.integrity&&(t.integrity=n.integrity),n.referrerPolicy&&(t.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?t.credentials="include":n.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(n){if(n.ep)return;n.ep=!0;const t=o(n);fetch(n.href,t)}})();class te{ctx=null;getCtx(){return this.ctx||(this.ctx=new AudioContext),this.ctx}play(a){try{const o=this.getCtx(),s=o.createOscillator(),n=o.createGain();s.connect(n),n.connect(o.destination);const t=o.currentTime;switch(a){case"tick":{s.type="square",s.frequency.setValueAtTime(1200,t),n.gain.setValueAtTime(.05,t),n.gain.exponentialRampToValueAtTime(.001,t+.04),s.start(t),s.stop(t+.04);break}case"spin":{for(let l=0;l<20;l++){const c=t+Math.pow(l/20,1.6)*2.2,r=o.createOscillator(),u=o.createGain();r.connect(u),u.connect(o.destination),r.type="square",r.frequency.setValueAtTime(1e3+Math.random()*300,c),u.gain.setValueAtTime(.05,c),u.gain.exponentialRampToValueAtTime(.001,c+.04),r.start(c),r.stop(c+.05)}break}case"zone":{for(let l=0;l<5;l++){const c=t+l*.12,r=o.createOscillator(),u=o.createGain();r.connect(u),u.connect(o.destination),r.type="sawtooth",r.frequency.setValueAtTime(160-l*15,c),r.frequency.exponentialRampToValueAtTime(40,c+.35),u.gain.setValueAtTime(.18,c),u.gain.exponentialRampToValueAtTime(.001,c+.4),r.start(c),r.stop(c+.4)}break}case"fire":s.type="sawtooth",s.frequency.setValueAtTime(150,t),s.frequency.exponentialRampToValueAtTime(60,t+.15),n.gain.setValueAtTime(.15,t),n.gain.exponentialRampToValueAtTime(.001,t+.2),s.start(t),s.stop(t+.2);break;case"hit":s.type="square",s.frequency.setValueAtTime(200,t),s.frequency.exponentialRampToValueAtTime(80,t+.4),n.gain.setValueAtTime(.2,t),n.gain.exponentialRampToValueAtTime(.001,t+.5),s.start(t),s.stop(t+.5);const i=o.createOscillator(),d=o.createGain();i.connect(d),d.connect(o.destination),i.type="triangle",i.frequency.setValueAtTime(400,t),i.frequency.exponentialRampToValueAtTime(100,t+.3),d.gain.setValueAtTime(.1,t),d.gain.exponentialRampToValueAtTime(.001,t+.35),i.start(t),i.stop(t+.35);break;case"sunk":for(let l=0;l<3;l++){const c=o.createOscillator(),r=o.createGain();c.connect(r),r.connect(o.destination),c.type="sawtooth",c.frequency.setValueAtTime(100-l*30,t+l*.15),c.frequency.exponentialRampToValueAtTime(30,t+l*.15+.5),r.gain.setValueAtTime(.2,t+l*.15),r.gain.exponentialRampToValueAtTime(.001,t+l*.15+.6),c.start(t+l*.15),c.stop(t+l*.15+.6)}break;case"miss":s.type="sine",s.frequency.setValueAtTime(600,t),s.frequency.exponentialRampToValueAtTime(300,t+.15),n.gain.setValueAtTime(.05,t),n.gain.exponentialRampToValueAtTime(.001,t+.2),s.start(t),s.stop(t+.2);break;case"win":[523,659,784,1047].forEach((l,c)=>{const r=o.createOscillator(),u=o.createGain();r.connect(u),u.connect(o.destination),r.type="triangle",r.frequency.setValueAtTime(l,t+c*.15),u.gain.setValueAtTime(.15,t+c*.15),u.gain.exponentialRampToValueAtTime(.001,t+c*.15+.4),r.start(t+c*.15),r.stop(t+c*.15+.4)});break;case"lose":[400,300,250,200].forEach((l,c)=>{const r=o.createOscillator(),u=o.createGain();r.connect(u),u.connect(o.destination),r.type="sawtooth",r.frequency.setValueAtTime(l,t+c*.2),u.gain.setValueAtTime(.12,t+c*.2),u.gain.exponentialRampToValueAtTime(.001,t+c*.2+.5),r.start(t+c*.2),r.stop(t+c*.2+.5)});break}}catch{}}}const T=new te;function ne(e){const a=["#00f0ff","#ff0055","#ffe600","#00ff88","#ff6600","#cc00ff"];for(let o=0;o<60;o++){const s=document.createElement("div");s.style.cssText=`
      position:fixed;width:8px;height:8px;border-radius:50%;
      background:${a[o%a.length]};pointer-events:none;z-index:9999;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation: confettiFall ${1+Math.random()*2}s ease-out forwards;
      animation-delay:${Math.random()*.5}s;
      opacity:1;
    `,e.appendChild(s),setTimeout(()=>s.remove(),3e3)}}const m=10,I=[5,4,3,3,2];let f="join",$="",E=0,j=0,_=0,S=0,h="",F=0,g=!1,R=!1,H=[],K=[],k=[],L=!0,z=B(),V=B(),x=!1,G=0,P=!1,C=!1,w=!1,A=[],M;function B(){return Array.from({length:m},()=>Array(m).fill(0))}function Q(){const e=location.protocol==="https:"?"wss":"ws";M=new WebSocket(`${e}://${location.host}/ws`),M.onopen=()=>{$&&f!=="join"&&b({type:"join",name:$})},M.onmessage=a=>{try{ae(JSON.parse(a.data))}catch{}},M.onclose=()=>{setTimeout(Q,2e3)}}function b(e){M&&M.readyState===WebSocket.OPEN&&M.send(JSON.stringify(e))}function ae(e){switch(e.type){case"joined":$=e.name,E=e.points,j=e.wins,_=e.losses,sessionStorage.setItem("bs_name",$),f="lobby",y();break;case"lobby_update":H=e.players||[],K=e.leaderboard||[],e.me&&(E=e.me.points,j=e.me.wins,_=e.me.losses),f==="lobby"&&y();break;case"challenge_sent":v(`Défi envoyé à ${e.target} — mise ${e.wager} pts ⏳`);break;case"challenge_received":ce(e.challenger,e.wager);break;case"challenge_declined":v(`${e.target} a refusé ton défi 😤`);break;case"game_start":h=e.opponent,F=e.wager,S=e.playerIdx??0,k=[],L=!0,g=!1,R=!1,C=!1,w=!1,z=B(),V=B(),A=A.filter(a=>a.scope!=="game"),f="placement",y();break;case"ships_accepted":R=!0,f==="placement"&&y();break;case"opponent_ready":v(`${h} est prêt ! ⚓`);break;case"battle_start":g=!!e.yourTurn,f="battle",y();break;case"fire_result":{const{x:a,y:o,result:s,ship:n,shooter:t}=e,i=s==="hit"||s==="sunk";t===S?(z[o][a]=i?3:2,T.play(s==="sunk"?"sunk":i?"hit":"miss"),s==="sunk"?v(`💥 ${n} ennemi coulé !`):i&&v("🎯 Touché !")):(V[o][a]=i?3:2,T.play(i?"hit":"miss"),s==="sunk"&&v(`☠️ Ton ${n} a été coulé...`)),g=!!e.yourTurn,f==="battle"&&!e.gameOver&&(ue(),U(),Z(t===S?"enemy-grid":"own-grid",a,o,i));break}case"game_over":x=!!e.won,G=e.pointsEarned||0,P=e.reason==="forfeit",typeof e.newPoints=="number"&&(E=e.newPoints),f="gameover",T.play(x?"win":"lose"),y(),x&&setTimeout(()=>ne(document.body),200);break;case"rematch_requested":v(`${h} veut une revanche ! 🔄`);break;case"opponent_left":v(`${h} a quitté`),f==="gameover"&&y();break;case"spin_result":typeof e.spinnerPoints=="number"&&e.youSpun&&(E=e.spinnerPoints),me(!!e.youBenefit,!!e.youSpun,()=>{e.youBenefit?(C=!0,v("💣 Attaque de zone 3×3 débloquée !")):v(`😱 ${h} a gagné l'attaque de zone !`),f==="battle"&&N()});break;case"zone_result":{const a=e.shooter===S;T.play("zone");let o=[];(e.cells||[]).forEach((s,n)=>{const{x:t,y:i,result:d}=s;if(d==="skip")return;const l=d==="hit"||d==="sunk";d==="sunk"&&s.ship&&o.push(s.ship),setTimeout(()=>{a?z[i][t]=l?3:2:V[i][t]=l?3:2,f==="battle"&&(U(),Z(a?"enemy-grid":"own-grid",t,i,l))},n*110)}),a&&(C=!1,w=!1),g=!!e.yourTurn,setTimeout(()=>{o.length&&(v(a?`💥 Coulé : ${o.join(", ")} !`:`☠️ Coulé : ${o.join(", ")}...`),T.play("sunk")),f==="battle"&&!e.gameOver&&N()},1100);break}case"chat_history":A=(e.messages||[]).map(a=>({from:a.from,text:a.text,scope:"lobby"})).concat(A.filter(a=>a.scope!=="lobby")),q();break;case"chat":A.push({from:e.from,text:e.text,scope:e.scope||"lobby"}),A.length>150&&A.shift(),q();break;case"error":v(`⚠️ ${e.message}`);break}}const O=document.getElementById("app");function y(){switch(f){case"join":se();break;case"lobby":oe();break;case"placement":le();break;case"battle":N();break;case"gameover":fe();break}}function se(){const e=sessionStorage.getItem("bs_name")||"";O.innerHTML=`
    <div class="join-screen">
      <div class="ocean-waves"></div>
      <div class="join-content">
        <div class="logo-anchor">⚓</div>
        <h1 class="game-title">BATAILLE<br/>NAVALE</h1>
        <p class="tagline">Duels · Mises · Gloire</p>
        <div class="join-form">
          <input id="name-input" type="text" placeholder="Ton pseudo, capitaine" maxlength="20" value="${ee(e)}" autocomplete="off" />
          <button id="join-btn" class="btn-primary btn-glow">⚔️ ENTRER AU COMBAT</button>
        </div>
        <p class="hint">100 points offerts aux nouveaux capitaines</p>
        <div class="join-chat panel">
          <h3>💬 Ça discute au port...</h3>
          <div id="join-chat-msgs" class="chat-msgs join-chat-msgs"></div>
        </div>
      </div>
    </div>`;const a=document.getElementById("name-input"),o=()=>{const s=a.value.trim();s&&($=s,b({type:"join",name:s}))};document.getElementById("join-btn").onclick=o,a.onkeydown=s=>{s.key==="Enter"&&o()},a.focus(),q()}function oe(){O.innerHTML=`
    <div class="lobby-screen">
      <header class="lobby-header">
        <div class="header-left">
          <span class="header-logo">⚓</span>
          <span class="header-title">BATAILLE NAVALE</span>
        </div>
        <div class="my-badge">
          <span class="badge-name">${p($)}</span>
          <span class="badge-points">💰 ${E} pts</span>
          <span class="badge-record">${j}V / ${_}D</span>
        </div>
      </header>
      <div class="lobby-body">
        <section class="panel players-panel">
          <h2>🌊 Capitaines en ligne <span class="count">${H.length}</span></h2>
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
    </div>`;const e=document.getElementById("lb-list"),a=["🥇","🥈","🥉"];e.innerHTML=K.map((n,t)=>`
    <li class="${n.name===$?"me":""}">
      <span class="lb-rank">${a[t]||t+1}</span>
      <span class="lb-name">${p(n.name)}</span>
      <span class="lb-pts">${n.points}</span>
    </li>`).join("");const o=document.getElementById("player-list"),s=H.filter(n=>n.name!==$);o.innerHTML=s.length?s.map(n=>`
    <div class="player-row ${n.inGame?"ingame":""}">
      <div class="p-avatar">${n.name[0].toUpperCase()}</div>
      <div class="p-info">
        <span class="p-name">${p(n.name)}</span>
        <span class="p-stats">${n.points} pts · ${n.wins}V/${n.losses}D</span>
      </div>
      ${n.inGame?'<span class="p-status">⚔️ En duel</span>':`<button class="btn-challenge" data-target="${ee(n.name)}">DÉFIER</button>`}
    </div>`).join(""):`<p class="empty-msg">Personne d'autre en ligne...<br/>Partage l'adresse à tes amis !</p>`,o.querySelectorAll(".btn-challenge").forEach(n=>{n.addEventListener("click",()=>ie(n.dataset.target))}),q(),X()}function ie(e){W();const a=document.createElement("div");a.className="modal-overlay",a.innerHTML=`
    <div class="modal">
      <h3>⚔️ Défier ${p(e)}</h3>
      <label>Mise (tu as ${E} pts)</label>
      <div class="wager-quick">
        <button data-w="0">Amical</button>
        <button data-w="10">10</button>
        <button data-w="25">25</button>
        <button data-w="50">50</button>
      </div>
      <input id="wager-input" type="number" min="0" max="${E}" value="10" inputmode="numeric" />
      <div class="modal-btns">
        <button id="wager-cancel">Annuler</button>
        <button id="wager-ok" class="btn-primary">ENVOYER LE DÉFI</button>
      </div>
    </div>`,document.body.appendChild(a),a.onclick=o=>o.target===a&&a.remove(),a.querySelectorAll(".wager-quick button").forEach(o=>{o.onclick=()=>{document.getElementById("wager-input").value=o.dataset.w}}),document.getElementById("wager-cancel").onclick=()=>a.remove(),document.getElementById("wager-ok").onclick=()=>{const o=+document.getElementById("wager-input").value||0,s=Math.max(0,Math.min(E,o));b({type:"challenge",target:e,wager:s}),a.remove()}}function ce(e,a){W();const o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`
    <div class="modal modal-challenge">
      <div class="challenge-icon">⚔️</div>
      <h3>DÉFI REÇU !</h3>
      <p><strong>${p(e)}</strong> te défie en duel</p>
      <p class="wager-display">Mise : <strong>${a} pts</strong></p>
      <div class="modal-btns">
        <button id="ch-decline">Refuser</button>
        <button id="ch-accept" class="btn-primary btn-glow">ACCEPTER</button>
      </div>
    </div>`,document.body.appendChild(o),document.getElementById("ch-decline").onclick=()=>{b({type:"decline_challenge",challenger:e}),o.remove()},document.getElementById("ch-accept").onclick=()=>{b({type:"accept_challenge",challenger:e}),o.remove()}}function W(){document.querySelectorAll(".modal-overlay").forEach(e=>e.remove())}function le(){const e=k.length,a=e===I.length;if(O.innerHTML=`
    <div class="place-screen">
      <header class="battle-header">
        <span class="vs-text">${p($)} <span class="vs">VS</span> ${p(h)}</span>
        <span class="wager-badge">💰 ${F} pts</span>
      </header>
      <h2 class="phase-title">${R?"⏳ En attente de "+p(h)+"...":"⚓ Déploie ta flotte"}</h2>
      ${R?'<div class="waiting-spinner"></div>':`
      <div class="place-progress">${I.map((n,t)=>`<span class="prog-dot ${t<e?"done":t===e?"current":""}">${n}</span>`).join("")}</div>
      <div id="place-grid" class="grid place-grid"></div>
      <div class="place-actions">
        <button id="rotate-btn" class="btn-action">↻ ${L?"Horizontal":"Vertical"}</button>
        <button id="random-btn" class="btn-action">🎲 Aléatoire</button>
        ${e>0&&!a?'<button id="reset-btn" class="btn-action">🗑️ Effacer</button>':""}
        ${a?'<button id="confirm-btn" class="btn-primary btn-glow">✓ PRÊT AU COMBAT</button>':""}
      </div>
      ${a?"":`<p class="help-text">Touche la grille pour placer le bateau de ${I[e]} cases</p>`}
      `}
    </div>`,R)return;pe(),document.getElementById("rotate-btn").onclick=()=>{L=!L,y()},document.getElementById("random-btn").onclick=()=>{de(),y()};const o=document.getElementById("reset-btn");o&&(o.onclick=()=>{k=[],V=B(),y()});const s=document.getElementById("confirm-btn");s&&(s.onclick=()=>{b({type:"place_ships",ships:k}),T.play("fire")})}function re(){const e=new Set;return k.forEach((a,o)=>{for(let s=0;s<I[o];s++){const n=a.horiz?a.row:a.row+s,t=a.horiz?a.col+s:a.col;e.add(`${n},${t}`)}}),e}function D(e,a,o,s){const n=re();for(let t=0;t<o;t++){const i=s?e:e+t,d=s?a+t:a;if(i<0||i>=m||d<0||d>=m||n.has(`${i},${d}`))return!1}return!0}function Y(){V=B(),k.forEach((e,a)=>{for(let o=0;o<I[a];o++){const s=e.horiz?e.row:e.row+o,n=e.horiz?e.col+o:e.col;V[s][n]=1}})}function de(){k=[];for(const e of I)for(let a=0;a<500;a++){const o=Math.random()>.5,s=Math.floor(Math.random()*m),n=Math.floor(Math.random()*m);if(D(s,n,e,o)){k.push({row:s,col:n,horiz:o});break}}Y()}function pe(){const e=document.getElementById("place-grid");if(!e)return;Y();const a=k.length<I.length?I[k.length]:0;e.innerHTML="";const o=()=>e.querySelectorAll(".preview, .preview-bad").forEach(n=>n.classList.remove("preview","preview-bad")),s=(n,t)=>{if(o(),!a)return;const i=D(n,t,a,L);for(let d=0;d<a;d++){const l=L?n:n+d,c=L?t+d:t;l>=0&&l<m&&c>=0&&c<m&&e.children[l*m+c]?.classList.add(i?"preview":"preview-bad")}};for(let n=0;n<m;n++)for(let t=0;t<m;t++){const i=document.createElement("div");i.className="gcell",V[n][t]===1&&i.classList.add("ship"),i.addEventListener("pointerenter",()=>s(n,t)),i.addEventListener("click",()=>{a&&D(n,t,a,L)&&(k.push({row:n,col:t,horiz:L}),T.play("miss"),y())}),e.appendChild(i)}e.addEventListener("pointerleave",o)}function N(){O.innerHTML=`
    <div class="battle-screen">
      <header class="battle-header">
        <span class="vs-text">${p($)} <span class="vs">VS</span> ${p(h)}</span>
        <span class="wager-badge">💰 ${F} pts</span>
        <span class="points-badge">Solde : ${E} pts</span>
      </header>
      <div id="turn-indicator" class="turn-indicator ${g?"my-turn":""}">
        ${g?w?"💣 CHOISIS LE CENTRE DE LA ZONE 3×3":"🎯 À TOI DE TIRER !":"⏳ "+p(h)+" vise..."}
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
        <button id="spin-btn" class="btn-spin" ${E<10||C?"disabled":""}>
          🎰 Roulette <span class="spin-cost">-10 pts</span>
        </button>
        ${C&&g?`<button id="zone-btn" class="btn-zone ${w?"active":""}">💣 ZONE 3×3 ${w?"— annuler":""}</button>`:""}
        ${C&&!g?'<span class="zone-pending">💣 Zone 3×3 prête pour ton tour</span>':""}
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
    </div>`,U(),document.getElementById("forfeit-btn").onclick=()=>{confirm("Abandonner ? Tu perds la mise !")&&(b({type:"leave_game"}),f="lobby",y())};const e=document.getElementById("spin-btn");e&&(e.onclick=()=>{T.play("spin"),b({type:"spin"})});const a=document.getElementById("zone-btn");a&&(a.onclick=()=>{w=!w,N()}),q(),X()}function ue(){const e=document.getElementById("turn-indicator");e&&(e.className=`turn-indicator ${g?"my-turn":""}`,e.innerHTML=g?"🎯 À TOI DE TIRER !":"⏳ "+p(h)+" vise...")}function U(){const e=document.getElementById("enemy-grid");if(e){e.innerHTML="";const o=()=>e.querySelectorAll(".zone-target").forEach(n=>n.classList.remove("zone-target")),s=(n,t)=>{o();for(let i=-1;i<=1;i++)for(let d=-1;d<=1;d++){const l=n+i,c=t+d;l>=0&&l<m&&c>=0&&c<m&&e.children[l*m+c]?.classList.add("zone-target")}};for(let n=0;n<m;n++)for(let t=0;t<m;t++){const i=document.createElement("div");i.className="gcell water";const d=z[n][t];d===2&&(i.classList.add("miss"),i.textContent="•"),d===3&&(i.classList.add("hit"),i.textContent="✕"),g&&w?(i.classList.add("clickable"),i.addEventListener("pointerenter",()=>s(n,t)),i.onclick=()=>{!g||!C||(T.play("fire"),b({type:"fire_zone",x:t,y:n}),w=!1)}):d===0&&g&&(i.classList.add("clickable"),i.onclick=()=>{g&&(T.play("fire"),b({type:"fire",x:t,y:n}))}),e.appendChild(i)}w&&e.addEventListener("pointerleave",o)}const a=document.getElementById("own-grid");if(a){a.innerHTML="";for(let o=0;o<m;o++)for(let s=0;s<m;s++){const n=document.createElement("div");n.className="gcell water";const t=V[o][s];t===1&&n.classList.add("ship"),t===2&&(n.classList.add("miss"),n.textContent="•"),t===3&&(n.classList.add("hit","ship-hit"),n.textContent="✕"),a.appendChild(n)}}}function me(e,a,o){W();const s=document.createElement("div");s.className="modal-overlay",s.innerHTML=`
    <div class="modal spin-modal">
      <h3>🎰 ROULETTE DU DESTIN</h3>
      <p class="spin-sub">${a?"Tu as lancé la roulette...":p(h)+" a lancé la roulette..."}</p>
      <div class="wheel-wrap">
        <div class="wheel-arrow">▼</div>
        <div id="spin-wheel" class="wheel">
          <div class="wheel-half wheel-me">TOI</div>
          <div class="wheel-half wheel-opp">${p(h).slice(0,8).toUpperCase()}</div>
        </div>
      </div>
      <p id="spin-verdict" class="spin-verdict"></p>
    </div>`,document.body.appendChild(s),T.play("spin");const n=document.getElementById("spin-wheel"),t=e?90:270,i=Math.random()*100-50,d=5*360+(360-t)+i*.6;requestAnimationFrame(()=>{n.style.transition="transform 2.4s cubic-bezier(0.15, 0.9, 0.25, 1)",n.style.transform=`rotate(${d}deg)`}),setTimeout(()=>{const l=document.getElementById("spin-verdict");l&&(l.textContent=e?"💣 TU GAGNES L'ATTAQUE DE ZONE !":`😈 ${h} gagne l'attaque de zone !`,l.className=`spin-verdict show ${e?"good":"bad"}`),T.play(e?"win":"lose")},2500),setTimeout(()=>{s.remove(),o()},4200)}function Z(e,a,o,s){const n=document.getElementById(e);if(!n)return;const t=n.children[o*m+a];t&&(t.classList.add(s?"explode":"splash"),setTimeout(()=>t.classList.remove("explode","splash"),700))}function fe(){O.innerHTML=`
    <div class="gameover-screen ${x?"win":"lose"}">
      <div class="go-icon">${x?"🏆":"💀"}</div>
      <h1>${x?"VICTOIRE !":"DÉFAITE"}</h1>
      <p class="go-detail">
        ${P?p(h)+" a abandonné !":x?"Tu as coulé toute la flotte de "+p(h)+" !":p(h)+" a coulé toute ta flotte..."}
      </p>
      ${G>0?`<p class="go-points ${x?"gain":"loss"}">${x?"+":"-"}${G} points</p>`:""}
      <p class="go-balance">Solde : <strong>${E} pts</strong></p>
      <div class="gameover-btns">
        ${P?"":'<button id="rematch-btn" class="btn-primary btn-glow">🔄 REVANCHE</button>'}
        <button id="lobby-btn" class="btn-action">⚓ Retour au port</button>
      </div>
    </div>`;const e=document.getElementById("rematch-btn");e&&(e.onclick=()=>{b({type:"rematch"}),v("Revanche proposée, en attente..."),e.setAttribute("disabled","true"),e.textContent="⏳ En attente..."}),document.getElementById("lobby-btn").onclick=()=>{b({type:"leave_game"}),f="lobby",y()}}function q(){const e=document.getElementById("join-chat-msgs");e&&(e.innerHTML=A.filter(s=>s.scope==="lobby").slice(-15).map(s=>`<div class="chat-msg"><span class="chat-from">${p(s.from)}</span> ${p(s.text)}</div>`).join("")||'<p class="empty-msg">Silence radio pour le moment...</p>',e.scrollTop=e.scrollHeight);const a=document.getElementById("chat-messages");if(!a)return;const o=f==="battle"||f==="placement"?"game":"lobby";a.innerHTML=A.filter(s=>s.scope===o).map(s=>`<div class="chat-msg ${s.from===$?"mine":""}"><span class="chat-from">${p(s.from)}</span> ${p(s.text)}</div>`).join(""),a.scrollTop=a.scrollHeight}function X(){const e=document.getElementById("chat-inp"),a=document.getElementById("chat-send-btn");if(!e||!a)return;const o=()=>{const s=e.value.trim();s&&(b({type:"chat",text:s}),e.value="")};a.onclick=o,e.onkeydown=s=>{s.key==="Enter"&&o()}}let J;function v(e){document.querySelectorAll(".toast").forEach(o=>o.remove()),clearTimeout(J);const a=document.createElement("div");a.className="toast",a.textContent=e,document.body.appendChild(a),J=setTimeout(()=>a.remove(),2800)}function p(e){const a=document.createElement("div");return a.textContent=e,a.innerHTML}function ee(e){return e.replace(/"/g,"&quot;").replace(/</g,"&lt;")}window.addEventListener("error",e=>{b({type:"client_log",level:"error",message:`${e.message} @ ${e.filename}:${e.lineno}`})});window.addEventListener("unhandledrejection",e=>{b({type:"client_log",level:"error",message:`unhandled rejection: ${e.reason}`})});Q();y();
