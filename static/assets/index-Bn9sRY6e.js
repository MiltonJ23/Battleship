(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const t of s)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function o(s){const t={};return s.integrity&&(t.integrity=s.integrity),s.referrerPolicy&&(t.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?t.credentials="include":s.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function a(s){if(s.ep)return;s.ep=!0;const t=o(s);fetch(s.href,t)}})();class ye{ctx=null;getCtx(){return this.ctx||(this.ctx=new AudioContext),this.ctx}play(n){try{const o=this.getCtx(),a=o.createOscillator(),s=o.createGain();a.connect(s),s.connect(o.destination);const t=o.currentTime;switch(n){case"tick":{a.type="square",a.frequency.setValueAtTime(1200,t),s.gain.setValueAtTime(.05,t),s.gain.exponentialRampToValueAtTime(.001,t+.04),a.start(t),a.stop(t+.04);break}case"spin":{for(let c=0;c<20;c++){const l=t+Math.pow(c/20,1.6)*2.2,p=o.createOscillator(),b=o.createGain();p.connect(b),b.connect(o.destination),p.type="square",p.frequency.setValueAtTime(1e3+Math.random()*300,l),b.gain.setValueAtTime(.05,l),b.gain.exponentialRampToValueAtTime(.001,l+.04),p.start(l),p.stop(l+.05)}break}case"zone":{for(let c=0;c<5;c++){const l=t+c*.12,p=o.createOscillator(),b=o.createGain();p.connect(b),b.connect(o.destination),p.type="sawtooth",p.frequency.setValueAtTime(160-c*15,l),p.frequency.exponentialRampToValueAtTime(40,l+.35),b.gain.setValueAtTime(.18,l),b.gain.exponentialRampToValueAtTime(.001,l+.4),p.start(l),p.stop(l+.4)}break}case"fire":a.type="sawtooth",a.frequency.setValueAtTime(150,t),a.frequency.exponentialRampToValueAtTime(60,t+.15),s.gain.setValueAtTime(.15,t),s.gain.exponentialRampToValueAtTime(.001,t+.2),a.start(t),a.stop(t+.2);break;case"hit":a.type="square",a.frequency.setValueAtTime(200,t),a.frequency.exponentialRampToValueAtTime(80,t+.4),s.gain.setValueAtTime(.2,t),s.gain.exponentialRampToValueAtTime(.001,t+.5),a.start(t),a.stop(t+.5);const i=o.createOscillator(),r=o.createGain();i.connect(r),r.connect(o.destination),i.type="triangle",i.frequency.setValueAtTime(400,t),i.frequency.exponentialRampToValueAtTime(100,t+.3),r.gain.setValueAtTime(.1,t),r.gain.exponentialRampToValueAtTime(.001,t+.35),i.start(t),i.stop(t+.35);break;case"sunk":for(let c=0;c<3;c++){const l=o.createOscillator(),p=o.createGain();l.connect(p),p.connect(o.destination),l.type="sawtooth",l.frequency.setValueAtTime(100-c*30,t+c*.15),l.frequency.exponentialRampToValueAtTime(30,t+c*.15+.5),p.gain.setValueAtTime(.2,t+c*.15),p.gain.exponentialRampToValueAtTime(.001,t+c*.15+.6),l.start(t+c*.15),l.stop(t+c*.15+.6)}break;case"miss":a.type="sine",a.frequency.setValueAtTime(600,t),a.frequency.exponentialRampToValueAtTime(300,t+.15),s.gain.setValueAtTime(.05,t),s.gain.exponentialRampToValueAtTime(.001,t+.2),a.start(t),a.stop(t+.2);break;case"win":[523,659,784,1047].forEach((c,l)=>{const p=o.createOscillator(),b=o.createGain();p.connect(b),b.connect(o.destination),p.type="triangle",p.frequency.setValueAtTime(c,t+l*.15),b.gain.setValueAtTime(.15,t+l*.15),b.gain.exponentialRampToValueAtTime(.001,t+l*.15+.4),p.start(t+l*.15),p.stop(t+l*.15+.4)});break;case"lose":[400,300,250,200].forEach((c,l)=>{const p=o.createOscillator(),b=o.createGain();p.connect(b),b.connect(o.destination),p.type="sawtooth",p.frequency.setValueAtTime(c,t+l*.2),b.gain.setValueAtTime(.12,t+l*.2),b.gain.exponentialRampToValueAtTime(.001,t+l*.2+.5),p.start(t+l*.2),p.stop(t+l*.2+.5)});break}}catch{}}}const $=new ye;function ge(e){const n=["#00f0ff","#ff0055","#ffe600","#00ff88","#ff6600","#cc00ff"];for(let o=0;o<60;o++){const a=document.createElement("div");a.style.cssText=`
      position:fixed;width:8px;height:8px;border-radius:50%;
      background:${n[o%n.length]};pointer-events:none;z-index:9999;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation: confettiFall ${1+Math.random()*2}s ease-out forwards;
      animation-delay:${Math.random()*.5}s;
      opacity:1;
    `,e.appendChild(a),setTimeout(()=>a.remove(),3e3)}}const h=10,S=[5,4,3,3,2];let u="join",w="",y=0,Z=0,W=0,z=0,g="",oe=0,E=!1,N=!1,J=[],pe=[],T=[],B=!0,j=A(),q=A(),L=!1,Q=0,K=!1,_=!1,k=!1,I=[],M=null,x=null,R;function A(){return Array.from({length:h},()=>Array(h).fill(0))}function ue(){const e=location.protocol==="https:"?"wss":"ws";R=new WebSocket(`${e}://${location.host}/ws`),R.onopen=()=>{w&&u!=="join"&&m({type:"join",name:w})},R.onmessage=n=>{try{$e(JSON.parse(n.data))}catch{}},R.onclose=()=>{setTimeout(ue,2e3)}}function m(e){R&&R.readyState===WebSocket.OPEN&&R.send(JSON.stringify(e))}function $e(e){switch(e.type){case"joined":w=e.name,y=e.points,Z=e.wins,W=e.losses,sessionStorage.setItem("bs_name",w),u="lobby",m({type:"loan_status"}),f();break;case"lobby_update":J=e.players||[],pe=e.leaderboard||[],e.me&&(y=e.me.points,Z=e.me.wins,W=e.me.losses),u==="lobby"&&f();break;case"challenge_sent":v(`Défi envoyé à ${e.target} — mise ${e.wager} pts ⏳`);break;case"challenge_received":Ie(e.challenger,e.wager);break;case"challenge_declined":v(`${e.target} a refusé ton défi 😤`);break;case"game_start":g=e.opponent,oe=e.wager,z=e.playerIdx??0,T=[],B=!0,E=!1,N=!1,_=!1,k=!1,j=A(),q=A(),I=I.filter(a=>a.scope!=="game"),u="placement",f();break;case"ships_accepted":N=!0,u==="placement"&&f();break;case"opponent_ready":v(`${g} est prêt ! ⚓`);break;case"battle_start":E=!!e.yourTurn,u="battle",f();break;case"fire_result":{const{x:a,y:s,result:t,ship:i,shooter:r}=e,c=t==="hit"||t==="sunk";r===z?(j[s][a]=c?3:2,$.play(t==="sunk"?"sunk":c?"hit":"miss"),t==="sunk"?v(`💥 ${i} ennemi coulé !`):c&&v("🎯 Touché !")):(q[s][a]=c?3:2,$.play(c?"hit":"miss"),t==="sunk"&&v(`☠️ Ton ${i} a été coulé...`)),E=!!e.yourTurn,u==="battle"&&!e.gameOver&&(qe(),X(),F(r===z?"enemy-grid":"own-grid",a,s,c));break}case"loan_approved":typeof e.newPoints=="number"&&(y=e.newPoints),x={principal:e.amount,remaining:e.amount+e.amount*e.rate/100,rate:e.rate,installment:e.installment||0,repaid:0},v(`🏦 Prêt de ${e.amount} pts accordé ! Taux: ${e.rate}%. Nouveau solde: ${y} pts`),u==="lobby"&&f();break;case"loan_status":x={principal:e.principal,remaining:e.remaining,rate:e.rate,installment:e.installment||0,repaid:e.repaid},u==="lobby"&&f();break;case"game_over":L=!!e.won,Q=e.pointsEarned||0,K=e.reason==="forfeit",typeof e.newPoints=="number"&&(y=e.newPoints),u="gameover",$.play(L?"win":"lose"),f(),L&&setTimeout(()=>ge(document.body),200);break;case"rematch_requested":v(`${g} veut une revanche ! 🔄`);break;case"opponent_left":v(`${g} a quitté`),u==="gameover"&&f();break;case"spin_result":typeof e.spinnerPoints=="number"&&e.youSpun&&(y=e.spinnerPoints),Ve(!!e.youBenefit,!!e.youSpun,()=>{e.youBenefit?(_=!0,v("💣 Attaque de zone 3×3 débloquée !")):v(`😱 ${g} a gagné l'attaque de zone !`),u==="battle"&&D()});break;case"zone_result":{const a=e.shooter===z;$.play("zone");let s=[];(e.cells||[]).forEach((t,i)=>{const{x:r,y:c,result:l}=t;if(l==="skip")return;const p=l==="hit"||l==="sunk";l==="sunk"&&t.ship&&s.push(t.ship),setTimeout(()=>{a?j[c][r]=p?3:2:q[c][r]=p?3:2,u==="battle"&&(X(),F(a?"enemy-grid":"own-grid",r,c,p))},i*110)}),a&&(_=!1,k=!1),E=!!e.yourTurn,setTimeout(()=>{s.length&&(v(a?`💥 Coulé : ${s.join(", ")} !`:`☠️ Coulé : ${s.join(", ")}...`),$.play("sunk")),u==="battle"&&!e.gameOver&&D()},1100);break}case"chat_history":case"live_matches":ee=e.matches||[],u==="lobby"&&ke();break;case"spectate_start":V=e.p1,C=e.p2,te=e.board1||A(),ne=e.board2||A(),be=e.events||[],ae=e.turnName,se=e.gameId||se,u="spectate",f();break;case"spectate_fire":{const{x:a,y:s,result:t,shooter:i}=e,r=t==="hit"||t==="sunk",c=i===0?ne:te;c[s][a]=r?3:2,ae=e.turnName,u==="spectate"&&(he(),setTimeout(()=>F("spec-grid-"+(i===0?2:1),a,s,r),100));break}case"spectate_end":u="lobby",f();break;case"bets_resolved":v(`⚡ Paris résolus : ${e.kind}`);break;case"chat":I.push({id:e.id,from:e.from,text:e.text,scope:e.scope||"lobby",replyTo:e.replyTo||void 0,replySnip:e.replySnip||void 0}),I.length>150&&I.shift(),P();break;case"mention":$.play("hit");const n=e.text.slice(0,60)+(e.text.length>60?"…":""),o=document.createElement("div");o.className="toast toast-mention",o.innerHTML=`🔔 <strong>${d(e.from)}</strong> t'a mentionné<br/><em>${d(n)}</em>`,o.onclick=()=>{if(u==="battle"||u==="placement")return;const a=document.getElementById("chat-messages");a&&(a.scrollTop=a.scrollHeight)},document.body.appendChild(o),setTimeout(()=>o.remove(),3500),I.length<150&&I.push({from:e.from,text:e.text,scope:"lobby"}),P();break;case"odds":G={kind:e.kind||"",odds0:e.odds0||0,odds1:e.odds1||0},u==="spectate"&&fe();break;case"bet_placed":v(`🎲 Pari placé : ${e.kind} → mise ${e.amount} pts, cote ${e.odds}x`);break;case"bet_won":v(`💰 Pari gagné ! +${e.amount} pts (${e.kind})`);break;case"error":v(`⚠️ ${e.message}`);break}}const H=document.getElementById("app");function f(){switch(u){case"join":Ee();break;case"lobby":Te();break;case"placement":Le();break;case"battle":D();break;case"gameover":Ce();break;case"spectate":_e();break}}function Ee(){const e=sessionStorage.getItem("bs_name")||"";H.innerHTML=`
    <div class="join-screen">
      <div class="ocean-waves"></div>
      <div class="join-content">
        <div class="logo-anchor">⚓</div>
        <h1 class="game-title">BATAILLE<br/>NAVALE</h1>
        <p class="tagline">Duels · Mises · Gloire</p>
        <div class="join-form">
          <input id="name-input" type="text" placeholder="Ton pseudo, capitaine" maxlength="20" value="${ce(e)}" autocomplete="off" />
          <button id="join-btn" class="btn-primary btn-glow">⚔️ ENTRER AU COMBAT</button>
        </div>
        <p class="hint">100 points offerts aux nouveaux capitaines</p>
        <div class="join-chat panel">
          <h3>💬 Ça discute au port...</h3>
          <div id="join-chat-msgs" class="chat-msgs join-chat-msgs"></div>
        </div>
      </div>
    </div>`;const n=document.getElementById("name-input"),o=()=>{const a=n.value.trim();a&&(w=a,m({type:"join",name:a}))};document.getElementById("join-btn").onclick=o,n.onkeydown=a=>{a.key==="Enter"&&o()},n.focus(),P()}function Te(){H.innerHTML=`
    <div class="lobby-screen">
      <header class="lobby-header">
        <div class="header-left">
          <span class="header-logo">⚓</span>
          <span class="header-title">BATAILLE NAVALE</span>
        </div>
        <div class="my-badge">
          <span class="badge-name">${d(w)}</span>
          <span class="badge-points">💰 ${y} pts</span>
          <span class="badge-record">${Z}V / ${W}D</span>
        </div>
        ${we()}
      </header>
      <div class="lobby-body">
        <section class="panel players-panel">
          <h2>🌊 Capitaines en ligne <span class="count">${J.length}</span></h2>
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
    </div>`;const e=document.getElementById("lb-list"),n=["🥇","🥈","🥉"];e.innerHTML=pe.map((t,i)=>`
    <li class="${t.name===w?"me":""}">
      <span class="lb-rank">${n[i]||i+1}</span>
      <span class="lb-name">${d(t.name)}</span>
      <span class="lb-pts">${t.points}</span>
    </li>`).join("");const o=document.getElementById("player-list"),a=J.filter(t=>t.name!==w);o.innerHTML=a.length?a.map(t=>`
    <div class="player-row ${t.inGame?"ingame":""}">
      <div class="p-avatar">${t.name[0].toUpperCase()}</div>
      <div class="p-info">
        <span class="p-name">${d(t.name)}</span>
        <span class="p-stats">${t.points} pts · ${t.wins}V/${t.losses}D</span>
      </div>
      ${t.inGame?'<span class="p-status">⚔️ En duel</span>':`<button class="btn-challenge" data-target="${ce(t.name)}">DÉFIER</button>`}
    </div>`).join(""):`<p class="empty-msg">Personne d'autre en ligne...<br/>Partage l'adresse à tes amis !</p>`,o.querySelectorAll(".btn-challenge").forEach(t=>{t.addEventListener("click",()=>xe(t.dataset.target))}),P(),ie();const s=document.getElementById("borrow-btn");s&&(s.onclick=Ae),m({type:"loan_status"}),m({type:"live_matches"})}function ke(){const e=document.getElementById("live-matches");if(e){if(ee.length===0){e.innerHTML='<p class="empty-msg">Pas de match en cours</p>';return}e.innerHTML=ee.map(n=>`
    <div class="live-match">
      <div class="lm-players">
        <span>${d(n.p1)} (${n.p1Ships}⚓)</span>
        <span class="vs">VS</span>
        <span>${d(n.p2)} (${n.p2Ships}⚓)</span>
      </div>
      <div class="lm-info">
        <span>${n.phase?"📐 Placement":"🎯 Tour: "+d(n.turnName)}</span>
        <span>💰 ${n.wager} pts</span>
        <span>👁 ${n.spectators}</span>
      </div>
      <button class="btn-challenge" data-game="${n.id}">REGARDER</button>
    </div>
  `).join(""),e.querySelectorAll(".btn-challenge").forEach(n=>{n.addEventListener("click",()=>m({type:"spectate",gameId:n.dataset.game}))})}}function we(){if(!x)return y<75?'<div class="loan-cta"><button id="borrow-btn" class="btn-spin">🏦 Emprunter à la banque</button></div>':"";const e=Math.round((1-x.remaining/(x.principal*(1+x.rate/100)))*100);return`<div class="loan-cta"><span class="loan-status">🏦 Dette: ${x.remaining} pts (${e}% remboursé${x.installment>0?` · -${x.installment}/victoire`:" · en une fois"})</span></div>`}function xe(e){O();const n=document.createElement("div");n.className="modal-overlay",n.innerHTML=`
    <div class="modal">
      <h3>⚔️ Défier ${d(e)}</h3>
      <label>Mise (tu as ${y} pts)</label>
      <div class="wager-quick">
        <button data-w="0">Amical</button>
        <button data-w="10">10</button>
        <button data-w="25">25</button>
        <button data-w="50">50</button>
      </div>
      <input id="wager-input" type="number" min="0" max="${y}" value="10" inputmode="numeric" />
      <div class="modal-btns">
        <button id="wager-cancel">Annuler</button>
        <button id="wager-ok" class="btn-primary">ENVOYER LE DÉFI</button>
      </div>
    </div>`,document.body.appendChild(n),n.onclick=o=>o.target===n&&n.remove(),n.querySelectorAll(".wager-quick button").forEach(o=>{o.onclick=()=>{document.getElementById("wager-input").value=o.dataset.w}}),document.getElementById("wager-cancel").onclick=()=>n.remove(),document.getElementById("wager-ok").onclick=()=>{const o=+document.getElementById("wager-input").value||0,a=Math.max(0,Math.min(y,o));m({type:"challenge",target:e,wager:a}),n.remove()}}function Ae(){if(x){v("Tu as déjà un prêt en cours !");return}O();const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`
    <div class="modal">
      <h3>🏦 Banque du Port</h3>
      <p style="color:var(--text-dim);font-size:14px">Solde actuel : ${y} pts</p>
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
    </div>`,document.body.appendChild(e),e.onclick=n=>n.target===e&&e.remove(),e.querySelectorAll(".wager-quick button").forEach(n=>{n.onclick=()=>{document.getElementById("loan-amount").value=n.dataset.m}}),document.getElementById("loan-cancel").onclick=()=>e.remove(),document.getElementById("loan-ok").onclick=()=>{const n=+document.getElementById("loan-amount").value||100;let o=+document.getElementById("loan-rate").value||10;const a=+document.getElementById("loan-installment").value||0;a>0&&(o+=10),m({type:"borrow",amount:n,rate:o,installment:a}),e.remove()}}function Ie(e,n){O();const o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`
    <div class="modal modal-challenge">
      <div class="challenge-icon">⚔️</div>
      <h3>DÉFI REÇU !</h3>
      <p><strong>${d(e)}</strong> te défie en duel</p>
      <p class="wager-display">Mise : <strong>${n} pts</strong></p>
      <div class="modal-btns">
        <button id="ch-decline">Refuser</button>
        <button id="ch-accept" class="btn-primary btn-glow">ACCEPTER</button>
      </div>
    </div>`,document.body.appendChild(o),document.getElementById("ch-decline").onclick=()=>{m({type:"decline_challenge",challenger:e}),o.remove()},document.getElementById("ch-accept").onclick=()=>{m({type:"accept_challenge",challenger:e}),o.remove()}}function O(){document.querySelectorAll(".modal-overlay").forEach(e=>e.remove())}function Le(){const e=T.length,n=e===S.length;if(H.innerHTML=`
    <div class="place-screen">
      <header class="battle-header">
        <span class="vs-text">${d(w)} <span class="vs">VS</span> ${d(g)}</span>
        <span class="wager-badge">💰 ${oe} pts</span>
      </header>
      <h2 class="phase-title">${N?"⏳ En attente de "+d(g)+"...":"⚓ Déploie ta flotte"}</h2>
      ${N?'<div class="waiting-spinner"></div>':`
      <div class="place-progress">${S.map((s,t)=>`<span class="prog-dot ${t<e?"done":t===e?"current":""}">${s}</span>`).join("")}</div>
      <div id="place-grid" class="grid place-grid"></div>
      <div class="place-actions">
        <button id="rotate-btn" class="btn-action">↻ ${B?"Horizontal":"Vertical"}</button>
        <button id="random-btn" class="btn-action">🎲 Aléatoire</button>
        ${e>0&&!n?'<button id="reset-btn" class="btn-action">🗑️ Effacer</button>':""}
        ${n?'<button id="confirm-btn" class="btn-primary btn-glow">✓ PRÊT AU COMBAT</button>':""}
      </div>
      ${n?"":`<p class="help-text">Touche la grille pour placer le bateau de ${S[e]} cases</p>`}
      `}
    </div>`,N)return;Se(),document.getElementById("rotate-btn").onclick=()=>{B=!B,f()},document.getElementById("random-btn").onclick=()=>{Me(),f()};const o=document.getElementById("reset-btn");o&&(o.onclick=()=>{T=[],q=A(),f()});const a=document.getElementById("confirm-btn");a&&(a.onclick=()=>{m({type:"place_ships",ships:T}),$.play("fire")})}function Be(){const e=new Set;return T.forEach((n,o)=>{for(let a=0;a<S[o];a++){const s=n.horiz?n.row:n.row+a,t=n.horiz?n.col+a:n.col;e.add(`${s},${t}`)}}),e}function Y(e,n,o,a){const s=Be();for(let t=0;t<o;t++){const i=a?e:e+t,r=a?n+t:n;if(i<0||i>=h||r<0||r>=h||s.has(`${i},${r}`))return!1}return!0}function me(){q=A(),T.forEach((e,n)=>{for(let o=0;o<S[n];o++){const a=e.horiz?e.row:e.row+o,s=e.horiz?e.col+o:e.col;q[a][s]=1}})}function Me(){T=[];for(const e of S)for(let n=0;n<500;n++){const o=Math.random()>.5,a=Math.floor(Math.random()*h),s=Math.floor(Math.random()*h);if(Y(a,s,e,o)){T.push({row:a,col:s,horiz:o});break}}me()}function Se(){const e=document.getElementById("place-grid");if(!e)return;me();const n=T.length<S.length?S[T.length]:0;e.innerHTML="";const o=()=>e.querySelectorAll(".preview, .preview-bad").forEach(s=>s.classList.remove("preview","preview-bad")),a=(s,t)=>{if(o(),!n)return;const i=Y(s,t,n,B);for(let r=0;r<n;r++){const c=B?s:s+r,l=B?t+r:t;c>=0&&c<h&&l>=0&&l<h&&e.children[c*h+l]?.classList.add(i?"preview":"preview-bad")}};for(let s=0;s<h;s++)for(let t=0;t<h;t++){const i=document.createElement("div");i.className="gcell",q[s][t]===1&&(i.classList.add("ship"),i.classList.add("removable")),i.addEventListener("pointerenter",()=>a(s,t)),i.addEventListener("click",()=>{if(q[s][t]===1){const r=T.findIndex((c,l)=>{for(let p=0;p<S[l];p++){const b=c.horiz?c.row:c.row+p,ve=c.horiz?c.col+p:c.col;if(b===s&&ve===t)return!0}return!1});r>=0&&(T.splice(r,1),$.play("miss"),f());return}n&&Y(s,t,n,B)&&(T.push({row:s,col:t,horiz:B}),$.play("miss"),f())}),e.appendChild(i)}e.addEventListener("pointerleave",o)}function D(){H.innerHTML=`
    <div class="battle-screen">
      <header class="battle-header">
        <span class="vs-text">${d(w)} <span class="vs">VS</span> ${d(g)}</span>
        <span class="wager-badge">💰 ${oe} pts</span>
        <span class="points-badge">Solde : ${y} pts</span>
      </header>
      <div id="turn-indicator" class="turn-indicator ${E?"my-turn":""}">
        ${E?k?"💣 CHOISIS LE CENTRE DE LA ZONE 3×3":"🎯 À TOI DE TIRER !":"⏳ "+d(g)+" vise..."}
      </div>
      <div class="battle-grids">
        <div class="battle-section enemy-section">
          <h3>🎯 Flotte de ${d(g)}</h3>
          <div id="enemy-grid" class="grid enemy-grid ${k?"zone-mode":""}"></div>
        </div>
        <div class="battle-section own-section">
          <h3>🛡️ Ta flotte</h3>
          <div id="own-grid" class="grid own-grid small"></div>
        </div>
      </div>
      <div class="power-bar">
        <button id="spin-btn" class="btn-spin" ${y<10||_?"disabled":""}>
          🎰 Roulette <span class="spin-cost">-10 pts</span>
        </button>
        ${_&&E?`<button id="zone-btn" class="btn-zone ${k?"active":""}">💣 ZONE 3×3 ${k?"— annuler":""}</button>`:""}
        ${_&&!E?'<span class="zone-pending">💣 Zone 3×3 prête pour ton tour</span>':""}
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
    </div>`,X(),document.getElementById("forfeit-btn").onclick=()=>{confirm("Abandonner ? Tu perds la mise !")&&(m({type:"leave_game"}),u="lobby",f())};const e=document.getElementById("spin-btn");e&&(e.onclick=()=>{$.play("spin"),m({type:"spin"})});const n=document.getElementById("zone-btn");n&&(n.onclick=()=>{k=!k,D()}),P(),ie()}function qe(){const e=document.getElementById("turn-indicator");e&&(e.className=`turn-indicator ${E?"my-turn":""}`,e.innerHTML=E?"🎯 À TOI DE TIRER !":"⏳ "+d(g)+" vise...")}function X(){const e=document.getElementById("enemy-grid");if(e){e.innerHTML="";const o=()=>e.querySelectorAll(".zone-target").forEach(s=>s.classList.remove("zone-target")),a=(s,t)=>{o();for(let i=-1;i<=1;i++)for(let r=-1;r<=1;r++){const c=s+i,l=t+r;c>=0&&c<h&&l>=0&&l<h&&e.children[c*h+l]?.classList.add("zone-target")}};for(let s=0;s<h;s++)for(let t=0;t<h;t++){const i=document.createElement("div");i.className="gcell water";const r=j[s][t];r===2&&(i.classList.add("miss"),i.textContent="•"),r===3&&(i.classList.add("hit"),i.textContent="✕"),E&&k?(i.classList.add("clickable"),i.addEventListener("pointerenter",()=>a(s,t)),i.onclick=()=>{!E||!_||($.play("fire"),m({type:"fire_zone",x:t,y:s}),k=!1)}):r===0&&E&&(i.classList.add("clickable"),i.onclick=()=>{E&&($.play("fire"),m({type:"fire",x:t,y:s}))}),e.appendChild(i)}k&&e.addEventListener("pointerleave",o)}const n=document.getElementById("own-grid");if(n){n.innerHTML="";for(let o=0;o<h;o++)for(let a=0;a<h;a++){const s=document.createElement("div");s.className="gcell water";const t=q[o][a];t===1&&s.classList.add("ship"),t===2&&(s.classList.add("miss"),s.textContent="•"),t===3&&(s.classList.add("hit","ship-hit"),s.textContent="✕"),n.appendChild(s)}}}function Ve(e,n,o){O();const a=document.createElement("div");a.className="modal-overlay",a.innerHTML=`
    <div class="modal spin-modal">
      <h3>🎰 ROULETTE DU DESTIN</h3>
      <p class="spin-sub">${n?"Tu as lancé la roulette...":d(g)+" a lancé la roulette..."}</p>
      <div class="wheel-wrap">
        <div class="wheel-arrow">▼</div>
        <div id="spin-wheel" class="wheel">
          <div class="wheel-half wheel-me">TOI</div>
          <div class="wheel-half wheel-opp">${d(g).slice(0,8).toUpperCase()}</div>
        </div>
      </div>
      <p id="spin-verdict" class="spin-verdict"></p>
    </div>`,document.body.appendChild(a),$.play("spin");const s=document.getElementById("spin-wheel"),t=e?90:270,i=Math.random()*100-50,r=5*360+(360-t)+i*.6;requestAnimationFrame(()=>{s.style.transition="transform 2.4s cubic-bezier(0.15, 0.9, 0.25, 1)",s.style.transform=`rotate(${r}deg)`}),setTimeout(()=>{const c=document.getElementById("spin-verdict");c&&(c.textContent=e?"💣 TU GAGNES L'ATTAQUE DE ZONE !":`😈 ${g} gagne l'attaque de zone !`,c.className=`spin-verdict show ${e?"good":"bad"}`),$.play(e?"win":"lose")},2500),setTimeout(()=>{a.remove(),o()},4200)}function F(e,n,o,a){const s=document.getElementById(e);if(!s)return;const t=s.children[o*h+n];t&&(t.classList.add(a?"explode":"splash"),setTimeout(()=>t.classList.remove("explode","splash"),700))}function Ce(){H.innerHTML=`
    <div class="gameover-screen ${L?"win":"lose"}">
      <div class="go-icon">${L?"🏆":"💀"}</div>
      <h1>${L?"VICTOIRE !":"DÉFAITE"}</h1>
      <p class="go-detail">
        ${K?d(g)+" a abandonné !":L?"Tu as coulé toute la flotte de "+d(g)+" !":d(g)+" a coulé toute ta flotte..."}
      </p>
      ${Q>0?`<p class="go-points ${L?"gain":"loss"}">${L?"+":"-"}${Q} points</p>`:""}
      <p class="go-balance">Solde : <strong>${y} pts</strong></p>
      <div class="gameover-btns">
        ${K?"":'<button id="rematch-btn" class="btn-primary btn-glow">🔄 REVANCHE</button>'}
        <button id="lobby-btn" class="btn-action">⚓ Retour au port</button>
      </div>
    </div>`;const e=document.getElementById("rematch-btn");e&&(e.onclick=()=>{m({type:"rematch"}),v("Revanche proposée, en attente..."),e.setAttribute("disabled","true"),e.textContent="⏳ En attente..."}),document.getElementById("lobby-btn").onclick=()=>{m({type:"leave_game"}),u="lobby",f()}}function P(){const e=document.getElementById("join-chat-msgs");e&&(e.innerHTML=I.filter(s=>s.scope==="lobby").slice(-15).map(s=>le(s)).join("")||'<p class="empty-msg">Silence radio pour le moment...</p>',e.scrollTop=e.scrollHeight);const n=document.getElementById("chat-messages");if(!n)return;const o=u==="battle"||u==="placement"?"game":u==="spectate"?"spec":"lobby",a=I.filter(s=>s.scope===o);n.innerHTML=a.map((s,t)=>le(s,t)).join(""),n.scrollTop=n.scrollHeight,n.querySelectorAll(".chat-reply-btn").forEach(s=>{s.addEventListener("click",t=>{t.stopPropagation();const i=s.closest(".chat-msg"),r=parseInt(i?.dataset.i||"0"),c=a[r];c&&(M={id:c.id||"",from:c.from,text:c.text}),U()})}),n.querySelectorAll(".chat-mention").forEach(s=>{s.addEventListener("click",()=>{const t=s.getAttribute("data-name")||"";for(let i=a.length-1;i>=0;i--)if(a[i].from===t){const r=n.children[i];r&&(r.scrollIntoView({behavior:"smooth",block:"center"}),r.classList.add("msg-flash"),setTimeout(()=>r.classList.remove("msg-flash"),1800));return}v(`${t} n'a pas de message récent ici`)})})}function le(e,n){const o=e.from===w,a=e.replyTo?`<div class="reply-quote"><span class="reply-quote-bar"></span><span class="reply-quote-text">${d(e.replySnip||"")}</span></div>`:"",s=Re(e.text),t=n!==void 0?` data-i="${n}"`:"";return`<div class="chat-msg ${o?"mine":""}"${t}>
    ${a}
    <span class="chat-from">${d(e.from)}</span>
    <span class="chat-text">${s}</span>
    <button class="chat-reply-btn" title="Répondre">↩</button>
  </div>`}function Re(e){return e.replace(/(^| )@([a-zA-Z0-9_-]+)/g,(n,o,a)=>`${o}<span class="chat-mention" data-name="${ce(a)}">@${d(a)}</span>`)}function U(){if(document.getElementById("reply-bar")?.remove(),!M)return;const e=document.querySelector(".chat-input")?.parentElement;if(!e)return;const n=document.createElement("div");n.id="reply-bar",n.className="reply-bar",n.innerHTML=`
    <div class="reply-bar-top"></div>
    <span class="reply-bar-label">Répondre à <strong>${d(M.from)}</strong></span>
    <span class="reply-bar-snip">${d(M.text.slice(0,50))}${M.text.length>50?"…":""}</span>
    <button class="reply-bar-cancel">✕</button>
  `,e.insertBefore(n,e.firstChild),n.querySelector(".reply-bar-cancel").addEventListener("click",()=>{M=null,U()})}function ie(){const e=document.getElementById("chat-inp"),n=document.getElementById("chat-send-btn");if(!e||!n)return;const o=()=>{const a=e.value.trim();if(!a)return;const s={type:"chat",text:a};M&&(s.replyTo=M.id,M=null,U()),m(s),e.value=""};n.onclick=o,e.onkeydown=a=>{a.key==="Enter"&&o()},U()}let re;function v(e){document.querySelectorAll(".toast").forEach(o=>o.remove()),clearTimeout(re);const n=document.createElement("div");n.className="toast",n.textContent=e,document.body.appendChild(n),re=setTimeout(()=>n.remove(),2800)}function d(e){const n=document.createElement("div");return n.textContent=e,n.innerHTML}let ee=[],V="",C="",te=A(),ne=A(),be=[],ae="",G=null,se="";function _e(){H.innerHTML=`<div class="spectate-screen">
    <header class="battle-header">
      <span class="vs-text">${d(V)} <span class="vs">VS</span> ${d(C)}</span>
      <button id="unspectate-btn" class="btn-danger">Quitter</button>
    </header>
    <div class="turn-indicator">Tour de ${d(ae)}</div>
    <div class="spectate-grids">
      <div class="battle-section"><h3>${d(V)}</h3><div id="spec-grid-1" class="grid spec-grid"></div></div>
      <div class="battle-section"><h3>${d(C)}</h3><div id="spec-grid-2" class="grid spec-grid"></div></div>
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
    <div class="chat-panel panel">
      <h3>💬 Chat spectateurs</h3>
      <div id="chat-messages" class="chat-msgs"></div>
      <div class="chat-input">
        <input id="chat-inp" type="text" placeholder="Votre message..." maxlength="300" autocomplete="off" />
        <button id="chat-send-btn">➤</button>
      </div>
    </div>
  </div>`,he(),document.getElementById("unspectate-btn").onclick=()=>{m({type:"unspectate"}),u="lobby",f()},Pe(),fe(),P(),ie()}function he(){const e=document.getElementById("spec-grid-1");e&&de(e,te);const n=document.getElementById("spec-grid-2");n&&de(n,ne)}function de(e,n){e.innerHTML="";for(let o=0;o<h;o++)for(let a=0;a<h;a++){const s=document.createElement("div");s.className="gcell water";const t=n[o][a];t===1&&s.classList.add("ship"),t===2&&(s.classList.add("miss"),s.textContent="•"),t===3&&(s.classList.add("hit","ship-hit"),s.textContent="✕"),e.appendChild(s)}}function Pe(){const e=document.getElementById("spec-events");e&&(e.innerHTML=be.slice(-10).reverse().map(n=>{const o=n.player===0?V:C,a=n.data||{};return`<div class="spec-event">${a.result==="hit"?"🎯":a.result==="sunk"?"💥":"💧"} <strong>${d(o)}</strong> ${a.x},${a.y} ${a.ship||""}</div>`}).join(""))}function fe(){const e=document.getElementById("spec-odds"),n=document.getElementById("spec-bet-btns");!e||!n||!G||(e.innerHTML=`<span class="odd-chip">${d(V)}: ${G.odds0}x</span><span class="odd-chip">${d(C)}: ${G.odds1}x</span>`,n.innerHTML=`
    <button class="btn-bet" data-kind="match_winner" data-pick="1">Parier sur ${d(V)}</button>
    <button class="btn-bet" data-kind="match_winner" data-pick="2">Parier sur ${d(C)}</button>
    <button class="btn-bet" data-kind="next_hit" data-pick="1">Prochain hit: ${d(V)}</button>
    <button class="btn-bet" data-kind="next_hit" data-pick="2">Prochain hit: ${d(C)}</button>
  `,n.querySelectorAll(".btn-bet").forEach(o=>o.addEventListener("click",()=>{const a=o.dataset.kind,s=parseInt(o.dataset.pick);He(a,s)})))}function He(e,n){O();const o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`<div class="modal">
    <h3>🎲 Pari: ${e.replace("_"," ")}</h3>
    <p>Tu paries sur <strong>${d(n===1?V:C)}</strong></p>
    <label>Mise (max ${y} pts)</label>
    <input id="bet-amount" type="number" min="5" max="${y}" value="10" inputmode="numeric"/>
    <div class="modal-btns">
      <button id="bet-cancel">Annuler</button>
      <button id="bet-ok" class="btn-primary">PARIER</button>
    </div>
  </div>`,document.body.appendChild(o),o.onclick=a=>a.target===o&&o.remove(),document.getElementById("bet-cancel").onclick=()=>o.remove(),document.getElementById("bet-ok").onclick=()=>{const a=Math.min(y,Math.max(5,+document.getElementById("bet-amount").value||10));m({type:"bet",gameId:se,kind:e,pick:n,amount:a}),y-=a,o.remove()}}function ce(e){return e.replace(/"/g,"&quot;").replace(/</g,"&lt;")}window.addEventListener("error",e=>{m({type:"client_log",level:"error",message:`${e.message} @ ${e.filename}:${e.lineno}`})});window.addEventListener("unhandledrejection",e=>{m({type:"client_log",level:"error",message:`unhandled rejection: ${e.reason}`})});ue();f();
