(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const t of a)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function s(a){const t={};return a.integrity&&(t.integrity=a.integrity),a.referrerPolicy&&(t.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?t.credentials="include":a.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(a){if(a.ep)return;a.ep=!0;const t=s(a);fetch(a.href,t)}})();class ie{ctx=null;getCtx(){return this.ctx||(this.ctx=new AudioContext),this.ctx}play(o){try{const s=this.getCtx(),n=s.createOscillator(),a=s.createGain();n.connect(a),a.connect(s.destination);const t=s.currentTime;switch(o){case"tick":{n.type="square",n.frequency.setValueAtTime(1200,t),a.gain.setValueAtTime(.05,t),a.gain.exponentialRampToValueAtTime(.001,t+.04),n.start(t),n.stop(t+.04);break}case"spin":{for(let i=0;i<20;i++){const c=t+Math.pow(i/20,1.6)*2.2,d=s.createOscillator(),u=s.createGain();d.connect(u),u.connect(s.destination),d.type="square",d.frequency.setValueAtTime(1e3+Math.random()*300,c),u.gain.setValueAtTime(.05,c),u.gain.exponentialRampToValueAtTime(.001,c+.04),d.start(c),d.stop(c+.05)}break}case"zone":{for(let i=0;i<5;i++){const c=t+i*.12,d=s.createOscillator(),u=s.createGain();d.connect(u),u.connect(s.destination),d.type="sawtooth",d.frequency.setValueAtTime(160-i*15,c),d.frequency.exponentialRampToValueAtTime(40,c+.35),u.gain.setValueAtTime(.18,c),u.gain.exponentialRampToValueAtTime(.001,c+.4),d.start(c),d.stop(c+.4)}break}case"fire":n.type="sawtooth",n.frequency.setValueAtTime(150,t),n.frequency.exponentialRampToValueAtTime(60,t+.15),a.gain.setValueAtTime(.15,t),a.gain.exponentialRampToValueAtTime(.001,t+.2),n.start(t),n.stop(t+.2);break;case"hit":n.type="square",n.frequency.setValueAtTime(200,t),n.frequency.exponentialRampToValueAtTime(80,t+.4),a.gain.setValueAtTime(.2,t),a.gain.exponentialRampToValueAtTime(.001,t+.5),n.start(t),n.stop(t+.5);const l=s.createOscillator(),r=s.createGain();l.connect(r),r.connect(s.destination),l.type="triangle",l.frequency.setValueAtTime(400,t),l.frequency.exponentialRampToValueAtTime(100,t+.3),r.gain.setValueAtTime(.1,t),r.gain.exponentialRampToValueAtTime(.001,t+.35),l.start(t),l.stop(t+.35);break;case"sunk":for(let i=0;i<3;i++){const c=s.createOscillator(),d=s.createGain();c.connect(d),d.connect(s.destination),c.type="sawtooth",c.frequency.setValueAtTime(100-i*30,t+i*.15),c.frequency.exponentialRampToValueAtTime(30,t+i*.15+.5),d.gain.setValueAtTime(.2,t+i*.15),d.gain.exponentialRampToValueAtTime(.001,t+i*.15+.6),c.start(t+i*.15),c.stop(t+i*.15+.6)}break;case"miss":n.type="sine",n.frequency.setValueAtTime(600,t),n.frequency.exponentialRampToValueAtTime(300,t+.15),a.gain.setValueAtTime(.05,t),a.gain.exponentialRampToValueAtTime(.001,t+.2),n.start(t),n.stop(t+.2);break;case"win":[523,659,784,1047].forEach((i,c)=>{const d=s.createOscillator(),u=s.createGain();d.connect(u),u.connect(s.destination),d.type="triangle",d.frequency.setValueAtTime(i,t+c*.15),u.gain.setValueAtTime(.15,t+c*.15),u.gain.exponentialRampToValueAtTime(.001,t+c*.15+.4),d.start(t+c*.15),d.stop(t+c*.15+.4)});break;case"lose":[400,300,250,200].forEach((i,c)=>{const d=s.createOscillator(),u=s.createGain();d.connect(u),u.connect(s.destination),d.type="sawtooth",d.frequency.setValueAtTime(i,t+c*.2),u.gain.setValueAtTime(.12,t+c*.2),u.gain.exponentialRampToValueAtTime(.001,t+c*.2+.5),d.start(t+c*.2),d.stop(t+c*.2+.5)});break}}catch{}}}const T=new ie;function le(e){const o=["#00f0ff","#ff0055","#ffe600","#00ff88","#ff6600","#cc00ff"];for(let s=0;s<60;s++){const n=document.createElement("div");n.style.cssText=`
      position:fixed;width:8px;height:8px;border-radius:50%;
      background:${o[s%o.length]};pointer-events:none;z-index:9999;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation: confettiFall ${1+Math.random()*2}s ease-out forwards;
      animation-delay:${Math.random()*.5}s;
      opacity:1;
    `,e.appendChild(n),setTimeout(()=>n.remove(),3e3)}}const f=10,M=[5,4,3,3,2];let m="join",x="",g=0,G=0,D=0,N=0,h="",K=0,E=!1,z=!1,U=[],te=[],w=[],L=!0,H=S(),q=S(),I=!1,F=0,Z=!1,C=!1,k=!1,$=[],B=null,A=null,V;function S(){return Array.from({length:f},()=>Array(f).fill(0))}function ne(){const e=location.protocol==="https:"?"wss":"ws";V=new WebSocket(`${e}://${location.host}/ws`),V.onopen=()=>{x&&m!=="join"&&y({type:"join",name:x})},V.onmessage=o=>{try{ce(JSON.parse(o.data))}catch{}},V.onclose=()=>{setTimeout(ne,2e3)}}function y(e){V&&V.readyState===WebSocket.OPEN&&V.send(JSON.stringify(e))}function ce(e){switch(e.type){case"joined":x=e.name,g=e.points,G=e.wins,D=e.losses,sessionStorage.setItem("bs_name",x),m="lobby",b();break;case"lobby_update":U=e.players||[],te=e.leaderboard||[],e.me&&(g=e.me.points,G=e.me.wins,D=e.me.losses),m==="lobby"&&b();break;case"challenge_sent":v(`Défi envoyé à ${e.target} — mise ${e.wager} pts ⏳`);break;case"challenge_received":fe(e.challenger,e.wager);break;case"challenge_declined":v(`${e.target} a refusé ton défi 😤`);break;case"game_start":h=e.opponent,K=e.wager,N=e.playerIdx??0,w=[],L=!0,E=!1,z=!1,C=!1,k=!1,H=S(),q=S(),$=$.filter(n=>n.scope!=="game"),m="placement",b();break;case"ships_accepted":z=!0,m==="placement"&&b();break;case"opponent_ready":v(`${h} est prêt ! ⚓`);break;case"battle_start":E=!!e.yourTurn,m="battle",b();break;case"fire_result":{const{x:n,y:a,result:t,ship:l,shooter:r}=e,i=t==="hit"||t==="sunk";r===N?(H[a][n]=i?3:2,T.play(t==="sunk"?"sunk":i?"hit":"miss"),t==="sunk"?v(`💥 ${l} ennemi coulé !`):i&&v("🎯 Touché !")):(q[a][n]=i?3:2,T.play(i?"hit":"miss"),t==="sunk"&&v(`☠️ Ton ${l} a été coulé...`)),E=!!e.yourTurn,m==="battle"&&!e.gameOver&&(ge(),J(),Y(r===N?"enemy-grid":"own-grid",n,a,i));break}case"loan_approved":typeof e.newPoints=="number"&&(g=e.newPoints),A={principal:e.amount,remaining:e.amount+e.amount*e.rate/100,rate:e.rate,installment:e.installment||0,repaid:0},v(`🏦 Prêt de ${e.amount} pts accordé ! Taux: ${e.rate}%. Nouveau solde: ${g} pts`),m==="lobby"&&b();break;case"loan_status":A={principal:e.principal,remaining:e.remaining,rate:e.rate,installment:e.installment||0,repaid:e.repaid},m==="lobby"&&b();break;case"game_over":I=!!e.won,F=e.pointsEarned||0,Z=e.reason==="forfeit",typeof e.newPoints=="number"&&(g=e.newPoints),m="gameover",T.play(I?"win":"lose"),b(),I&&setTimeout(()=>le(document.body),200);break;case"rematch_requested":v(`${h} veut une revanche ! 🔄`);break;case"opponent_left":v(`${h} a quitté`),m==="gameover"&&b();break;case"spin_result":typeof e.spinnerPoints=="number"&&e.youSpun&&(g=e.spinnerPoints),Te(!!e.youBenefit,!!e.youSpun,()=>{e.youBenefit?(C=!0,v("💣 Attaque de zone 3×3 débloquée !")):v(`😱 ${h} a gagné l'attaque de zone !`),m==="battle"&&_()});break;case"zone_result":{const n=e.shooter===N;T.play("zone");let a=[];(e.cells||[]).forEach((t,l)=>{const{x:r,y:i,result:c}=t;if(c==="skip")return;const d=c==="hit"||c==="sunk";c==="sunk"&&t.ship&&a.push(t.ship),setTimeout(()=>{n?H[i][r]=d?3:2:q[i][r]=d?3:2,m==="battle"&&(J(),Y(n?"enemy-grid":"own-grid",r,i,d))},l*110)}),n&&(C=!1,k=!1),E=!!e.yourTurn,setTimeout(()=>{a.length&&(v(n?`💥 Coulé : ${a.join(", ")} !`:`☠️ Coulé : ${a.join(", ")}...`),T.play("sunk")),m==="battle"&&!e.gameOver&&_()},1100);break}case"chat_history":$=(e.messages||[]).map(n=>({id:n.id,from:n.from,text:n.text,scope:"lobby",replyTo:n.replyTo||void 0})).concat($.filter(n=>n.scope!=="lobby")),R();break;case"chat":$.push({id:e.id,from:e.from,text:e.text,scope:e.scope||"lobby",replyTo:e.replyTo||void 0,replySnip:e.replySnip||void 0}),$.length>150&&$.shift(),R();break;case"mention":T.play("hit");const o=e.text.slice(0,60)+(e.text.length>60?"…":""),s=document.createElement("div");s.className="toast toast-mention",s.innerHTML=`🔔 <strong>${p(e.from)}</strong> t'a mentionné<br/><em>${p(o)}</em>`,s.onclick=()=>{if(m==="battle"||m==="placement")return;const n=document.getElementById("chat-messages");n&&(n.scrollTop=n.scrollHeight)},document.body.appendChild(s),setTimeout(()=>s.remove(),3500),$.length<150&&$.push({from:e.from,text:e.text,scope:"lobby"}),R();break;case"error":v(`⚠️ ${e.message}`);break}}const O=document.getElementById("app");function b(){switch(m){case"join":re();break;case"lobby":de();break;case"placement":be();break;case"battle":_();break;case"gameover":Ee();break}}function re(){const e=sessionStorage.getItem("bs_name")||"";O.innerHTML=`
    <div class="join-screen">
      <div class="ocean-waves"></div>
      <div class="join-content">
        <div class="logo-anchor">⚓</div>
        <h1 class="game-title">BATAILLE<br/>NAVALE</h1>
        <p class="tagline">Duels · Mises · Gloire</p>
        <div class="join-form">
          <input id="name-input" type="text" placeholder="Ton pseudo, capitaine" maxlength="20" value="${Q(e)}" autocomplete="off" />
          <button id="join-btn" class="btn-primary btn-glow">⚔️ ENTRER AU COMBAT</button>
        </div>
        <p class="hint">100 points offerts aux nouveaux capitaines</p>
        <div class="join-chat panel">
          <h3>💬 Ça discute au port...</h3>
          <div id="join-chat-msgs" class="chat-msgs join-chat-msgs"></div>
        </div>
      </div>
    </div>`;const o=document.getElementById("name-input"),s=()=>{const n=o.value.trim();n&&(x=n,y({type:"join",name:n}))};document.getElementById("join-btn").onclick=s,o.onkeydown=n=>{n.key==="Enter"&&s()},o.focus(),R()}function de(){O.innerHTML=`
    <div class="lobby-screen">
      <header class="lobby-header">
        <div class="header-left">
          <span class="header-logo">⚓</span>
          <span class="header-title">BATAILLE NAVALE</span>
        </div>
        <div class="my-badge">
          <span class="badge-name">${p(x)}</span>
          <span class="badge-points">💰 ${g} pts</span>
          <span class="badge-record">${G}V / ${D}D</span>
        </div>
        ${pe()}
      </header>
      <div class="lobby-body">
        <section class="panel players-panel">
          <h2>🌊 Capitaines en ligne <span class="count">${U.length}</span></h2>
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
    </div>`;const e=document.getElementById("lb-list"),o=["🥇","🥈","🥉"];e.innerHTML=te.map((t,l)=>`
    <li class="${t.name===x?"me":""}">
      <span class="lb-rank">${o[l]||l+1}</span>
      <span class="lb-name">${p(t.name)}</span>
      <span class="lb-pts">${t.points}</span>
    </li>`).join("");const s=document.getElementById("player-list"),n=U.filter(t=>t.name!==x);s.innerHTML=n.length?n.map(t=>`
    <div class="player-row ${t.inGame?"ingame":""}">
      <div class="p-avatar">${t.name[0].toUpperCase()}</div>
      <div class="p-info">
        <span class="p-name">${p(t.name)}</span>
        <span class="p-stats">${t.points} pts · ${t.wins}V/${t.losses}D</span>
      </div>
      ${t.inGame?'<span class="p-status">⚔️ En duel</span>':`<button class="btn-challenge" data-target="${Q(t.name)}">DÉFIER</button>`}
    </div>`).join(""):`<p class="empty-msg">Personne d'autre en ligne...<br/>Partage l'adresse à tes amis !</p>`,s.querySelectorAll(".btn-challenge").forEach(t=>{t.addEventListener("click",()=>ue(t.dataset.target))}),R(),oe();const a=document.getElementById("borrow-btn");a&&(a.onclick=me),y({type:"loan_status"})}function pe(){if(!A)return g<50?'<div class="loan-cta"><button id="borrow-btn" class="btn-spin">🏦 Emprunter à la banque</button></div>':"";const e=Math.round((1-A.remaining/(A.principal*(1+A.rate/100)))*100);return`<div class="loan-cta"><span class="loan-status">🏦 Dette: ${A.remaining} pts (${e}% remboursé${A.installment>0?` · -${A.installment}/victoire`:" · en une fois"})</span></div>`}function ue(e){P();const o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`
    <div class="modal">
      <h3>⚔️ Défier ${p(e)}</h3>
      <label>Mise (tu as ${g} pts)</label>
      <div class="wager-quick">
        <button data-w="0">Amical</button>
        <button data-w="10">10</button>
        <button data-w="25">25</button>
        <button data-w="50">50</button>
      </div>
      <input id="wager-input" type="number" min="0" max="${g}" value="10" inputmode="numeric" />
      <div class="modal-btns">
        <button id="wager-cancel">Annuler</button>
        <button id="wager-ok" class="btn-primary">ENVOYER LE DÉFI</button>
      </div>
    </div>`,document.body.appendChild(o),o.onclick=s=>s.target===o&&o.remove(),o.querySelectorAll(".wager-quick button").forEach(s=>{s.onclick=()=>{document.getElementById("wager-input").value=s.dataset.w}}),document.getElementById("wager-cancel").onclick=()=>o.remove(),document.getElementById("wager-ok").onclick=()=>{const s=+document.getElementById("wager-input").value||0,n=Math.max(0,Math.min(g,s));y({type:"challenge",target:e,wager:n}),o.remove()}}function me(){if(A){v("Tu as déjà un prêt en cours !");return}P();const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`
    <div class="modal">
      <h3>🏦 Banque du Port</h3>
      <p style="color:var(--text-dim);font-size:14px">Solde actuel : ${g} pts</p>
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
    </div>`,document.body.appendChild(e),e.onclick=o=>o.target===e&&e.remove(),e.querySelectorAll(".wager-quick button").forEach(o=>{o.onclick=()=>{document.getElementById("loan-amount").value=o.dataset.m}}),document.getElementById("loan-cancel").onclick=()=>e.remove(),document.getElementById("loan-ok").onclick=()=>{const o=+document.getElementById("loan-amount").value||100;let s=+document.getElementById("loan-rate").value||10;const n=+document.getElementById("loan-installment").value||0;n>0&&(s+=10),y({type:"borrow",amount:o,rate:s,installment:n}),e.remove()}}function fe(e,o){P();const s=document.createElement("div");s.className="modal-overlay",s.innerHTML=`
    <div class="modal modal-challenge">
      <div class="challenge-icon">⚔️</div>
      <h3>DÉFI REÇU !</h3>
      <p><strong>${p(e)}</strong> te défie en duel</p>
      <p class="wager-display">Mise : <strong>${o} pts</strong></p>
      <div class="modal-btns">
        <button id="ch-decline">Refuser</button>
        <button id="ch-accept" class="btn-primary btn-glow">ACCEPTER</button>
      </div>
    </div>`,document.body.appendChild(s),document.getElementById("ch-decline").onclick=()=>{y({type:"decline_challenge",challenger:e}),s.remove()},document.getElementById("ch-accept").onclick=()=>{y({type:"accept_challenge",challenger:e}),s.remove()}}function P(){document.querySelectorAll(".modal-overlay").forEach(e=>e.remove())}function be(){const e=w.length,o=e===M.length;if(O.innerHTML=`
    <div class="place-screen">
      <header class="battle-header">
        <span class="vs-text">${p(x)} <span class="vs">VS</span> ${p(h)}</span>
        <span class="wager-badge">💰 ${K} pts</span>
      </header>
      <h2 class="phase-title">${z?"⏳ En attente de "+p(h)+"...":"⚓ Déploie ta flotte"}</h2>
      ${z?'<div class="waiting-spinner"></div>':`
      <div class="place-progress">${M.map((a,t)=>`<span class="prog-dot ${t<e?"done":t===e?"current":""}">${a}</span>`).join("")}</div>
      <div id="place-grid" class="grid place-grid"></div>
      <div class="place-actions">
        <button id="rotate-btn" class="btn-action">↻ ${L?"Horizontal":"Vertical"}</button>
        <button id="random-btn" class="btn-action">🎲 Aléatoire</button>
        ${e>0&&!o?'<button id="reset-btn" class="btn-action">🗑️ Effacer</button>':""}
        ${o?'<button id="confirm-btn" class="btn-primary btn-glow">✓ PRÊT AU COMBAT</button>':""}
      </div>
      ${o?"":`<p class="help-text">Touche la grille pour placer le bateau de ${M[e]} cases</p>`}
      `}
    </div>`,z)return;ve(),document.getElementById("rotate-btn").onclick=()=>{L=!L,b()},document.getElementById("random-btn").onclick=()=>{ye(),b()};const s=document.getElementById("reset-btn");s&&(s.onclick=()=>{w=[],q=S(),b()});const n=document.getElementById("confirm-btn");n&&(n.onclick=()=>{y({type:"place_ships",ships:w}),T.play("fire")})}function he(){const e=new Set;return w.forEach((o,s)=>{for(let n=0;n<M[s];n++){const a=o.horiz?o.row:o.row+n,t=o.horiz?o.col+n:o.col;e.add(`${a},${t}`)}}),e}function W(e,o,s,n){const a=he();for(let t=0;t<s;t++){const l=n?e:e+t,r=n?o+t:o;if(l<0||l>=f||r<0||r>=f||a.has(`${l},${r}`))return!1}return!0}function ae(){q=S(),w.forEach((e,o)=>{for(let s=0;s<M[o];s++){const n=e.horiz?e.row:e.row+s,a=e.horiz?e.col+s:e.col;q[n][a]=1}})}function ye(){w=[];for(const e of M)for(let o=0;o<500;o++){const s=Math.random()>.5,n=Math.floor(Math.random()*f),a=Math.floor(Math.random()*f);if(W(n,a,e,s)){w.push({row:n,col:a,horiz:s});break}}ae()}function ve(){const e=document.getElementById("place-grid");if(!e)return;ae();const o=w.length<M.length?M[w.length]:0;e.innerHTML="";const s=()=>e.querySelectorAll(".preview, .preview-bad").forEach(a=>a.classList.remove("preview","preview-bad")),n=(a,t)=>{if(s(),!o)return;const l=W(a,t,o,L);for(let r=0;r<o;r++){const i=L?a:a+r,c=L?t+r:t;i>=0&&i<f&&c>=0&&c<f&&e.children[i*f+c]?.classList.add(l?"preview":"preview-bad")}};for(let a=0;a<f;a++)for(let t=0;t<f;t++){const l=document.createElement("div");l.className="gcell",q[a][t]===1&&(l.classList.add("ship"),l.classList.add("removable")),l.addEventListener("pointerenter",()=>n(a,t)),l.addEventListener("click",()=>{if(q[a][t]===1){const r=w.findIndex((i,c)=>{for(let d=0;d<M[c];d++){const u=i.horiz?i.row:i.row+d,se=i.horiz?i.col+d:i.col;if(u===a&&se===t)return!0}return!1});r>=0&&(w.splice(r,1),T.play("miss"),b());return}o&&W(a,t,o,L)&&(w.push({row:a,col:t,horiz:L}),T.play("miss"),b())}),e.appendChild(l)}e.addEventListener("pointerleave",s)}function _(){O.innerHTML=`
    <div class="battle-screen">
      <header class="battle-header">
        <span class="vs-text">${p(x)} <span class="vs">VS</span> ${p(h)}</span>
        <span class="wager-badge">💰 ${K} pts</span>
        <span class="points-badge">Solde : ${g} pts</span>
      </header>
      <div id="turn-indicator" class="turn-indicator ${E?"my-turn":""}">
        ${E?k?"💣 CHOISIS LE CENTRE DE LA ZONE 3×3":"🎯 À TOI DE TIRER !":"⏳ "+p(h)+" vise..."}
      </div>
      <div class="battle-grids">
        <div class="battle-section enemy-section">
          <h3>🎯 Flotte de ${p(h)}</h3>
          <div id="enemy-grid" class="grid enemy-grid ${k?"zone-mode":""}"></div>
        </div>
        <div class="battle-section own-section">
          <h3>🛡️ Ta flotte</h3>
          <div id="own-grid" class="grid own-grid small"></div>
        </div>
      </div>
      <div class="power-bar">
        <button id="spin-btn" class="btn-spin" ${g<10||C?"disabled":""}>
          🎰 Roulette <span class="spin-cost">-10 pts</span>
        </button>
        ${C&&E?`<button id="zone-btn" class="btn-zone ${k?"active":""}">💣 ZONE 3×3 ${k?"— annuler":""}</button>`:""}
        ${C&&!E?'<span class="zone-pending">💣 Zone 3×3 prête pour ton tour</span>':""}
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
    </div>`,J(),document.getElementById("forfeit-btn").onclick=()=>{confirm("Abandonner ? Tu perds la mise !")&&(y({type:"leave_game"}),m="lobby",b())};const e=document.getElementById("spin-btn");e&&(e.onclick=()=>{T.play("spin"),y({type:"spin"})});const o=document.getElementById("zone-btn");o&&(o.onclick=()=>{k=!k,_()}),R(),oe()}function ge(){const e=document.getElementById("turn-indicator");e&&(e.className=`turn-indicator ${E?"my-turn":""}`,e.innerHTML=E?"🎯 À TOI DE TIRER !":"⏳ "+p(h)+" vise...")}function J(){const e=document.getElementById("enemy-grid");if(e){e.innerHTML="";const s=()=>e.querySelectorAll(".zone-target").forEach(a=>a.classList.remove("zone-target")),n=(a,t)=>{s();for(let l=-1;l<=1;l++)for(let r=-1;r<=1;r++){const i=a+l,c=t+r;i>=0&&i<f&&c>=0&&c<f&&e.children[i*f+c]?.classList.add("zone-target")}};for(let a=0;a<f;a++)for(let t=0;t<f;t++){const l=document.createElement("div");l.className="gcell water";const r=H[a][t];r===2&&(l.classList.add("miss"),l.textContent="•"),r===3&&(l.classList.add("hit"),l.textContent="✕"),E&&k?(l.classList.add("clickable"),l.addEventListener("pointerenter",()=>n(a,t)),l.onclick=()=>{!E||!C||(T.play("fire"),y({type:"fire_zone",x:t,y:a}),k=!1)}):r===0&&E&&(l.classList.add("clickable"),l.onclick=()=>{E&&(T.play("fire"),y({type:"fire",x:t,y:a}))}),e.appendChild(l)}k&&e.addEventListener("pointerleave",s)}const o=document.getElementById("own-grid");if(o){o.innerHTML="";for(let s=0;s<f;s++)for(let n=0;n<f;n++){const a=document.createElement("div");a.className="gcell water";const t=q[s][n];t===1&&a.classList.add("ship"),t===2&&(a.classList.add("miss"),a.textContent="•"),t===3&&(a.classList.add("hit","ship-hit"),a.textContent="✕"),o.appendChild(a)}}}function Te(e,o,s){P();const n=document.createElement("div");n.className="modal-overlay",n.innerHTML=`
    <div class="modal spin-modal">
      <h3>🎰 ROULETTE DU DESTIN</h3>
      <p class="spin-sub">${o?"Tu as lancé la roulette...":p(h)+" a lancé la roulette..."}</p>
      <div class="wheel-wrap">
        <div class="wheel-arrow">▼</div>
        <div id="spin-wheel" class="wheel">
          <div class="wheel-half wheel-me">TOI</div>
          <div class="wheel-half wheel-opp">${p(h).slice(0,8).toUpperCase()}</div>
        </div>
      </div>
      <p id="spin-verdict" class="spin-verdict"></p>
    </div>`,document.body.appendChild(n),T.play("spin");const a=document.getElementById("spin-wheel"),t=e?90:270,l=Math.random()*100-50,r=5*360+(360-t)+l*.6;requestAnimationFrame(()=>{a.style.transition="transform 2.4s cubic-bezier(0.15, 0.9, 0.25, 1)",a.style.transform=`rotate(${r}deg)`}),setTimeout(()=>{const i=document.getElementById("spin-verdict");i&&(i.textContent=e?"💣 TU GAGNES L'ATTAQUE DE ZONE !":`😈 ${h} gagne l'attaque de zone !`,i.className=`spin-verdict show ${e?"good":"bad"}`),T.play(e?"win":"lose")},2500),setTimeout(()=>{n.remove(),s()},4200)}function Y(e,o,s,n){const a=document.getElementById(e);if(!a)return;const t=a.children[s*f+o];t&&(t.classList.add(n?"explode":"splash"),setTimeout(()=>t.classList.remove("explode","splash"),700))}function Ee(){O.innerHTML=`
    <div class="gameover-screen ${I?"win":"lose"}">
      <div class="go-icon">${I?"🏆":"💀"}</div>
      <h1>${I?"VICTOIRE !":"DÉFAITE"}</h1>
      <p class="go-detail">
        ${Z?p(h)+" a abandonné !":I?"Tu as coulé toute la flotte de "+p(h)+" !":p(h)+" a coulé toute ta flotte..."}
      </p>
      ${F>0?`<p class="go-points ${I?"gain":"loss"}">${I?"+":"-"}${F} points</p>`:""}
      <p class="go-balance">Solde : <strong>${g} pts</strong></p>
      <div class="gameover-btns">
        ${Z?"":'<button id="rematch-btn" class="btn-primary btn-glow">🔄 REVANCHE</button>'}
        <button id="lobby-btn" class="btn-action">⚓ Retour au port</button>
      </div>
    </div>`;const e=document.getElementById("rematch-btn");e&&(e.onclick=()=>{y({type:"rematch"}),v("Revanche proposée, en attente..."),e.setAttribute("disabled","true"),e.textContent="⏳ En attente..."}),document.getElementById("lobby-btn").onclick=()=>{y({type:"leave_game"}),m="lobby",b()}}function R(){const e=document.getElementById("join-chat-msgs");e&&(e.innerHTML=$.filter(a=>a.scope==="lobby").slice(-15).map(a=>X(a)).join("")||'<p class="empty-msg">Silence radio pour le moment...</p>',e.scrollTop=e.scrollHeight);const o=document.getElementById("chat-messages");if(!o)return;const s=m==="battle"||m==="placement"?"game":"lobby",n=$.filter(a=>a.scope===s);o.innerHTML=n.map((a,t)=>X(a,t)).join(""),o.scrollTop=o.scrollHeight,o.querySelectorAll(".chat-reply-btn").forEach(a=>{a.addEventListener("click",t=>{t.stopPropagation();const l=a.closest(".chat-msg"),r=parseInt(l?.dataset.i||"0"),i=n[r];i&&(B={id:i.id||"",from:i.from,text:i.text}),j()})}),o.querySelectorAll(".chat-mention").forEach(a=>{a.addEventListener("click",()=>{const t=a.getAttribute("data-name")||"";for(let l=n.length-1;l>=0;l--)if(n[l].from===t){const r=o.children[l];r&&(r.scrollIntoView({behavior:"smooth",block:"center"}),r.classList.add("msg-flash"),setTimeout(()=>r.classList.remove("msg-flash"),1800));return}v(`${t} n'a pas de message récent ici`)})})}function X(e,o){const s=e.from===x,n=e.replyTo?`<div class="reply-quote"><span class="reply-quote-bar"></span><span class="reply-quote-text">${p(e.replySnip||"")}</span></div>`:"",a=we(e.text),t=o!==void 0?` data-i="${o}"`:"";return`<div class="chat-msg ${s?"mine":""}"${t}>
    ${n}
    <span class="chat-from">${p(e.from)}</span>
    <span class="chat-text">${a}</span>
    <button class="chat-reply-btn" title="Répondre">↩</button>
  </div>`}function we(e){return e.replace(/(^| )@([a-zA-Z0-9_-]+)/g,(o,s,n)=>`${s}<span class="chat-mention" data-name="${Q(n)}">@${p(n)}</span>`)}function j(){if(document.getElementById("reply-bar")?.remove(),!B)return;const e=document.querySelector(".chat-input")?.parentElement;if(!e)return;const o=document.createElement("div");o.id="reply-bar",o.className="reply-bar",o.innerHTML=`
    <div class="reply-bar-top"></div>
    <span class="reply-bar-label">Répondre à <strong>${p(B.from)}</strong></span>
    <span class="reply-bar-snip">${p(B.text.slice(0,50))}${B.text.length>50?"…":""}</span>
    <button class="reply-bar-cancel">✕</button>
  `,e.insertBefore(o,e.firstChild),o.querySelector(".reply-bar-cancel").addEventListener("click",()=>{B=null,j()})}function oe(){const e=document.getElementById("chat-inp"),o=document.getElementById("chat-send-btn");if(!e||!o)return;const s=()=>{const n=e.value.trim();if(!n)return;const a={type:"chat",text:n};B&&(a.replyTo=B.id,B=null,j()),y(a),e.value=""};o.onclick=s,e.onkeydown=n=>{n.key==="Enter"&&s()},j()}let ee;function v(e){document.querySelectorAll(".toast").forEach(s=>s.remove()),clearTimeout(ee);const o=document.createElement("div");o.className="toast",o.textContent=e,document.body.appendChild(o),ee=setTimeout(()=>o.remove(),2800)}function p(e){const o=document.createElement("div");return o.textContent=e,o.innerHTML}function Q(e){return e.replace(/"/g,"&quot;").replace(/</g,"&lt;")}window.addEventListener("error",e=>{y({type:"client_log",level:"error",message:`${e.message} @ ${e.filename}:${e.lineno}`})});window.addEventListener("unhandledrejection",e=>{y({type:"client_log",level:"error",message:`unhandled rejection: ${e.reason}`})});ne();b();
