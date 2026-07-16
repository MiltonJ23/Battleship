(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const t of a)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function o(a){const t={};return a.integrity&&(t.integrity=a.integrity),a.referrerPolicy&&(t.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?t.credentials="include":a.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(a){if(a.ep)return;a.ep=!0;const t=o(a);fetch(a.href,t)}})();class be{ctx=null;getCtx(){return this.ctx||(this.ctx=new AudioContext),this.ctx}play(n){try{const o=this.getCtx(),s=o.createOscillator(),a=o.createGain();s.connect(a),a.connect(o.destination);const t=o.currentTime;switch(n){case"tick":{s.type="square",s.frequency.setValueAtTime(1200,t),a.gain.setValueAtTime(.05,t),a.gain.exponentialRampToValueAtTime(.001,t+.04),s.start(t),s.stop(t+.04);break}case"spin":{for(let l=0;l<20;l++){const c=t+Math.pow(l/20,1.6)*2.2,d=o.createOscillator(),m=o.createGain();d.connect(m),m.connect(o.destination),d.type="square",d.frequency.setValueAtTime(1e3+Math.random()*300,c),m.gain.setValueAtTime(.05,c),m.gain.exponentialRampToValueAtTime(.001,c+.04),d.start(c),d.stop(c+.05)}break}case"zone":{for(let l=0;l<5;l++){const c=t+l*.12,d=o.createOscillator(),m=o.createGain();d.connect(m),m.connect(o.destination),d.type="sawtooth",d.frequency.setValueAtTime(160-l*15,c),d.frequency.exponentialRampToValueAtTime(40,c+.35),m.gain.setValueAtTime(.18,c),m.gain.exponentialRampToValueAtTime(.001,c+.4),d.start(c),d.stop(c+.4)}break}case"fire":s.type="sawtooth",s.frequency.setValueAtTime(150,t),s.frequency.exponentialRampToValueAtTime(60,t+.15),a.gain.setValueAtTime(.15,t),a.gain.exponentialRampToValueAtTime(.001,t+.2),s.start(t),s.stop(t+.2);break;case"hit":s.type="square",s.frequency.setValueAtTime(200,t),s.frequency.exponentialRampToValueAtTime(80,t+.4),a.gain.setValueAtTime(.2,t),a.gain.exponentialRampToValueAtTime(.001,t+.5),s.start(t),s.stop(t+.5);const i=o.createOscillator(),r=o.createGain();i.connect(r),r.connect(o.destination),i.type="triangle",i.frequency.setValueAtTime(400,t),i.frequency.exponentialRampToValueAtTime(100,t+.3),r.gain.setValueAtTime(.1,t),r.gain.exponentialRampToValueAtTime(.001,t+.35),i.start(t),i.stop(t+.35);break;case"sunk":for(let l=0;l<3;l++){const c=o.createOscillator(),d=o.createGain();c.connect(d),d.connect(o.destination),c.type="sawtooth",c.frequency.setValueAtTime(100-l*30,t+l*.15),c.frequency.exponentialRampToValueAtTime(30,t+l*.15+.5),d.gain.setValueAtTime(.2,t+l*.15),d.gain.exponentialRampToValueAtTime(.001,t+l*.15+.6),c.start(t+l*.15),c.stop(t+l*.15+.6)}break;case"miss":s.type="sine",s.frequency.setValueAtTime(600,t),s.frequency.exponentialRampToValueAtTime(300,t+.15),a.gain.setValueAtTime(.05,t),a.gain.exponentialRampToValueAtTime(.001,t+.2),s.start(t),s.stop(t+.2);break;case"win":[523,659,784,1047].forEach((l,c)=>{const d=o.createOscillator(),m=o.createGain();d.connect(m),m.connect(o.destination),d.type="triangle",d.frequency.setValueAtTime(l,t+c*.15),m.gain.setValueAtTime(.15,t+c*.15),m.gain.exponentialRampToValueAtTime(.001,t+c*.15+.4),d.start(t+c*.15),d.stop(t+c*.15+.4)});break;case"lose":[400,300,250,200].forEach((l,c)=>{const d=o.createOscillator(),m=o.createGain();d.connect(m),m.connect(o.destination),d.type="sawtooth",d.frequency.setValueAtTime(l,t+c*.2),m.gain.setValueAtTime(.12,t+c*.2),m.gain.exponentialRampToValueAtTime(.001,t+c*.2+.5),d.start(t+c*.2),d.stop(t+c*.2+.5)});break}}catch{}}}const T=new be;function he(e){const n=["#00f0ff","#ff0055","#ffe600","#00ff88","#ff6600","#cc00ff"];for(let o=0;o<60;o++){const s=document.createElement("div");s.style.cssText=`
      position:fixed;width:8px;height:8px;border-radius:50%;
      background:${n[o%n.length]};pointer-events:none;z-index:9999;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation: confettiFall ${1+Math.random()*2}s ease-out forwards;
      animation-delay:${Math.random()*.5}s;
      opacity:1;
    `,e.appendChild(s),setTimeout(()=>s.remove(),3e3)}}const f=10,S=[5,4,3,3,2];let u="join",k="",g=0,F=0,Z=0,N=0,y="",ae=0,E=!1,_=!1,W=[],ce=[],$=[],B=!0,O=A(),q=A(),I=!1,J=0,Q=!1,C=!1,w=!1,L=[],M=null,x=null,V;function A(){return Array.from({length:f},()=>Array(f).fill(0))}function re(){const e=location.protocol==="https:"?"wss":"ws";V=new WebSocket(`${e}://${location.host}/ws`),V.onopen=()=>{k&&u!=="join"&&b({type:"join",name:k})},V.onmessage=n=>{try{ve(JSON.parse(n.data))}catch{}},V.onclose=()=>{setTimeout(re,2e3)}}function b(e){V&&V.readyState===WebSocket.OPEN&&V.send(JSON.stringify(e))}function ve(e){switch(e.type){case"joined":k=e.name,g=e.points,F=e.wins,Z=e.losses,sessionStorage.setItem("bs_name",k),u="lobby",b({type:"loan_status"}),h();break;case"lobby_update":W=e.players||[],ce=e.leaderboard||[],e.me&&(g=e.me.points,F=e.me.wins,Z=e.me.losses),u==="lobby"&&h();break;case"challenge_sent":v(`Défi envoyé à ${e.target} — mise ${e.wager} pts ⏳`);break;case"challenge_received":ke(e.challenger,e.wager);break;case"challenge_declined":v(`${e.target} a refusé ton défi 😤`);break;case"game_start":y=e.opponent,ae=e.wager,N=e.playerIdx??0,$=[],B=!0,E=!1,_=!1,C=!1,w=!1,O=A(),q=A(),L=L.filter(s=>s.scope!=="game"),u="placement",h();break;case"ships_accepted":_=!0,u==="placement"&&h();break;case"opponent_ready":v(`${y} est prêt ! ⚓`);break;case"battle_start":E=!!e.yourTurn,u="battle",h();break;case"fire_result":{const{x:s,y:a,result:t,ship:i,shooter:r}=e,l=t==="hit"||t==="sunk";r===N?(O[a][s]=l?3:2,T.play(t==="sunk"?"sunk":l?"hit":"miss"),t==="sunk"?v(`💥 ${i} ennemi coulé !`):l&&v("🎯 Touché !")):(q[a][s]=l?3:2,T.play(l?"hit":"miss"),t==="sunk"&&v(`☠️ Ton ${i} a été coulé...`)),E=!!e.yourTurn,u==="battle"&&!e.gameOver&&(Be(),Y(),U(r===N?"enemy-grid":"own-grid",s,a,l));break}case"loan_approved":typeof e.newPoints=="number"&&(g=e.newPoints),x={principal:e.amount,remaining:e.amount+e.amount*e.rate/100,rate:e.rate,installment:e.installment||0,repaid:0},v(`🏦 Prêt de ${e.amount} pts accordé ! Taux: ${e.rate}%. Nouveau solde: ${g} pts`),u==="lobby"&&h();break;case"loan_status":x={principal:e.principal,remaining:e.remaining,rate:e.rate,installment:e.installment||0,repaid:e.repaid},u==="lobby"&&h();break;case"game_over":I=!!e.won,J=e.pointsEarned||0,Q=e.reason==="forfeit",typeof e.newPoints=="number"&&(g=e.newPoints),u="gameover",T.play(I?"win":"lose"),h(),I&&setTimeout(()=>he(document.body),200);break;case"rematch_requested":v(`${y} veut une revanche ! 🔄`);break;case"opponent_left":v(`${y} a quitté`),u==="gameover"&&h();break;case"spin_result":typeof e.spinnerPoints=="number"&&e.youSpun&&(g=e.spinnerPoints),Me(!!e.youBenefit,!!e.youSpun,()=>{e.youBenefit?(C=!0,v("💣 Attaque de zone 3×3 débloquée !")):v(`😱 ${y} a gagné l'attaque de zone !`),u==="battle"&&P()});break;case"zone_result":{const s=e.shooter===N;T.play("zone");let a=[];(e.cells||[]).forEach((t,i)=>{const{x:r,y:l,result:c}=t;if(c==="skip")return;const d=c==="hit"||c==="sunk";c==="sunk"&&t.ship&&a.push(t.ship),setTimeout(()=>{s?O[l][r]=d?3:2:q[l][r]=d?3:2,u==="battle"&&(Y(),U(s?"enemy-grid":"own-grid",r,l,d))},i*110)}),s&&(C=!1,w=!1),E=!!e.yourTurn,setTimeout(()=>{a.length&&(v(s?`💥 Coulé : ${a.join(", ")} !`:`☠️ Coulé : ${a.join(", ")}...`),T.play("sunk")),u==="battle"&&!e.gameOver&&P()},1100);break}case"chat_history":case"live_matches":X=e.matches||[],u==="lobby"&&Te();break;case"spectate_start":j=e.p1,G=e.p2,ee=e.board1||A(),te=e.board2||A(),ue=e.events||[],ne=e.turnName,u="spectate",h();break;case"spectate_fire":{const{x:s,y:a,result:t,shooter:i}=e,r=t==="hit"||t==="sunk",l=i===0?te:ee;l[a][s]=r?3:2,ne=e.turnName,u==="spectate"&&(me(),setTimeout(()=>U("spec-grid-"+(i===0?2:1),s,a,r),100));break}case"spectate_end":u="lobby",h();break;case"bets_resolved":v(`⚡ Paris résolus : ${e.kind}`);break;case"chat":L.push({id:e.id,from:e.from,text:e.text,scope:e.scope||"lobby",replyTo:e.replyTo||void 0,replySnip:e.replySnip||void 0}),L.length>150&&L.shift(),H();break;case"mention":T.play("hit");const n=e.text.slice(0,60)+(e.text.length>60?"…":""),o=document.createElement("div");o.className="toast toast-mention",o.innerHTML=`🔔 <strong>${p(e.from)}</strong> t'a mentionné<br/><em>${p(n)}</em>`,o.onclick=()=>{if(u==="battle"||u==="placement")return;const s=document.getElementById("chat-messages");s&&(s.scrollTop=s.scrollHeight)},document.body.appendChild(o),setTimeout(()=>o.remove(),3500),L.length<150&&L.push({from:e.from,text:e.text,scope:"lobby"}),H();break;case"bet_placed":v(`🎲 Pari placé : ${e.kind} → mise ${e.amount} pts, cote ${e.odds}x`);break;case"bet_won":v(`💰 Pari gagné ! +${e.amount} pts (${e.kind})`);break;case"error":v(`⚠️ ${e.message}`);break}}const R=document.getElementById("app");function h(){switch(u){case"join":ye();break;case"lobby":ge();break;case"placement":xe();break;case"battle":P();break;case"gameover":Se();break;case"spectate":Ve();break}}function ye(){const e=sessionStorage.getItem("bs_name")||"";R.innerHTML=`
    <div class="join-screen">
      <div class="ocean-waves"></div>
      <div class="join-content">
        <div class="logo-anchor">⚓</div>
        <h1 class="game-title">BATAILLE<br/>NAVALE</h1>
        <p class="tagline">Duels · Mises · Gloire</p>
        <div class="join-form">
          <input id="name-input" type="text" placeholder="Ton pseudo, capitaine" maxlength="20" value="${se(e)}" autocomplete="off" />
          <button id="join-btn" class="btn-primary btn-glow">⚔️ ENTRER AU COMBAT</button>
        </div>
        <p class="hint">100 points offerts aux nouveaux capitaines</p>
        <div class="join-chat panel">
          <h3>💬 Ça discute au port...</h3>
          <div id="join-chat-msgs" class="chat-msgs join-chat-msgs"></div>
        </div>
      </div>
    </div>`;const n=document.getElementById("name-input"),o=()=>{const s=n.value.trim();s&&(k=s,b({type:"join",name:s}))};document.getElementById("join-btn").onclick=o,n.onkeydown=s=>{s.key==="Enter"&&o()},n.focus(),H()}function ge(){R.innerHTML=`
    <div class="lobby-screen">
      <header class="lobby-header">
        <div class="header-left">
          <span class="header-logo">⚓</span>
          <span class="header-title">BATAILLE NAVALE</span>
        </div>
        <div class="my-badge">
          <span class="badge-name">${p(k)}</span>
          <span class="badge-points">💰 ${g} pts</span>
          <span class="badge-record">${F}V / ${Z}D</span>
        </div>
        ${Ee()}
      </header>
      <div class="lobby-body">
        <section class="panel players-panel">
          <h2>🌊 Capitaines en ligne <span class="count">${W.length}</span></h2>
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
    </div>`;const e=document.getElementById("lb-list"),n=["🥇","🥈","🥉"];e.innerHTML=ce.map((t,i)=>`
    <li class="${t.name===k?"me":""}">
      <span class="lb-rank">${n[i]||i+1}</span>
      <span class="lb-name">${p(t.name)}</span>
      <span class="lb-pts">${t.points}</span>
    </li>`).join("");const o=document.getElementById("player-list"),s=W.filter(t=>t.name!==k);o.innerHTML=s.length?s.map(t=>`
    <div class="player-row ${t.inGame?"ingame":""}">
      <div class="p-avatar">${t.name[0].toUpperCase()}</div>
      <div class="p-info">
        <span class="p-name">${p(t.name)}</span>
        <span class="p-stats">${t.points} pts · ${t.wins}V/${t.losses}D</span>
      </div>
      ${t.inGame?'<span class="p-status">⚔️ En duel</span>':`<button class="btn-challenge" data-target="${se(t.name)}">DÉFIER</button>`}
    </div>`).join(""):`<p class="empty-msg">Personne d'autre en ligne...<br/>Partage l'adresse à tes amis !</p>`,o.querySelectorAll(".btn-challenge").forEach(t=>{t.addEventListener("click",()=>$e(t.dataset.target))}),H(),pe();const a=document.getElementById("borrow-btn");a&&(a.onclick=we),b({type:"loan_status"}),b({type:"live_matches"})}function Te(){const e=document.getElementById("live-matches");if(e){if(X.length===0){e.innerHTML='<p class="empty-msg">Pas de match en cours</p>';return}e.innerHTML=X.map(n=>`
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
  `).join(""),e.querySelectorAll(".btn-challenge").forEach(n=>{n.addEventListener("click",()=>b({type:"spectate",gameId:n.dataset.game}))})}}function Ee(){if(!x)return g<75?'<div class="loan-cta"><button id="borrow-btn" class="btn-spin">🏦 Emprunter à la banque</button></div>':"";const e=Math.round((1-x.remaining/(x.principal*(1+x.rate/100)))*100);return`<div class="loan-cta"><span class="loan-status">🏦 Dette: ${x.remaining} pts (${e}% remboursé${x.installment>0?` · -${x.installment}/victoire`:" · en une fois"})</span></div>`}function $e(e){D();const n=document.createElement("div");n.className="modal-overlay",n.innerHTML=`
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
    </div>`,document.body.appendChild(n),n.onclick=o=>o.target===n&&n.remove(),n.querySelectorAll(".wager-quick button").forEach(o=>{o.onclick=()=>{document.getElementById("wager-input").value=o.dataset.w}}),document.getElementById("wager-cancel").onclick=()=>n.remove(),document.getElementById("wager-ok").onclick=()=>{const o=+document.getElementById("wager-input").value||0,s=Math.max(0,Math.min(g,o));b({type:"challenge",target:e,wager:s}),n.remove()}}function we(){if(x){v("Tu as déjà un prêt en cours !");return}D();const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`
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
    </div>`,document.body.appendChild(e),e.onclick=n=>n.target===e&&e.remove(),e.querySelectorAll(".wager-quick button").forEach(n=>{n.onclick=()=>{document.getElementById("loan-amount").value=n.dataset.m}}),document.getElementById("loan-cancel").onclick=()=>e.remove(),document.getElementById("loan-ok").onclick=()=>{const n=+document.getElementById("loan-amount").value||100;let o=+document.getElementById("loan-rate").value||10;const s=+document.getElementById("loan-installment").value||0;s>0&&(o+=10),b({type:"borrow",amount:n,rate:o,installment:s}),e.remove()}}function ke(e,n){D();const o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`
    <div class="modal modal-challenge">
      <div class="challenge-icon">⚔️</div>
      <h3>DÉFI REÇU !</h3>
      <p><strong>${p(e)}</strong> te défie en duel</p>
      <p class="wager-display">Mise : <strong>${n} pts</strong></p>
      <div class="modal-btns">
        <button id="ch-decline">Refuser</button>
        <button id="ch-accept" class="btn-primary btn-glow">ACCEPTER</button>
      </div>
    </div>`,document.body.appendChild(o),document.getElementById("ch-decline").onclick=()=>{b({type:"decline_challenge",challenger:e}),o.remove()},document.getElementById("ch-accept").onclick=()=>{b({type:"accept_challenge",challenger:e}),o.remove()}}function D(){document.querySelectorAll(".modal-overlay").forEach(e=>e.remove())}function xe(){const e=$.length,n=e===S.length;if(R.innerHTML=`
    <div class="place-screen">
      <header class="battle-header">
        <span class="vs-text">${p(k)} <span class="vs">VS</span> ${p(y)}</span>
        <span class="wager-badge">💰 ${ae} pts</span>
      </header>
      <h2 class="phase-title">${_?"⏳ En attente de "+p(y)+"...":"⚓ Déploie ta flotte"}</h2>
      ${_?'<div class="waiting-spinner"></div>':`
      <div class="place-progress">${S.map((a,t)=>`<span class="prog-dot ${t<e?"done":t===e?"current":""}">${a}</span>`).join("")}</div>
      <div id="place-grid" class="grid place-grid"></div>
      <div class="place-actions">
        <button id="rotate-btn" class="btn-action">↻ ${B?"Horizontal":"Vertical"}</button>
        <button id="random-btn" class="btn-action">🎲 Aléatoire</button>
        ${e>0&&!n?'<button id="reset-btn" class="btn-action">🗑️ Effacer</button>':""}
        ${n?'<button id="confirm-btn" class="btn-primary btn-glow">✓ PRÊT AU COMBAT</button>':""}
      </div>
      ${n?"":`<p class="help-text">Touche la grille pour placer le bateau de ${S[e]} cases</p>`}
      `}
    </div>`,_)return;Ie(),document.getElementById("rotate-btn").onclick=()=>{B=!B,h()},document.getElementById("random-btn").onclick=()=>{Le(),h()};const o=document.getElementById("reset-btn");o&&(o.onclick=()=>{$=[],q=A(),h()});const s=document.getElementById("confirm-btn");s&&(s.onclick=()=>{b({type:"place_ships",ships:$}),T.play("fire")})}function Ae(){const e=new Set;return $.forEach((n,o)=>{for(let s=0;s<S[o];s++){const a=n.horiz?n.row:n.row+s,t=n.horiz?n.col+s:n.col;e.add(`${a},${t}`)}}),e}function K(e,n,o,s){const a=Ae();for(let t=0;t<o;t++){const i=s?e:e+t,r=s?n+t:n;if(i<0||i>=f||r<0||r>=f||a.has(`${i},${r}`))return!1}return!0}function de(){q=A(),$.forEach((e,n)=>{for(let o=0;o<S[n];o++){const s=e.horiz?e.row:e.row+o,a=e.horiz?e.col+o:e.col;q[s][a]=1}})}function Le(){$=[];for(const e of S)for(let n=0;n<500;n++){const o=Math.random()>.5,s=Math.floor(Math.random()*f),a=Math.floor(Math.random()*f);if(K(s,a,e,o)){$.push({row:s,col:a,horiz:o});break}}de()}function Ie(){const e=document.getElementById("place-grid");if(!e)return;de();const n=$.length<S.length?S[$.length]:0;e.innerHTML="";const o=()=>e.querySelectorAll(".preview, .preview-bad").forEach(a=>a.classList.remove("preview","preview-bad")),s=(a,t)=>{if(o(),!n)return;const i=K(a,t,n,B);for(let r=0;r<n;r++){const l=B?a:a+r,c=B?t+r:t;l>=0&&l<f&&c>=0&&c<f&&e.children[l*f+c]?.classList.add(i?"preview":"preview-bad")}};for(let a=0;a<f;a++)for(let t=0;t<f;t++){const i=document.createElement("div");i.className="gcell",q[a][t]===1&&(i.classList.add("ship"),i.classList.add("removable")),i.addEventListener("pointerenter",()=>s(a,t)),i.addEventListener("click",()=>{if(q[a][t]===1){const r=$.findIndex((l,c)=>{for(let d=0;d<S[c];d++){const m=l.horiz?l.row:l.row+d,fe=l.horiz?l.col+d:l.col;if(m===a&&fe===t)return!0}return!1});r>=0&&($.splice(r,1),T.play("miss"),h());return}n&&K(a,t,n,B)&&($.push({row:a,col:t,horiz:B}),T.play("miss"),h())}),e.appendChild(i)}e.addEventListener("pointerleave",o)}function P(){R.innerHTML=`
    <div class="battle-screen">
      <header class="battle-header">
        <span class="vs-text">${p(k)} <span class="vs">VS</span> ${p(y)}</span>
        <span class="wager-badge">💰 ${ae} pts</span>
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
    </div>`,Y(),document.getElementById("forfeit-btn").onclick=()=>{confirm("Abandonner ? Tu perds la mise !")&&(b({type:"leave_game"}),u="lobby",h())};const e=document.getElementById("spin-btn");e&&(e.onclick=()=>{T.play("spin"),b({type:"spin"})});const n=document.getElementById("zone-btn");n&&(n.onclick=()=>{w=!w,P()}),H(),pe()}function Be(){const e=document.getElementById("turn-indicator");e&&(e.className=`turn-indicator ${E?"my-turn":""}`,e.innerHTML=E?"🎯 À TOI DE TIRER !":"⏳ "+p(y)+" vise...")}function Y(){const e=document.getElementById("enemy-grid");if(e){e.innerHTML="";const o=()=>e.querySelectorAll(".zone-target").forEach(a=>a.classList.remove("zone-target")),s=(a,t)=>{o();for(let i=-1;i<=1;i++)for(let r=-1;r<=1;r++){const l=a+i,c=t+r;l>=0&&l<f&&c>=0&&c<f&&e.children[l*f+c]?.classList.add("zone-target")}};for(let a=0;a<f;a++)for(let t=0;t<f;t++){const i=document.createElement("div");i.className="gcell water";const r=O[a][t];r===2&&(i.classList.add("miss"),i.textContent="•"),r===3&&(i.classList.add("hit"),i.textContent="✕"),E&&w?(i.classList.add("clickable"),i.addEventListener("pointerenter",()=>s(a,t)),i.onclick=()=>{!E||!C||(T.play("fire"),b({type:"fire_zone",x:t,y:a}),w=!1)}):r===0&&E&&(i.classList.add("clickable"),i.onclick=()=>{E&&(T.play("fire"),b({type:"fire",x:t,y:a}))}),e.appendChild(i)}w&&e.addEventListener("pointerleave",o)}const n=document.getElementById("own-grid");if(n){n.innerHTML="";for(let o=0;o<f;o++)for(let s=0;s<f;s++){const a=document.createElement("div");a.className="gcell water";const t=q[o][s];t===1&&a.classList.add("ship"),t===2&&(a.classList.add("miss"),a.textContent="•"),t===3&&(a.classList.add("hit","ship-hit"),a.textContent="✕"),n.appendChild(a)}}}function Me(e,n,o){D();const s=document.createElement("div");s.className="modal-overlay",s.innerHTML=`
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
    </div>`,document.body.appendChild(s),T.play("spin");const a=document.getElementById("spin-wheel"),t=e?90:270,i=Math.random()*100-50,r=5*360+(360-t)+i*.6;requestAnimationFrame(()=>{a.style.transition="transform 2.4s cubic-bezier(0.15, 0.9, 0.25, 1)",a.style.transform=`rotate(${r}deg)`}),setTimeout(()=>{const l=document.getElementById("spin-verdict");l&&(l.textContent=e?"💣 TU GAGNES L'ATTAQUE DE ZONE !":`😈 ${y} gagne l'attaque de zone !`,l.className=`spin-verdict show ${e?"good":"bad"}`),T.play(e?"win":"lose")},2500),setTimeout(()=>{s.remove(),o()},4200)}function U(e,n,o,s){const a=document.getElementById(e);if(!a)return;const t=a.children[o*f+n];t&&(t.classList.add(s?"explode":"splash"),setTimeout(()=>t.classList.remove("explode","splash"),700))}function Se(){R.innerHTML=`
    <div class="gameover-screen ${I?"win":"lose"}">
      <div class="go-icon">${I?"🏆":"💀"}</div>
      <h1>${I?"VICTOIRE !":"DÉFAITE"}</h1>
      <p class="go-detail">
        ${Q?p(y)+" a abandonné !":I?"Tu as coulé toute la flotte de "+p(y)+" !":p(y)+" a coulé toute ta flotte..."}
      </p>
      ${J>0?`<p class="go-points ${I?"gain":"loss"}">${I?"+":"-"}${J} points</p>`:""}
      <p class="go-balance">Solde : <strong>${g} pts</strong></p>
      <div class="gameover-btns">
        ${Q?"":'<button id="rematch-btn" class="btn-primary btn-glow">🔄 REVANCHE</button>'}
        <button id="lobby-btn" class="btn-action">⚓ Retour au port</button>
      </div>
    </div>`;const e=document.getElementById("rematch-btn");e&&(e.onclick=()=>{b({type:"rematch"}),v("Revanche proposée, en attente..."),e.setAttribute("disabled","true"),e.textContent="⏳ En attente..."}),document.getElementById("lobby-btn").onclick=()=>{b({type:"leave_game"}),u="lobby",h()}}function H(){const e=document.getElementById("join-chat-msgs");e&&(e.innerHTML=L.filter(a=>a.scope==="lobby").slice(-15).map(a=>oe(a)).join("")||'<p class="empty-msg">Silence radio pour le moment...</p>',e.scrollTop=e.scrollHeight);const n=document.getElementById("chat-messages");if(!n)return;const o=u==="battle"||u==="placement"?"game":"lobby",s=L.filter(a=>a.scope===o);n.innerHTML=s.map((a,t)=>oe(a,t)).join(""),n.scrollTop=n.scrollHeight,n.querySelectorAll(".chat-reply-btn").forEach(a=>{a.addEventListener("click",t=>{t.stopPropagation();const i=a.closest(".chat-msg"),r=parseInt(i?.dataset.i||"0"),l=s[r];l&&(M={id:l.id||"",from:l.from,text:l.text}),z()})}),n.querySelectorAll(".chat-mention").forEach(a=>{a.addEventListener("click",()=>{const t=a.getAttribute("data-name")||"";for(let i=s.length-1;i>=0;i--)if(s[i].from===t){const r=n.children[i];r&&(r.scrollIntoView({behavior:"smooth",block:"center"}),r.classList.add("msg-flash"),setTimeout(()=>r.classList.remove("msg-flash"),1800));return}v(`${t} n'a pas de message récent ici`)})})}function oe(e,n){const o=e.from===k,s=e.replyTo?`<div class="reply-quote"><span class="reply-quote-bar"></span><span class="reply-quote-text">${p(e.replySnip||"")}</span></div>`:"",a=qe(e.text),t=n!==void 0?` data-i="${n}"`:"";return`<div class="chat-msg ${o?"mine":""}"${t}>
    ${s}
    <span class="chat-from">${p(e.from)}</span>
    <span class="chat-text">${a}</span>
    <button class="chat-reply-btn" title="Répondre">↩</button>
  </div>`}function qe(e){return e.replace(/(^| )@([a-zA-Z0-9_-]+)/g,(n,o,s)=>`${o}<span class="chat-mention" data-name="${se(s)}">@${p(s)}</span>`)}function z(){if(document.getElementById("reply-bar")?.remove(),!M)return;const e=document.querySelector(".chat-input")?.parentElement;if(!e)return;const n=document.createElement("div");n.id="reply-bar",n.className="reply-bar",n.innerHTML=`
    <div class="reply-bar-top"></div>
    <span class="reply-bar-label">Répondre à <strong>${p(M.from)}</strong></span>
    <span class="reply-bar-snip">${p(M.text.slice(0,50))}${M.text.length>50?"…":""}</span>
    <button class="reply-bar-cancel">✕</button>
  `,e.insertBefore(n,e.firstChild),n.querySelector(".reply-bar-cancel").addEventListener("click",()=>{M=null,z()})}function pe(){const e=document.getElementById("chat-inp"),n=document.getElementById("chat-send-btn");if(!e||!n)return;const o=()=>{const s=e.value.trim();if(!s)return;const a={type:"chat",text:s};M&&(a.replyTo=M.id,M=null,z()),b(a),e.value=""};n.onclick=o,e.onkeydown=s=>{s.key==="Enter"&&o()},z()}let ie;function v(e){document.querySelectorAll(".toast").forEach(o=>o.remove()),clearTimeout(ie);const n=document.createElement("div");n.className="toast",n.textContent=e,document.body.appendChild(n),ie=setTimeout(()=>n.remove(),2800)}function p(e){const n=document.createElement("div");return n.textContent=e,n.innerHTML}let X=[],j="",G="",ee=A(),te=A(),ue=[],ne="";function Ve(){R.innerHTML=`<div class="spectate-screen">
    <header class="battle-header">
      <span class="vs-text">${p(j)} <span class="vs">VS</span> ${p(G)}</span>
      <button id="unspectate-btn" class="btn-danger">Quitter</button>
    </header>
    <div class="turn-indicator">Tour de ${p(ne)}</div>
    <div class="spectate-grids">
      <div class="battle-section"><h3>${p(j)}</h3><div id="spec-grid-1" class="grid spec-grid"></div></div>
      <div class="battle-section"><h3>${p(G)}</h3><div id="spec-grid-2" class="grid spec-grid"></div></div>
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
  </div>`,me(),document.getElementById("unspectate-btn").onclick=()=>{b({type:"unspectate"}),u="lobby",h()},Ce(),Re()}function me(){const e=document.getElementById("spec-grid-1");e&&le(e,ee);const n=document.getElementById("spec-grid-2");n&&le(n,te)}function le(e,n){e.innerHTML="";for(let o=0;o<f;o++)for(let s=0;s<f;s++){const a=document.createElement("div");a.className="gcell water";const t=n[o][s];t===1&&a.classList.add("ship"),t===2&&(a.classList.add("miss"),a.textContent="•"),t===3&&(a.classList.add("hit","ship-hit"),a.textContent="✕"),e.appendChild(a)}}function Ce(){const e=document.getElementById("spec-events");e&&(e.innerHTML=ue.slice(-10).reverse().map(n=>{const o=n.player===0?j:G,s=n.data||{};return`<div class="spec-event">${s.result==="hit"?"🎯":s.result==="sunk"?"💥":"💧"} <strong>${p(o)}</strong> ${s.x},${s.y} ${s.ship||""}</div>`}).join(""))}function Re(){document.getElementById("spec-odds"),document.getElementById("spec-bet-btns")}function se(e){return e.replace(/"/g,"&quot;").replace(/</g,"&lt;")}window.addEventListener("error",e=>{b({type:"client_log",level:"error",message:`${e.message} @ ${e.filename}:${e.lineno}`})});window.addEventListener("unhandledrejection",e=>{b({type:"client_log",level:"error",message:`unhandled rejection: ${e.reason}`})});re();h();
