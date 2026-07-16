(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const t of a)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function s(a){const t={};return a.integrity&&(t.integrity=a.integrity),a.referrerPolicy&&(t.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?t.credentials="include":a.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(a){if(a.ep)return;a.ep=!0;const t=s(a);fetch(a.href,t)}})();class de{ctx=null;getCtx(){return this.ctx||(this.ctx=new AudioContext),this.ctx}play(n){try{const s=this.getCtx(),o=s.createOscillator(),a=s.createGain();o.connect(a),a.connect(s.destination);const t=s.currentTime;switch(n){case"tick":{o.type="square",o.frequency.setValueAtTime(1200,t),a.gain.setValueAtTime(.05,t),a.gain.exponentialRampToValueAtTime(.001,t+.04),o.start(t),o.stop(t+.04);break}case"spin":{for(let l=0;l<20;l++){const c=t+Math.pow(l/20,1.6)*2.2,d=s.createOscillator(),m=s.createGain();d.connect(m),m.connect(s.destination),d.type="square",d.frequency.setValueAtTime(1e3+Math.random()*300,c),m.gain.setValueAtTime(.05,c),m.gain.exponentialRampToValueAtTime(.001,c+.04),d.start(c),d.stop(c+.05)}break}case"zone":{for(let l=0;l<5;l++){const c=t+l*.12,d=s.createOscillator(),m=s.createGain();d.connect(m),m.connect(s.destination),d.type="sawtooth",d.frequency.setValueAtTime(160-l*15,c),d.frequency.exponentialRampToValueAtTime(40,c+.35),m.gain.setValueAtTime(.18,c),m.gain.exponentialRampToValueAtTime(.001,c+.4),d.start(c),d.stop(c+.4)}break}case"fire":o.type="sawtooth",o.frequency.setValueAtTime(150,t),o.frequency.exponentialRampToValueAtTime(60,t+.15),a.gain.setValueAtTime(.15,t),a.gain.exponentialRampToValueAtTime(.001,t+.2),o.start(t),o.stop(t+.2);break;case"hit":o.type="square",o.frequency.setValueAtTime(200,t),o.frequency.exponentialRampToValueAtTime(80,t+.4),a.gain.setValueAtTime(.2,t),a.gain.exponentialRampToValueAtTime(.001,t+.5),o.start(t),o.stop(t+.5);const i=s.createOscillator(),r=s.createGain();i.connect(r),r.connect(s.destination),i.type="triangle",i.frequency.setValueAtTime(400,t),i.frequency.exponentialRampToValueAtTime(100,t+.3),r.gain.setValueAtTime(.1,t),r.gain.exponentialRampToValueAtTime(.001,t+.35),i.start(t),i.stop(t+.35);break;case"sunk":for(let l=0;l<3;l++){const c=s.createOscillator(),d=s.createGain();c.connect(d),d.connect(s.destination),c.type="sawtooth",c.frequency.setValueAtTime(100-l*30,t+l*.15),c.frequency.exponentialRampToValueAtTime(30,t+l*.15+.5),d.gain.setValueAtTime(.2,t+l*.15),d.gain.exponentialRampToValueAtTime(.001,t+l*.15+.6),c.start(t+l*.15),c.stop(t+l*.15+.6)}break;case"miss":o.type="sine",o.frequency.setValueAtTime(600,t),o.frequency.exponentialRampToValueAtTime(300,t+.15),a.gain.setValueAtTime(.05,t),a.gain.exponentialRampToValueAtTime(.001,t+.2),o.start(t),o.stop(t+.2);break;case"win":[523,659,784,1047].forEach((l,c)=>{const d=s.createOscillator(),m=s.createGain();d.connect(m),m.connect(s.destination),d.type="triangle",d.frequency.setValueAtTime(l,t+c*.15),m.gain.setValueAtTime(.15,t+c*.15),m.gain.exponentialRampToValueAtTime(.001,t+c*.15+.4),d.start(t+c*.15),d.stop(t+c*.15+.4)});break;case"lose":[400,300,250,200].forEach((l,c)=>{const d=s.createOscillator(),m=s.createGain();d.connect(m),m.connect(s.destination),d.type="sawtooth",d.frequency.setValueAtTime(l,t+c*.2),m.gain.setValueAtTime(.12,t+c*.2),m.gain.exponentialRampToValueAtTime(.001,t+c*.2+.5),d.start(t+c*.2),d.stop(t+c*.2+.5)});break}}catch{}}}const T=new de;function pe(e){const n=["#00f0ff","#ff0055","#ffe600","#00ff88","#ff6600","#cc00ff"];for(let s=0;s<60;s++){const o=document.createElement("div");o.style.cssText=`
      position:fixed;width:8px;height:8px;border-radius:50%;
      background:${n[s%n.length]};pointer-events:none;z-index:9999;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation: confettiFall ${1+Math.random()*2}s ease-out forwards;
      animation-delay:${Math.random()*.5}s;
      opacity:1;
    `,e.appendChild(o),setTimeout(()=>o.remove(),3e3)}}const f=10,q=[5,4,3,3,2];let u="join",k="",g=0,D=0,U=0,H=0,y="",ee=0,E=!1,R=!1,F=[],se=[],$=[],B=!0,z=A(),S=A(),I=!1,Z=0,W=!1,C=!1,w=!1,L=[],M=null,x=null,V;function A(){return Array.from({length:f},()=>Array(f).fill(0))}function ie(){const e=location.protocol==="https:"?"wss":"ws";V=new WebSocket(`${e}://${location.host}/ws`),V.onopen=()=>{k&&u!=="join"&&v({type:"join",name:k})},V.onmessage=n=>{try{ue(JSON.parse(n.data))}catch{}},V.onclose=()=>{setTimeout(ie,2e3)}}function v(e){V&&V.readyState===WebSocket.OPEN&&V.send(JSON.stringify(e))}function ue(e){switch(e.type){case"joined":k=e.name,g=e.points,D=e.wins,U=e.losses,sessionStorage.setItem("bs_name",k),u="lobby",h();break;case"lobby_update":F=e.players||[],se=e.leaderboard||[],e.me&&(g=e.me.points,D=e.me.wins,U=e.me.losses),u==="lobby"&&h();break;case"challenge_sent":b(`Défi envoyé à ${e.target} — mise ${e.wager} pts ⏳`);break;case"challenge_received":ge(e.challenger,e.wager);break;case"challenge_declined":b(`${e.target} a refusé ton défi 😤`);break;case"game_start":y=e.opponent,ee=e.wager,H=e.playerIdx??0,$=[],B=!0,E=!1,R=!1,C=!1,w=!1,z=A(),S=A(),L=L.filter(o=>o.scope!=="game"),u="placement",h();break;case"ships_accepted":R=!0,u==="placement"&&h();break;case"opponent_ready":b(`${y} est prêt ! ⚓`);break;case"battle_start":E=!!e.yourTurn,u="battle",h();break;case"fire_result":{const{x:o,y:a,result:t,ship:i,shooter:r}=e,l=t==="hit"||t==="sunk";r===H?(z[a][o]=l?3:2,T.play(t==="sunk"?"sunk":l?"hit":"miss"),t==="sunk"?b(`💥 ${i} ennemi coulé !`):l&&b("🎯 Touché !")):(S[a][o]=l?3:2,T.play(l?"hit":"miss"),t==="sunk"&&b(`☠️ Ton ${i} a été coulé...`)),E=!!e.yourTurn,u==="battle"&&!e.gameOver&&(ke(),K(),G(r===H?"enemy-grid":"own-grid",o,a,l));break}case"loan_approved":typeof e.newPoints=="number"&&(g=e.newPoints),x={principal:e.amount,remaining:e.amount+e.amount*e.rate/100,rate:e.rate,installment:e.installment||0,repaid:0},b(`🏦 Prêt de ${e.amount} pts accordé ! Taux: ${e.rate}%. Nouveau solde: ${g} pts`),u==="lobby"&&h();break;case"loan_status":x={principal:e.principal,remaining:e.remaining,rate:e.rate,installment:e.installment||0,repaid:e.repaid},u==="lobby"&&h();break;case"game_over":I=!!e.won,Z=e.pointsEarned||0,W=e.reason==="forfeit",typeof e.newPoints=="number"&&(g=e.newPoints),u="gameover",T.play(I?"win":"lose"),h(),I&&setTimeout(()=>pe(document.body),200);break;case"rematch_requested":b(`${y} veut une revanche ! 🔄`);break;case"opponent_left":b(`${y} a quitté`),u==="gameover"&&h();break;case"spin_result":typeof e.spinnerPoints=="number"&&e.youSpun&&(g=e.spinnerPoints),xe(!!e.youBenefit,!!e.youSpun,()=>{e.youBenefit?(C=!0,b("💣 Attaque de zone 3×3 débloquée !")):b(`😱 ${y} a gagné l'attaque de zone !`),u==="battle"&&O()});break;case"zone_result":{const o=e.shooter===H;T.play("zone");let a=[];(e.cells||[]).forEach((t,i)=>{const{x:r,y:l,result:c}=t;if(c==="skip")return;const d=c==="hit"||c==="sunk";c==="sunk"&&t.ship&&a.push(t.ship),setTimeout(()=>{o?z[l][r]=d?3:2:S[l][r]=d?3:2,u==="battle"&&(K(),G(o?"enemy-grid":"own-grid",r,l,d))},i*110)}),o&&(C=!1,w=!1),E=!!e.yourTurn,setTimeout(()=>{a.length&&(b(o?`💥 Coulé : ${a.join(", ")} !`:`☠️ Coulé : ${a.join(", ")}...`),T.play("sunk")),u==="battle"&&!e.gameOver&&O()},1100);break}case"chat_history":case"live_matches":Q=e.matches||[],u==="lobby"&&be();break;case"spectate_start":e.p1,e.p2,Y=e.board1||A(),X=e.board2||A(),e.events,e.turnName,u="spectate",h();break;case"spectate_fire":{const{x:o,y:a,result:t,shooter:i}=e,r=t==="hit"||t==="sunk",l=i===0?X:Y;l[a][o]=r?3:2,e.turnName,u==="spectate"&&(Ie(),setTimeout(()=>G("spec-grid-"+(i===0?2:1),o,a,r),100));break}case"spectate_end":u="lobby",h();break;case"bets_resolved":b(`⚡ Paris résolus : ${e.kind}`);break;case"chat":L.push({id:e.id,from:e.from,text:e.text,scope:e.scope||"lobby",replyTo:e.replyTo||void 0,replySnip:e.replySnip||void 0}),L.length>150&&L.shift(),_();break;case"mention":T.play("hit");const n=e.text.slice(0,60)+(e.text.length>60?"…":""),s=document.createElement("div");s.className="toast toast-mention",s.innerHTML=`🔔 <strong>${p(e.from)}</strong> t'a mentionné<br/><em>${p(n)}</em>`,s.onclick=()=>{if(u==="battle"||u==="placement")return;const o=document.getElementById("chat-messages");o&&(o.scrollTop=o.scrollHeight)},document.body.appendChild(s),setTimeout(()=>s.remove(),3500),L.length<150&&L.push({from:e.from,text:e.text,scope:"lobby"}),_();break;case"bet_placed":b(`🎲 Pari placé : ${e.kind} → mise ${e.amount} pts, cote ${e.odds}x`);break;case"bet_won":b(`💰 Pari gagné ! +${e.amount} pts (${e.kind})`);break;case"error":b(`⚠️ ${e.message}`);break}}const N=document.getElementById("app");function h(){switch(u){case"join":me();break;case"lobby":fe();break;case"placement":Te();break;case"battle":O();break;case"gameover":Ae();break}}function me(){const e=sessionStorage.getItem("bs_name")||"";N.innerHTML=`
    <div class="join-screen">
      <div class="ocean-waves"></div>
      <div class="join-content">
        <div class="logo-anchor">⚓</div>
        <h1 class="game-title">BATAILLE<br/>NAVALE</h1>
        <p class="tagline">Duels · Mises · Gloire</p>
        <div class="join-form">
          <input id="name-input" type="text" placeholder="Ton pseudo, capitaine" maxlength="20" value="${te(e)}" autocomplete="off" />
          <button id="join-btn" class="btn-primary btn-glow">⚔️ ENTRER AU COMBAT</button>
        </div>
        <p class="hint">100 points offerts aux nouveaux capitaines</p>
        <div class="join-chat panel">
          <h3>💬 Ça discute au port...</h3>
          <div id="join-chat-msgs" class="chat-msgs join-chat-msgs"></div>
        </div>
      </div>
    </div>`;const n=document.getElementById("name-input"),s=()=>{const o=n.value.trim();o&&(k=o,v({type:"join",name:o}))};document.getElementById("join-btn").onclick=s,n.onkeydown=o=>{o.key==="Enter"&&s()},n.focus(),_()}function fe(){N.innerHTML=`
    <div class="lobby-screen">
      <header class="lobby-header">
        <div class="header-left">
          <span class="header-logo">⚓</span>
          <span class="header-title">BATAILLE NAVALE</span>
        </div>
        <div class="my-badge">
          <span class="badge-name">${p(k)}</span>
          <span class="badge-points">💰 ${g} pts</span>
          <span class="badge-record">${D}V / ${U}D</span>
        </div>
        ${he()}
      </header>
      <div class="lobby-body">
        <section class="panel players-panel">
          <h2>🌊 Capitaines en ligne <span class="count">${F.length}</span></h2>
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
    </div>`;const e=document.getElementById("lb-list"),n=["🥇","🥈","🥉"];e.innerHTML=se.map((t,i)=>`
    <li class="${t.name===k?"me":""}">
      <span class="lb-rank">${n[i]||i+1}</span>
      <span class="lb-name">${p(t.name)}</span>
      <span class="lb-pts">${t.points}</span>
    </li>`).join("");const s=document.getElementById("player-list"),o=F.filter(t=>t.name!==k);s.innerHTML=o.length?o.map(t=>`
    <div class="player-row ${t.inGame?"ingame":""}">
      <div class="p-avatar">${t.name[0].toUpperCase()}</div>
      <div class="p-info">
        <span class="p-name">${p(t.name)}</span>
        <span class="p-stats">${t.points} pts · ${t.wins}V/${t.losses}D</span>
      </div>
      ${t.inGame?'<span class="p-status">⚔️ En duel</span>':`<button class="btn-challenge" data-target="${te(t.name)}">DÉFIER</button>`}
    </div>`).join(""):`<p class="empty-msg">Personne d'autre en ligne...<br/>Partage l'adresse à tes amis !</p>`,s.querySelectorAll(".btn-challenge").forEach(t=>{t.addEventListener("click",()=>ve(t.dataset.target))}),_(),ce();const a=document.getElementById("borrow-btn");a&&(a.onclick=ye),v({type:"loan_status"}),v({type:"live_matches"})}function be(){const e=document.getElementById("live-matches");if(e){if(Q.length===0){e.innerHTML='<p class="empty-msg">Pas de match en cours</p>';return}e.innerHTML=Q.map(n=>`
    <div class="live-match">
      <div class="lm-players">
        <span>${p(n.p1)} (${n.p1Ships}⚓)</span>
        <span class="vs">VS</span>
        <span>${p(n.p2)} (${n.p2Ships}⚓)</span>
      </div>
      <div class="lm-info">
        <span>${n.phase?"📐 Placement":"🎯 Tour: "+p(n.turnName)}</span>
        <span>💰 ${n.wager} pts</span>
        <span>👁 ${n.spectators}</span>
      </div>
      <button class="btn-challenge" data-game="${n.id}">REGARDER</button>
    </div>
  `).join(""),e.querySelectorAll(".btn-challenge").forEach(n=>{n.addEventListener("click",()=>v({type:"spectate",gameId:n.dataset.game}))})}}function he(){if(!x)return g<50?'<div class="loan-cta"><button id="borrow-btn" class="btn-spin">🏦 Emprunter à la banque</button></div>':"";const e=Math.round((1-x.remaining/(x.principal*(1+x.rate/100)))*100);return`<div class="loan-cta"><span class="loan-status">🏦 Dette: ${x.remaining} pts (${e}% remboursé${x.installment>0?` · -${x.installment}/victoire`:" · en une fois"})</span></div>`}function ve(e){j();const n=document.createElement("div");n.className="modal-overlay",n.innerHTML=`
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
    </div>`,document.body.appendChild(n),n.onclick=s=>s.target===n&&n.remove(),n.querySelectorAll(".wager-quick button").forEach(s=>{s.onclick=()=>{document.getElementById("wager-input").value=s.dataset.w}}),document.getElementById("wager-cancel").onclick=()=>n.remove(),document.getElementById("wager-ok").onclick=()=>{const s=+document.getElementById("wager-input").value||0,o=Math.max(0,Math.min(g,s));v({type:"challenge",target:e,wager:o}),n.remove()}}function ye(){if(x){b("Tu as déjà un prêt en cours !");return}j();const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`
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
    </div>`,document.body.appendChild(e),e.onclick=n=>n.target===e&&e.remove(),e.querySelectorAll(".wager-quick button").forEach(n=>{n.onclick=()=>{document.getElementById("loan-amount").value=n.dataset.m}}),document.getElementById("loan-cancel").onclick=()=>e.remove(),document.getElementById("loan-ok").onclick=()=>{const n=+document.getElementById("loan-amount").value||100;let s=+document.getElementById("loan-rate").value||10;const o=+document.getElementById("loan-installment").value||0;o>0&&(s+=10),v({type:"borrow",amount:n,rate:s,installment:o}),e.remove()}}function ge(e,n){j();const s=document.createElement("div");s.className="modal-overlay",s.innerHTML=`
    <div class="modal modal-challenge">
      <div class="challenge-icon">⚔️</div>
      <h3>DÉFI REÇU !</h3>
      <p><strong>${p(e)}</strong> te défie en duel</p>
      <p class="wager-display">Mise : <strong>${n} pts</strong></p>
      <div class="modal-btns">
        <button id="ch-decline">Refuser</button>
        <button id="ch-accept" class="btn-primary btn-glow">ACCEPTER</button>
      </div>
    </div>`,document.body.appendChild(s),document.getElementById("ch-decline").onclick=()=>{v({type:"decline_challenge",challenger:e}),s.remove()},document.getElementById("ch-accept").onclick=()=>{v({type:"accept_challenge",challenger:e}),s.remove()}}function j(){document.querySelectorAll(".modal-overlay").forEach(e=>e.remove())}function Te(){const e=$.length,n=e===q.length;if(N.innerHTML=`
    <div class="place-screen">
      <header class="battle-header">
        <span class="vs-text">${p(k)} <span class="vs">VS</span> ${p(y)}</span>
        <span class="wager-badge">💰 ${ee} pts</span>
      </header>
      <h2 class="phase-title">${R?"⏳ En attente de "+p(y)+"...":"⚓ Déploie ta flotte"}</h2>
      ${R?'<div class="waiting-spinner"></div>':`
      <div class="place-progress">${q.map((a,t)=>`<span class="prog-dot ${t<e?"done":t===e?"current":""}">${a}</span>`).join("")}</div>
      <div id="place-grid" class="grid place-grid"></div>
      <div class="place-actions">
        <button id="rotate-btn" class="btn-action">↻ ${B?"Horizontal":"Vertical"}</button>
        <button id="random-btn" class="btn-action">🎲 Aléatoire</button>
        ${e>0&&!n?'<button id="reset-btn" class="btn-action">🗑️ Effacer</button>':""}
        ${n?'<button id="confirm-btn" class="btn-primary btn-glow">✓ PRÊT AU COMBAT</button>':""}
      </div>
      ${n?"":`<p class="help-text">Touche la grille pour placer le bateau de ${q[e]} cases</p>`}
      `}
    </div>`,R)return;we(),document.getElementById("rotate-btn").onclick=()=>{B=!B,h()},document.getElementById("random-btn").onclick=()=>{$e(),h()};const s=document.getElementById("reset-btn");s&&(s.onclick=()=>{$=[],S=A(),h()});const o=document.getElementById("confirm-btn");o&&(o.onclick=()=>{v({type:"place_ships",ships:$}),T.play("fire")})}function Ee(){const e=new Set;return $.forEach((n,s)=>{for(let o=0;o<q[s];o++){const a=n.horiz?n.row:n.row+o,t=n.horiz?n.col+o:n.col;e.add(`${a},${t}`)}}),e}function J(e,n,s,o){const a=Ee();for(let t=0;t<s;t++){const i=o?e:e+t,r=o?n+t:n;if(i<0||i>=f||r<0||r>=f||a.has(`${i},${r}`))return!1}return!0}function le(){S=A(),$.forEach((e,n)=>{for(let s=0;s<q[n];s++){const o=e.horiz?e.row:e.row+s,a=e.horiz?e.col+s:e.col;S[o][a]=1}})}function $e(){$=[];for(const e of q)for(let n=0;n<500;n++){const s=Math.random()>.5,o=Math.floor(Math.random()*f),a=Math.floor(Math.random()*f);if(J(o,a,e,s)){$.push({row:o,col:a,horiz:s});break}}le()}function we(){const e=document.getElementById("place-grid");if(!e)return;le();const n=$.length<q.length?q[$.length]:0;e.innerHTML="";const s=()=>e.querySelectorAll(".preview, .preview-bad").forEach(a=>a.classList.remove("preview","preview-bad")),o=(a,t)=>{if(s(),!n)return;const i=J(a,t,n,B);for(let r=0;r<n;r++){const l=B?a:a+r,c=B?t+r:t;l>=0&&l<f&&c>=0&&c<f&&e.children[l*f+c]?.classList.add(i?"preview":"preview-bad")}};for(let a=0;a<f;a++)for(let t=0;t<f;t++){const i=document.createElement("div");i.className="gcell",S[a][t]===1&&(i.classList.add("ship"),i.classList.add("removable")),i.addEventListener("pointerenter",()=>o(a,t)),i.addEventListener("click",()=>{if(S[a][t]===1){const r=$.findIndex((l,c)=>{for(let d=0;d<q[c];d++){const m=l.horiz?l.row:l.row+d,re=l.horiz?l.col+d:l.col;if(m===a&&re===t)return!0}return!1});r>=0&&($.splice(r,1),T.play("miss"),h());return}n&&J(a,t,n,B)&&($.push({row:a,col:t,horiz:B}),T.play("miss"),h())}),e.appendChild(i)}e.addEventListener("pointerleave",s)}function O(){N.innerHTML=`
    <div class="battle-screen">
      <header class="battle-header">
        <span class="vs-text">${p(k)} <span class="vs">VS</span> ${p(y)}</span>
        <span class="wager-badge">💰 ${ee} pts</span>
        <span class="points-badge">Solde : ${g} pts</span>
      </header>
      <div id="turn-indicator" class="turn-indicator ${E?"my-turn":""}">
        ${E?w?"💣 CHOISIS LE CENTRE DE LA ZONE 3×3":"🎯 À TOI DE TIRER !":"⏳ "+p(y)+" vise..."}
      </div>
      <div class="battle-grids">
        <div class="battle-section enemy-section">
          <h3>🎯 Flotte de ${p(y)}</h3>
          <div id="enemy-grid" class="grid enemy-grid ${w?"zone-mode":""}"></div>
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
        ${C&&E?`<button id="zone-btn" class="btn-zone ${w?"active":""}">💣 ZONE 3×3 ${w?"— annuler":""}</button>`:""}
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
    </div>`,K(),document.getElementById("forfeit-btn").onclick=()=>{confirm("Abandonner ? Tu perds la mise !")&&(v({type:"leave_game"}),u="lobby",h())};const e=document.getElementById("spin-btn");e&&(e.onclick=()=>{T.play("spin"),v({type:"spin"})});const n=document.getElementById("zone-btn");n&&(n.onclick=()=>{w=!w,O()}),_(),ce()}function ke(){const e=document.getElementById("turn-indicator");e&&(e.className=`turn-indicator ${E?"my-turn":""}`,e.innerHTML=E?"🎯 À TOI DE TIRER !":"⏳ "+p(y)+" vise...")}function K(){const e=document.getElementById("enemy-grid");if(e){e.innerHTML="";const s=()=>e.querySelectorAll(".zone-target").forEach(a=>a.classList.remove("zone-target")),o=(a,t)=>{s();for(let i=-1;i<=1;i++)for(let r=-1;r<=1;r++){const l=a+i,c=t+r;l>=0&&l<f&&c>=0&&c<f&&e.children[l*f+c]?.classList.add("zone-target")}};for(let a=0;a<f;a++)for(let t=0;t<f;t++){const i=document.createElement("div");i.className="gcell water";const r=z[a][t];r===2&&(i.classList.add("miss"),i.textContent="•"),r===3&&(i.classList.add("hit"),i.textContent="✕"),E&&w?(i.classList.add("clickable"),i.addEventListener("pointerenter",()=>o(a,t)),i.onclick=()=>{!E||!C||(T.play("fire"),v({type:"fire_zone",x:t,y:a}),w=!1)}):r===0&&E&&(i.classList.add("clickable"),i.onclick=()=>{E&&(T.play("fire"),v({type:"fire",x:t,y:a}))}),e.appendChild(i)}w&&e.addEventListener("pointerleave",s)}const n=document.getElementById("own-grid");if(n){n.innerHTML="";for(let s=0;s<f;s++)for(let o=0;o<f;o++){const a=document.createElement("div");a.className="gcell water";const t=S[s][o];t===1&&a.classList.add("ship"),t===2&&(a.classList.add("miss"),a.textContent="•"),t===3&&(a.classList.add("hit","ship-hit"),a.textContent="✕"),n.appendChild(a)}}}function xe(e,n,s){j();const o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`
    <div class="modal spin-modal">
      <h3>🎰 ROULETTE DU DESTIN</h3>
      <p class="spin-sub">${n?"Tu as lancé la roulette...":p(y)+" a lancé la roulette..."}</p>
      <div class="wheel-wrap">
        <div class="wheel-arrow">▼</div>
        <div id="spin-wheel" class="wheel">
          <div class="wheel-half wheel-me">TOI</div>
          <div class="wheel-half wheel-opp">${p(y).slice(0,8).toUpperCase()}</div>
        </div>
      </div>
      <p id="spin-verdict" class="spin-verdict"></p>
    </div>`,document.body.appendChild(o),T.play("spin");const a=document.getElementById("spin-wheel"),t=e?90:270,i=Math.random()*100-50,r=5*360+(360-t)+i*.6;requestAnimationFrame(()=>{a.style.transition="transform 2.4s cubic-bezier(0.15, 0.9, 0.25, 1)",a.style.transform=`rotate(${r}deg)`}),setTimeout(()=>{const l=document.getElementById("spin-verdict");l&&(l.textContent=e?"💣 TU GAGNES L'ATTAQUE DE ZONE !":`😈 ${y} gagne l'attaque de zone !`,l.className=`spin-verdict show ${e?"good":"bad"}`),T.play(e?"win":"lose")},2500),setTimeout(()=>{o.remove(),s()},4200)}function G(e,n,s,o){const a=document.getElementById(e);if(!a)return;const t=a.children[s*f+n];t&&(t.classList.add(o?"explode":"splash"),setTimeout(()=>t.classList.remove("explode","splash"),700))}function Ae(){N.innerHTML=`
    <div class="gameover-screen ${I?"win":"lose"}">
      <div class="go-icon">${I?"🏆":"💀"}</div>
      <h1>${I?"VICTOIRE !":"DÉFAITE"}</h1>
      <p class="go-detail">
        ${W?p(y)+" a abandonné !":I?"Tu as coulé toute la flotte de "+p(y)+" !":p(y)+" a coulé toute ta flotte..."}
      </p>
      ${Z>0?`<p class="go-points ${I?"gain":"loss"}">${I?"+":"-"}${Z} points</p>`:""}
      <p class="go-balance">Solde : <strong>${g} pts</strong></p>
      <div class="gameover-btns">
        ${W?"":'<button id="rematch-btn" class="btn-primary btn-glow">🔄 REVANCHE</button>'}
        <button id="lobby-btn" class="btn-action">⚓ Retour au port</button>
      </div>
    </div>`;const e=document.getElementById("rematch-btn");e&&(e.onclick=()=>{v({type:"rematch"}),b("Revanche proposée, en attente..."),e.setAttribute("disabled","true"),e.textContent="⏳ En attente..."}),document.getElementById("lobby-btn").onclick=()=>{v({type:"leave_game"}),u="lobby",h()}}function _(){const e=document.getElementById("join-chat-msgs");e&&(e.innerHTML=L.filter(a=>a.scope==="lobby").slice(-15).map(a=>ne(a)).join("")||'<p class="empty-msg">Silence radio pour le moment...</p>',e.scrollTop=e.scrollHeight);const n=document.getElementById("chat-messages");if(!n)return;const s=u==="battle"||u==="placement"?"game":"lobby",o=L.filter(a=>a.scope===s);n.innerHTML=o.map((a,t)=>ne(a,t)).join(""),n.scrollTop=n.scrollHeight,n.querySelectorAll(".chat-reply-btn").forEach(a=>{a.addEventListener("click",t=>{t.stopPropagation();const i=a.closest(".chat-msg"),r=parseInt(i?.dataset.i||"0"),l=o[r];l&&(M={id:l.id||"",from:l.from,text:l.text}),P()})}),n.querySelectorAll(".chat-mention").forEach(a=>{a.addEventListener("click",()=>{const t=a.getAttribute("data-name")||"";for(let i=o.length-1;i>=0;i--)if(o[i].from===t){const r=n.children[i];r&&(r.scrollIntoView({behavior:"smooth",block:"center"}),r.classList.add("msg-flash"),setTimeout(()=>r.classList.remove("msg-flash"),1800));return}b(`${t} n'a pas de message récent ici`)})})}function ne(e,n){const s=e.from===k,o=e.replyTo?`<div class="reply-quote"><span class="reply-quote-bar"></span><span class="reply-quote-text">${p(e.replySnip||"")}</span></div>`:"",a=Le(e.text),t=n!==void 0?` data-i="${n}"`:"";return`<div class="chat-msg ${s?"mine":""}"${t}>
    ${o}
    <span class="chat-from">${p(e.from)}</span>
    <span class="chat-text">${a}</span>
    <button class="chat-reply-btn" title="Répondre">↩</button>
  </div>`}function Le(e){return e.replace(/(^| )@([a-zA-Z0-9_-]+)/g,(n,s,o)=>`${s}<span class="chat-mention" data-name="${te(o)}">@${p(o)}</span>`)}function P(){if(document.getElementById("reply-bar")?.remove(),!M)return;const e=document.querySelector(".chat-input")?.parentElement;if(!e)return;const n=document.createElement("div");n.id="reply-bar",n.className="reply-bar",n.innerHTML=`
    <div class="reply-bar-top"></div>
    <span class="reply-bar-label">Répondre à <strong>${p(M.from)}</strong></span>
    <span class="reply-bar-snip">${p(M.text.slice(0,50))}${M.text.length>50?"…":""}</span>
    <button class="reply-bar-cancel">✕</button>
  `,e.insertBefore(n,e.firstChild),n.querySelector(".reply-bar-cancel").addEventListener("click",()=>{M=null,P()})}function ce(){const e=document.getElementById("chat-inp"),n=document.getElementById("chat-send-btn");if(!e||!n)return;const s=()=>{const o=e.value.trim();if(!o)return;const a={type:"chat",text:o};M&&(a.replyTo=M.id,M=null,P()),v(a),e.value=""};n.onclick=s,e.onkeydown=o=>{o.key==="Enter"&&s()},P()}let ae;function b(e){document.querySelectorAll(".toast").forEach(s=>s.remove()),clearTimeout(ae);const n=document.createElement("div");n.className="toast",n.textContent=e,document.body.appendChild(n),ae=setTimeout(()=>n.remove(),2800)}function p(e){const n=document.createElement("div");return n.textContent=e,n.innerHTML}let Q=[],Y=A(),X=A();function Ie(){const e=document.getElementById("spec-grid-1");e&&oe(e,Y);const n=document.getElementById("spec-grid-2");n&&oe(n,X)}function oe(e,n){e.innerHTML="";for(let s=0;s<f;s++)for(let o=0;o<f;o++){const a=document.createElement("div");a.className="gcell water";const t=n[s][o];t===1&&a.classList.add("ship"),t===2&&(a.classList.add("miss"),a.textContent="•"),t===3&&(a.classList.add("hit","ship-hit"),a.textContent="✕"),e.appendChild(a)}}function te(e){return e.replace(/"/g,"&quot;").replace(/</g,"&lt;")}window.addEventListener("error",e=>{v({type:"client_log",level:"error",message:`${e.message} @ ${e.filename}:${e.lineno}`})});window.addEventListener("unhandledrejection",e=>{v({type:"client_log",level:"error",message:`unhandled rejection: ${e.reason}`})});ie();h();
