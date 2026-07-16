(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const t of s)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function o(s){const t={};return s.integrity&&(t.integrity=s.integrity),s.referrerPolicy&&(t.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?t.credentials="include":s.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function a(s){if(s.ep)return;s.ep=!0;const t=o(s);fetch(s.href,t)}})();class Ee{ctx=null;getCtx(){return this.ctx||(this.ctx=new AudioContext),this.ctx}play(n){try{const o=this.getCtx(),a=o.createOscillator(),s=o.createGain();a.connect(s),s.connect(o.destination);const t=o.currentTime;switch(n){case"tick":{a.type="square",a.frequency.setValueAtTime(1200,t),s.gain.setValueAtTime(.05,t),s.gain.exponentialRampToValueAtTime(.001,t+.04),a.start(t),a.stop(t+.04);break}case"spin":{for(let c=0;c<20;c++){const l=t+Math.pow(c/20,1.6)*2.2,p=o.createOscillator(),b=o.createGain();p.connect(b),b.connect(o.destination),p.type="square",p.frequency.setValueAtTime(1e3+Math.random()*300,l),b.gain.setValueAtTime(.05,l),b.gain.exponentialRampToValueAtTime(.001,l+.04),p.start(l),p.stop(l+.05)}break}case"zone":{for(let c=0;c<5;c++){const l=t+c*.12,p=o.createOscillator(),b=o.createGain();p.connect(b),b.connect(o.destination),p.type="sawtooth",p.frequency.setValueAtTime(160-c*15,l),p.frequency.exponentialRampToValueAtTime(40,l+.35),b.gain.setValueAtTime(.18,l),b.gain.exponentialRampToValueAtTime(.001,l+.4),p.start(l),p.stop(l+.4)}break}case"fire":a.type="sawtooth",a.frequency.setValueAtTime(150,t),a.frequency.exponentialRampToValueAtTime(60,t+.15),s.gain.setValueAtTime(.15,t),s.gain.exponentialRampToValueAtTime(.001,t+.2),a.start(t),a.stop(t+.2);break;case"hit":a.type="square",a.frequency.setValueAtTime(200,t),a.frequency.exponentialRampToValueAtTime(80,t+.4),s.gain.setValueAtTime(.2,t),s.gain.exponentialRampToValueAtTime(.001,t+.5),a.start(t),a.stop(t+.5);const i=o.createOscillator(),r=o.createGain();i.connect(r),r.connect(o.destination),i.type="triangle",i.frequency.setValueAtTime(400,t),i.frequency.exponentialRampToValueAtTime(100,t+.3),r.gain.setValueAtTime(.1,t),r.gain.exponentialRampToValueAtTime(.001,t+.35),i.start(t),i.stop(t+.35);break;case"sunk":for(let c=0;c<3;c++){const l=o.createOscillator(),p=o.createGain();l.connect(p),p.connect(o.destination),l.type="sawtooth",l.frequency.setValueAtTime(100-c*30,t+c*.15),l.frequency.exponentialRampToValueAtTime(30,t+c*.15+.5),p.gain.setValueAtTime(.2,t+c*.15),p.gain.exponentialRampToValueAtTime(.001,t+c*.15+.6),l.start(t+c*.15),l.stop(t+c*.15+.6)}break;case"miss":a.type="sine",a.frequency.setValueAtTime(600,t),a.frequency.exponentialRampToValueAtTime(300,t+.15),s.gain.setValueAtTime(.05,t),s.gain.exponentialRampToValueAtTime(.001,t+.2),a.start(t),a.stop(t+.2);break;case"win":[523,659,784,1047].forEach((c,l)=>{const p=o.createOscillator(),b=o.createGain();p.connect(b),b.connect(o.destination),p.type="triangle",p.frequency.setValueAtTime(c,t+l*.15),b.gain.setValueAtTime(.15,t+l*.15),b.gain.exponentialRampToValueAtTime(.001,t+l*.15+.4),p.start(t+l*.15),p.stop(t+l*.15+.4)});break;case"lose":[400,300,250,200].forEach((c,l)=>{const p=o.createOscillator(),b=o.createGain();p.connect(b),b.connect(o.destination),p.type="sawtooth",p.frequency.setValueAtTime(c,t+l*.2),b.gain.setValueAtTime(.12,t+l*.2),b.gain.exponentialRampToValueAtTime(.001,t+l*.2+.5),p.start(t+l*.2),p.stop(t+l*.2+.5)});break}}catch{}}}const E=new Ee;function $e(e){const n=["#00f0ff","#ff0055","#ffe600","#00ff88","#ff6600","#cc00ff"];for(let o=0;o<60;o++){const a=document.createElement("div");a.style.cssText=`
      position:fixed;width:8px;height:8px;border-radius:50%;
      background:${n[o%n.length]};pointer-events:none;z-index:9999;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation: confettiFall ${1+Math.random()*2}s ease-out forwards;
      animation-delay:${Math.random()*.5}s;
      opacity:1;
    `,e.appendChild(a),setTimeout(()=>a.remove(),3e3)}}const f=10,C=[5,4,3,3,2];let u="join",k="",h=0,J=0,Q=0,G=0,g="",Z=0,$=!1,z=!1,K=[],me=[],T=[],M=!0,D=A(),q=A(),B=!1,Y=0,X=!1,H=!1,w=!1,L=[],S=null,I=null,_;function A(){return Array.from({length:f},()=>Array(f).fill(0))}function be(){const e=location.protocol==="https:"?"wss":"ws";_=new WebSocket(`${e}://${location.host}/ws`),_.onopen=()=>{if(k&&u!=="join")m({type:"join",name:k});else{const n=sessionStorage.getItem("bs_name");n&&u==="join"&&(k=n,m({type:"join",name:n}))}},_.onmessage=n=>{try{Te(JSON.parse(n.data))}catch{}},_.onclose=()=>{setTimeout(be,2e3)}}function m(e){_&&_.readyState===WebSocket.OPEN&&_.send(JSON.stringify(e))}function Te(e){switch(e.type){case"joined":k=e.name,h=e.points,J=e.wins,Q=e.losses,sessionStorage.setItem("bs_name",k),u="lobby",m({type:"loan_status"}),v();break;case"lobby_update":K=e.players||[],me=e.leaderboard||[],e.me&&(h=e.me.points,J=e.me.wins,Q=e.me.losses),u==="lobby"&&v();break;case"challenge_sent":y(`Défi envoyé à ${e.target} — mise ${e.wager} pts ⏳`);break;case"challenge_received":Be(e.challenger,e.wager);break;case"challenge_declined":y(`${e.target} a refusé ton défi 😤`);break;case"game_start":g=e.opponent,Z=e.wager,G=e.playerIdx??0,T=[],M=!0,$=!1,z=!1,H=!1,w=!1,D=A(),q=A(),L=L.filter(a=>a.scope!=="game"),u="placement",v();break;case"ships_accepted":z=!0,u==="placement"&&v();break;case"opponent_ready":y(`${g} est prêt ! ⚓`);break;case"battle_start":$=!!e.yourTurn,u="battle",v();break;case"fire_result":{const{x:a,y:s,result:t,ship:i,shooter:r}=e,c=t==="hit"||t==="sunk";r===G?(D[s][a]=c?3:2,E.play(t==="sunk"?"sunk":c?"hit":"miss"),t==="sunk"?y(`💥 ${i} ennemi coulé !`):c&&y("🎯 Touché !")):(q[s][a]=c?3:2,E.play(c?"hit":"miss"),t==="sunk"&&y(`☠️ Ton ${i} a été coulé...`)),$=!!e.yourTurn,u==="battle"&&!e.gameOver&&(Ve(),te(),W(r===G?"enemy-grid":"own-grid",a,s,c));break}case"loan_approved":typeof e.newPoints=="number"&&(h=e.newPoints),I={principal:e.amount,remaining:e.amount+e.amount*e.rate/100,rate:e.rate,installment:e.installment||0,repaid:0},y(`🏦 Prêt de ${e.amount} pts accordé ! Taux: ${e.rate}%. Nouveau solde: ${h} pts`),u==="lobby"&&v();break;case"loan_status":I={principal:e.principal,remaining:e.remaining,rate:e.rate,installment:e.installment||0,repaid:e.repaid},u==="lobby"&&v();break;case"game_over":B=!!e.won,Y=e.pointsEarned||0,X=e.reason==="forfeit",typeof e.newPoints=="number"&&(h=e.newPoints),u="gameover",E.play(B?"win":"lose"),v(),B&&setTimeout(()=>$e(document.body),200);break;case"rematch_requested":y(`${g} veut une revanche ! 🔄`);break;case"opponent_left":y(`${g} a quitté`),u==="gameover"&&v();break;case"spin_result":typeof e.spinnerPoints=="number"&&e.youSpun&&(h=e.spinnerPoints),Re(!!e.youBenefit,!!e.youSpun,()=>{e.youBenefit?(H=!0,y("💣 Attaque de zone 3×3 débloquée !")):y(`😱 ${g} a gagné l'attaque de zone !`),u==="battle"&&U()});break;case"zone_result":{const a=e.shooter===G;E.play("zone");let s=[];(e.cells||[]).forEach((t,i)=>{const{x:r,y:c,result:l}=t;if(l==="skip")return;const p=l==="hit"||l==="sunk";l==="sunk"&&t.ship&&s.push(t.ship),setTimeout(()=>{a?D[c][r]=p?3:2:q[c][r]=p?3:2,u==="battle"&&(te(),W(a?"enemy-grid":"own-grid",r,c,p))},i*110)}),a&&(H=!1,w=!1),$=!!e.yourTurn,setTimeout(()=>{s.length&&(y(a?`💥 Coulé : ${s.join(", ")} !`:`☠️ Coulé : ${s.join(", ")}...`),E.play("sunk")),u==="battle"&&!e.gameOver&&U()},1100);break}case"chat_history":case"live_matches":ne=e.matches||[],u==="lobby"&&xe();break;case"spectate_start":V=e.p1,R=e.p2,ae=e.board1||A(),se=e.board2||A(),fe=e.events||[],oe=e.turnName,ie=e.gameId||ie,N=0,u="spectate",v();break;case"spectate_fire":{const{x:a,y:s,result:t,shooter:i}=e,r=t==="hit"||t==="sunk",c=i===0?se:ae;c[s][a]=r?3:2,oe=e.turnName,u==="spectate"&&(he(),setTimeout(()=>W("spec-grid-"+(i===0?2:1),a,s,r),100));break}case"spectate_end":u="lobby",v();break;case"bets_resolved":y(`⚡ Paris résolus : ${e.kind}`);break;case"chat":L.push({id:e.id,from:e.from,text:e.text,scope:e.scope||"lobby",replyTo:e.replyTo||void 0,replySnip:e.replySnip||void 0}),L.length>150&&L.shift(),P();break;case"mention":E.play("hit");const n=e.text.slice(0,60)+(e.text.length>60?"…":""),o=document.createElement("div");o.className="toast toast-mention",o.innerHTML=`🔔 <strong>${d(e.from)}</strong> t'a mentionné<br/><em>${d(n)}</em>`,o.onclick=()=>{if(u==="battle"||u==="placement")return;const a=document.getElementById("chat-messages");a&&(a.scrollTop=a.scrollHeight)},document.body.appendChild(o),setTimeout(()=>o.remove(),3500),L.length<150&&L.push({from:e.from,text:e.text,scope:"lobby"}),P();break;case"odds":x={kind:e.kind||"",odds0:e.odds0||0,odds1:e.odds1||0},u==="spectate"&&ye();break;case"bet_placed":N-=e.amount,u==="spectate"&&ce(),y(`🎲 Pari placé : ${e.kind} → mise ${e.amount} pts, cote ${e.odds}x`);break;case"bet_won":h+=e.amount||0,N+=e.amount||0,u==="spectate"&&ce(),y(`💰 Pari gagné ! +${e.amount} pts (${e.kind})`),u==="lobby"&&v();break;case"error":y(`⚠️ ${e.message}`);break}}const O=document.getElementById("app");function v(){switch(u){case"join":ke();break;case"lobby":we();break;case"placement":Me();break;case"battle":U();break;case"gameover":_e();break;case"spectate":He();break}}function ke(){const e=sessionStorage.getItem("bs_name")||"";O.innerHTML=`
    <div class="join-screen">
      <div class="ocean-waves"></div>
      <div class="join-content">
        <div class="logo-anchor">⚓</div>
        <h1 class="game-title">BATAILLE<br/>NAVALE</h1>
        <p class="tagline">Duels · Mises · Gloire</p>
        <div class="join-form">
          <input id="name-input" type="text" placeholder="Ton pseudo, capitaine" maxlength="20" value="${re(e)}" autocomplete="off" />
          <button id="join-btn" class="btn-primary btn-glow">⚔️ ENTRER AU COMBAT</button>
        </div>
        <p class="hint">100 points offerts aux nouveaux capitaines</p>
        <div class="join-chat panel">
          <h3>💬 Ça discute au port...</h3>
          <div id="join-chat-msgs" class="chat-msgs join-chat-msgs"></div>
        </div>
      </div>
    </div>`;const n=document.getElementById("name-input"),o=()=>{const a=n.value.trim();a&&(k=a,m({type:"join",name:a}))};document.getElementById("join-btn").onclick=o,n.onkeydown=a=>{a.key==="Enter"&&o()},e&&(k=e,setTimeout(()=>m({type:"join",name:e}),100)),n.focus(),P()}function we(){O.innerHTML=`
    <div class="lobby-screen">
      <header class="lobby-header">
        <div class="header-left">
          <span class="header-logo">⚓</span>
          <span class="header-title">BATAILLE NAVALE</span>
        </div>
        <div class="my-badge">
          <span class="badge-name">${d(k)}</span>
          <span class="badge-points">💰 ${h} pts</span>
          <span class="badge-record">${J}V / ${Q}D</span>
        </div>
        ${Ie()}
      </header>
      <div class="lobby-body">
        <section class="panel players-panel">
          <h2>🌊 Capitaines en ligne <span class="count">${K.length}</span></h2>
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
    </div>`;const e=document.getElementById("lb-list"),n=["🥇","🥈","🥉"];e.innerHTML=me.map((t,i)=>`
    <li class="${t.name===k?"me":""}">
      <span class="lb-rank">${n[i]||i+1}</span>
      <span class="lb-name">${d(t.name)}</span>
      <span class="lb-pts">${t.points}</span>
    </li>`).join("");const o=document.getElementById("player-list"),a=K.filter(t=>t.name!==k);o.innerHTML=a.length?a.map(t=>`
    <div class="player-row ${t.inGame?"ingame":""}">
      <div class="p-avatar">${t.name[0].toUpperCase()}</div>
      <div class="p-info">
        <span class="p-name">${d(t.name)}</span>
        <span class="p-stats">${t.points} pts · ${t.wins}V/${t.losses}D</span>
      </div>
      ${t.inGame?'<span class="p-status">⚔️ En duel</span>':`<button class="btn-challenge" data-target="${re(t.name)}">DÉFIER</button>`}
    </div>`).join(""):`<p class="empty-msg">Personne d'autre en ligne...<br/>Partage l'adresse à tes amis !</p>`,o.querySelectorAll(".btn-challenge").forEach(t=>{t.addEventListener("click",()=>Ae(t.dataset.target))}),P(),le();const s=document.getElementById("borrow-btn");s&&(s.onclick=Le),m({type:"loan_status"}),m({type:"live_matches"})}function xe(){const e=document.getElementById("live-matches");if(e){if(ne.length===0){e.innerHTML='<p class="empty-msg">Pas de match en cours</p>';return}e.innerHTML=ne.map(n=>`
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
  `).join(""),e.querySelectorAll(".btn-challenge").forEach(n=>{n.addEventListener("click",()=>m({type:"spectate",gameId:n.dataset.game}))})}}function Ie(){if(!I)return h<75?'<div class="loan-cta"><button id="borrow-btn" class="btn-spin">🏦 Emprunter à la banque</button></div>':"";const e=Math.round((1-I.remaining/(I.principal*(1+I.rate/100)))*100);return`<div class="loan-cta"><span class="loan-status">🏦 Dette: ${I.remaining} pts (${e}% remboursé${I.installment>0?` · -${I.installment}/victoire`:" · en une fois"})</span></div>`}function Ae(e){j();const n=document.createElement("div");n.className="modal-overlay",n.innerHTML=`
    <div class="modal">
      <h3>⚔️ Défier ${d(e)}</h3>
      <label>Mise (tu as ${h} pts)</label>
      <div class="wager-quick">
        <button data-w="0">Amical</button>
        <button data-w="10">10</button>
        <button data-w="25">25</button>
        <button data-w="50">50</button>
      </div>
      <input id="wager-input" type="number" min="0" max="${h}" value="10" inputmode="numeric" />
      <div class="modal-btns">
        <button id="wager-cancel">Annuler</button>
        <button id="wager-ok" class="btn-primary">ENVOYER LE DÉFI</button>
      </div>
    </div>`,document.body.appendChild(n),n.onclick=o=>o.target===n&&n.remove(),n.querySelectorAll(".wager-quick button").forEach(o=>{o.onclick=()=>{document.getElementById("wager-input").value=o.dataset.w}}),document.getElementById("wager-cancel").onclick=()=>n.remove(),document.getElementById("wager-ok").onclick=()=>{const o=+document.getElementById("wager-input").value||0,a=Math.max(0,Math.min(h,o));m({type:"challenge",target:e,wager:a}),n.remove()}}function Le(){if(I){y("Tu as déjà un prêt en cours !");return}j();const e=document.createElement("div");e.className="modal-overlay",e.innerHTML=`
    <div class="modal">
      <h3>🏦 Banque du Port</h3>
      <p style="color:var(--text-dim);font-size:14px">Solde actuel : ${h} pts</p>
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
    </div>`,document.body.appendChild(e),e.onclick=n=>n.target===e&&e.remove(),e.querySelectorAll(".wager-quick button").forEach(n=>{n.onclick=()=>{document.getElementById("loan-amount").value=n.dataset.m}}),document.getElementById("loan-cancel").onclick=()=>e.remove(),document.getElementById("loan-ok").onclick=()=>{const n=+document.getElementById("loan-amount").value||100;let o=+document.getElementById("loan-rate").value||10;const a=+document.getElementById("loan-installment").value||0;a>0&&(o+=10),m({type:"borrow",amount:n,rate:o,installment:a}),e.remove()}}function Be(e,n){j();const o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`
    <div class="modal modal-challenge">
      <div class="challenge-icon">⚔️</div>
      <h3>DÉFI REÇU !</h3>
      <p><strong>${d(e)}</strong> te défie en duel</p>
      <p class="wager-display">Mise : <strong>${n} pts</strong></p>
      <div class="modal-btns">
        <button id="ch-decline">Refuser</button>
        <button id="ch-accept" class="btn-primary btn-glow">ACCEPTER</button>
      </div>
    </div>`,document.body.appendChild(o),document.getElementById("ch-decline").onclick=()=>{m({type:"decline_challenge",challenger:e}),o.remove()},document.getElementById("ch-accept").onclick=()=>{m({type:"accept_challenge",challenger:e}),o.remove()}}function j(){document.querySelectorAll(".modal-overlay").forEach(e=>e.remove())}function Me(){const e=T.length,n=e===C.length;if(O.innerHTML=`
    <div class="place-screen">
      <header class="battle-header">
        <span class="vs-text">${d(k)} <span class="vs">VS</span> ${d(g)}</span>
        <span class="wager-badge">💰 ${Z} pts</span>
      </header>
      <h2 class="phase-title">${z?"⏳ En attente de "+d(g)+"...":"⚓ Déploie ta flotte"}</h2>
      ${z?'<div class="waiting-spinner"></div>':`
      <div class="place-progress">${C.map((s,t)=>`<span class="prog-dot ${t<e?"done":t===e?"current":""}">${s}</span>`).join("")}</div>
      <div id="place-grid" class="grid place-grid"></div>
      <div class="place-actions">
        <button id="rotate-btn" class="btn-action">↻ ${M?"Horizontal":"Vertical"}</button>
        <button id="random-btn" class="btn-action">🎲 Aléatoire</button>
        ${e>0&&!n?'<button id="reset-btn" class="btn-action">🗑️ Effacer</button>':""}
        ${n?'<button id="confirm-btn" class="btn-primary btn-glow">✓ PRÊT AU COMBAT</button>':""}
      </div>
      ${n?"":`<p class="help-text">Touche la grille pour placer le bateau de ${C[e]} cases</p>`}
      `}
    </div>`,z)return;qe(),document.getElementById("rotate-btn").onclick=()=>{M=!M,v()},document.getElementById("random-btn").onclick=()=>{Ce(),v()};const o=document.getElementById("reset-btn");o&&(o.onclick=()=>{T=[],q=A(),v()});const a=document.getElementById("confirm-btn");a&&(a.onclick=()=>{m({type:"place_ships",ships:T}),E.play("fire")})}function Se(){const e=new Set;return T.forEach((n,o)=>{for(let a=0;a<C[o];a++){const s=n.horiz?n.row:n.row+a,t=n.horiz?n.col+a:n.col;e.add(`${s},${t}`)}}),e}function ee(e,n,o,a){const s=Se();for(let t=0;t<o;t++){const i=a?e:e+t,r=a?n+t:n;if(i<0||i>=f||r<0||r>=f||s.has(`${i},${r}`))return!1}return!0}function ve(){q=A(),T.forEach((e,n)=>{for(let o=0;o<C[n];o++){const a=e.horiz?e.row:e.row+o,s=e.horiz?e.col+o:e.col;q[a][s]=1}})}function Ce(){T=[];for(const e of C)for(let n=0;n<500;n++){const o=Math.random()>.5,a=Math.floor(Math.random()*f),s=Math.floor(Math.random()*f);if(ee(a,s,e,o)){T.push({row:a,col:s,horiz:o});break}}ve()}function qe(){const e=document.getElementById("place-grid");if(!e)return;ve();const n=T.length<C.length?C[T.length]:0;e.innerHTML="";const o=()=>e.querySelectorAll(".preview, .preview-bad").forEach(s=>s.classList.remove("preview","preview-bad")),a=(s,t)=>{if(o(),!n)return;const i=ee(s,t,n,M);for(let r=0;r<n;r++){const c=M?s:s+r,l=M?t+r:t;c>=0&&c<f&&l>=0&&l<f&&e.children[c*f+l]?.classList.add(i?"preview":"preview-bad")}};for(let s=0;s<f;s++)for(let t=0;t<f;t++){const i=document.createElement("div");i.className="gcell",q[s][t]===1&&(i.classList.add("ship"),i.classList.add("removable")),i.addEventListener("pointerenter",()=>a(s,t)),i.addEventListener("click",()=>{if(q[s][t]===1){const r=T.findIndex((c,l)=>{for(let p=0;p<C[l];p++){const b=c.horiz?c.row:c.row+p,ge=c.horiz?c.col+p:c.col;if(b===s&&ge===t)return!0}return!1});r>=0&&(T.splice(r,1),E.play("miss"),v());return}n&&ee(s,t,n,M)&&(T.push({row:s,col:t,horiz:M}),E.play("miss"),v())}),e.appendChild(i)}e.addEventListener("pointerleave",o)}function U(){O.innerHTML=`
    <div class="battle-screen">
      <header class="battle-header">
        <span class="vs-text">${d(k)} <span class="vs">VS</span> ${d(g)}</span>
        <span class="wager-badge">💰 ${Z} pts</span>
        <span class="points-badge">Solde : ${h} pts</span>
      </header>
      <div id="turn-indicator" class="turn-indicator ${$?"my-turn":""}">
        ${$?w?"💣 CHOISIS LE CENTRE DE LA ZONE 3×3":"🎯 À TOI DE TIRER !":"⏳ "+d(g)+" vise..."}
      </div>
      <div class="battle-grids">
        <div class="battle-section enemy-section">
          <h3>🎯 Flotte de ${d(g)}</h3>
          <div id="enemy-grid" class="grid enemy-grid ${w?"zone-mode":""}"></div>
        </div>
        <div class="battle-section own-section">
          <h3>🛡️ Ta flotte</h3>
          <div id="own-grid" class="grid own-grid small"></div>
        </div>
      </div>
      <div class="power-bar">
        <button id="spin-btn" class="btn-spin" ${h<10||H?"disabled":""}>
          🎰 Roulette <span class="spin-cost">-10 pts</span>
        </button>
        ${H&&$?`<button id="zone-btn" class="btn-zone ${w?"active":""}">💣 ZONE 3×3 ${w?"— annuler":""}</button>`:""}
        ${H&&!$?'<span class="zone-pending">💣 Zone 3×3 prête pour ton tour</span>':""}
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
    </div>`,te(),document.getElementById("forfeit-btn").onclick=()=>{confirm("Abandonner ? Tu perds la mise !")&&(m({type:"leave_game"}),u="lobby",v())};const e=document.getElementById("spin-btn");e&&(e.onclick=()=>{E.play("spin"),m({type:"spin"})});const n=document.getElementById("zone-btn");n&&(n.onclick=()=>{w=!w,U()}),P(),le()}function Ve(){const e=document.getElementById("turn-indicator");e&&(e.className=`turn-indicator ${$?"my-turn":""}`,e.innerHTML=$?"🎯 À TOI DE TIRER !":"⏳ "+d(g)+" vise...")}function te(){const e=document.getElementById("enemy-grid");if(e){e.innerHTML="";const o=()=>e.querySelectorAll(".zone-target").forEach(s=>s.classList.remove("zone-target")),a=(s,t)=>{o();for(let i=-1;i<=1;i++)for(let r=-1;r<=1;r++){const c=s+i,l=t+r;c>=0&&c<f&&l>=0&&l<f&&e.children[c*f+l]?.classList.add("zone-target")}};for(let s=0;s<f;s++)for(let t=0;t<f;t++){const i=document.createElement("div");i.className="gcell water";const r=D[s][t];r===2&&(i.classList.add("miss"),i.textContent="•"),r===3&&(i.classList.add("hit"),i.textContent="✕"),$&&w?(i.classList.add("clickable"),i.addEventListener("pointerenter",()=>a(s,t)),i.onclick=()=>{!$||!H||(E.play("fire"),m({type:"fire_zone",x:t,y:s}),w=!1)}):r===0&&$&&(i.classList.add("clickable"),i.onclick=()=>{$&&(E.play("fire"),m({type:"fire",x:t,y:s}))}),e.appendChild(i)}w&&e.addEventListener("pointerleave",o)}const n=document.getElementById("own-grid");if(n){n.innerHTML="";for(let o=0;o<f;o++)for(let a=0;a<f;a++){const s=document.createElement("div");s.className="gcell water";const t=q[o][a];t===1&&s.classList.add("ship"),t===2&&(s.classList.add("miss"),s.textContent="•"),t===3&&(s.classList.add("hit","ship-hit"),s.textContent="✕"),n.appendChild(s)}}}function Re(e,n,o){j();const a=document.createElement("div");a.className="modal-overlay",a.innerHTML=`
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
    </div>`,document.body.appendChild(a),E.play("spin");const s=document.getElementById("spin-wheel"),t=e?90:270,i=Math.random()*100-50,r=5*360+(360-t)+i*.6;requestAnimationFrame(()=>{s.style.transition="transform 2.4s cubic-bezier(0.15, 0.9, 0.25, 1)",s.style.transform=`rotate(${r}deg)`}),setTimeout(()=>{const c=document.getElementById("spin-verdict");c&&(c.textContent=e?"💣 TU GAGNES L'ATTAQUE DE ZONE !":`😈 ${g} gagne l'attaque de zone !`,c.className=`spin-verdict show ${e?"good":"bad"}`),E.play(e?"win":"lose")},2500),setTimeout(()=>{a.remove(),o()},4200)}function W(e,n,o,a){const s=document.getElementById(e);if(!s)return;const t=s.children[o*f+n];t&&(t.classList.add(a?"explode":"splash"),setTimeout(()=>t.classList.remove("explode","splash"),700))}function _e(){O.innerHTML=`
    <div class="gameover-screen ${B?"win":"lose"}">
      <div class="go-icon">${B?"🏆":"💀"}</div>
      <h1>${B?"VICTOIRE !":"DÉFAITE"}</h1>
      <p class="go-detail">
        ${X?d(g)+" a abandonné !":B?"Tu as coulé toute la flotte de "+d(g)+" !":d(g)+" a coulé toute ta flotte..."}
      </p>
      ${Y>0?`<p class="go-points ${B?"gain":"loss"}">${B?"+":"-"}${Y} points</p>`:""}
      <p class="go-balance">Solde : <strong>${h} pts</strong></p>
      <div class="gameover-btns">
        ${X?"":'<button id="rematch-btn" class="btn-primary btn-glow">🔄 REVANCHE</button>'}
        <button id="lobby-btn" class="btn-action">⚓ Retour au port</button>
      </div>
    </div>`;const e=document.getElementById("rematch-btn");e&&(e.onclick=()=>{m({type:"rematch"}),y("Revanche proposée, en attente..."),e.setAttribute("disabled","true"),e.textContent="⏳ En attente..."}),document.getElementById("lobby-btn").onclick=()=>{m({type:"leave_game"}),u="lobby",v()}}function P(){const e=document.getElementById("join-chat-msgs");e&&(e.innerHTML=L.filter(s=>s.scope==="lobby").slice(-15).map(s=>de(s)).join("")||'<p class="empty-msg">Silence radio pour le moment...</p>',e.scrollTop=e.scrollHeight);const n=document.getElementById("chat-messages");if(!n)return;const o=u==="battle"||u==="placement"?"game":u==="spectate"?"spec":"lobby",a=L.filter(s=>s.scope===o);n.innerHTML=a.map((s,t)=>de(s,t)).join(""),n.scrollTop=n.scrollHeight,n.querySelectorAll(".chat-reply-btn").forEach(s=>{s.addEventListener("click",t=>{t.stopPropagation();const i=s.closest(".chat-msg"),r=parseInt(i?.dataset.i||"0"),c=a[r];c&&(S={id:c.id||"",from:c.from,text:c.text}),F()})}),n.querySelectorAll(".chat-mention").forEach(s=>{s.addEventListener("click",()=>{const t=s.getAttribute("data-name")||"";for(let i=a.length-1;i>=0;i--)if(a[i].from===t){const r=n.children[i];r&&(r.scrollIntoView({behavior:"smooth",block:"center"}),r.classList.add("msg-flash"),setTimeout(()=>r.classList.remove("msg-flash"),1800));return}y(`${t} n'a pas de message récent ici`)})})}function de(e,n){const o=e.from===k,a=e.replyTo?`<div class="reply-quote"><span class="reply-quote-bar"></span><span class="reply-quote-text">${d(e.replySnip||"")}</span></div>`:"",s=Ne(e.text),t=n!==void 0?` data-i="${n}"`:"";return`<div class="chat-msg ${o?"mine":""}"${t}>
    ${a}
    <span class="chat-from">${d(e.from)}</span>
    <span class="chat-text">${s}</span>
    <button class="chat-reply-btn" title="Répondre">↩</button>
  </div>`}function Ne(e){return e.replace(/(^| )@([a-zA-Z0-9_-]+)/g,(n,o,a)=>`${o}<span class="chat-mention" data-name="${re(a)}">@${d(a)}</span>`)}function F(){if(document.getElementById("reply-bar")?.remove(),!S)return;const e=document.querySelector(".chat-input")?.parentElement;if(!e)return;const n=document.createElement("div");n.id="reply-bar",n.className="reply-bar",n.innerHTML=`
    <div class="reply-bar-top"></div>
    <span class="reply-bar-label">Répondre à <strong>${d(S.from)}</strong></span>
    <span class="reply-bar-snip">${d(S.text.slice(0,50))}${S.text.length>50?"…":""}</span>
    <button class="reply-bar-cancel">✕</button>
  `,e.insertBefore(n,e.firstChild),n.querySelector(".reply-bar-cancel").addEventListener("click",()=>{S=null,F()})}function le(){const e=document.getElementById("chat-inp"),n=document.getElementById("chat-send-btn");if(!e||!n)return;const o=()=>{const a=e.value.trim();if(!a)return;const s={type:"chat",text:a};S&&(s.replyTo=S.id,S=null,F()),m(s),e.value=""};n.onclick=o,e.onkeydown=a=>{a.key==="Enter"&&o()},F()}let pe;function y(e){document.querySelectorAll(".toast").forEach(o=>o.remove()),clearTimeout(pe);const n=document.createElement("div");n.className="toast",n.textContent=e,document.body.appendChild(n),pe=setTimeout(()=>n.remove(),2800)}function d(e){const n=document.createElement("div");return n.textContent=e,n.innerHTML}let ne=[],V="",R="",ae=A(),se=A(),fe=[],oe="",x=null,ie="",N=0;function He(){O.innerHTML=`<div class="spectate-screen">
    <header class="battle-header spec-header">
      <span class="vs-text">${d(V)} <span class="vs">VS</span> ${d(R)}</span>
      <span class="wager-badge">💰 ${Z} pts</span>
      <button id="unspectate-btn" class="btn-danger">✕ Quitter</button>
    </header>
    <div class="turn-indicator">Tour de ${d(oe)}</div>
    <div class="spec-grids-top">
      <div class="battle-section"><h3>🛡️ ${d(V)}</h3><div id="spec-grid-1" class="grid spec-grid"></div></div>
      <div class="battle-section"><h3>🎯 ${d(R)}</h3><div id="spec-grid-2" class="grid spec-grid"></div></div>
    </div>
    <div class="spec-bottom-row">
      <div class="spec-pnl card">
        <h3>📊 Mon bilan</h3>
        <div id="spec-balance" class="spec-balance">+0 pts</div>
        <div class="spec-events">
          <h4>Événements</h4>
          <div id="spec-events" class="spec-event-list"></div>
        </div>
      </div>
      <div class="spec-bet-col">
        <div class="spec-bets card">
          <h3>🎲 Bureau des paris</h3>
          <div class="spec-odds-box">
            <div class="odd-card pick0" id="odd-card-0">
              <span>${d(V)}</span>
              <span class="odd-val" id="odd-val-0">--x</span>
            </div>
            <div class="odd-vs">VS</div>
            <div class="odd-card pick1" id="odd-card-1">
              <span>${d(R)}</span>
              <span class="odd-val" id="odd-val-1">--x</span>
            </div>
          </div>
          <div id="spec-bet-btns" class="spec-bet-btns"></div>
        </div>
      </div>
      <div class="chat-panel panel">
        <h3>💬 Chat spectateurs</h3>
        <div id="chat-messages" class="chat-msgs"></div>
        <div class="chat-input">
          <input id="chat-inp" type="text" placeholder="Votre message..." maxlength="300" autocomplete="off" />
          <button id="chat-send-btn">➤</button>
        </div>
      </div>
    </div>
  </div>`,he(),document.getElementById("unspectate-btn").onclick=()=>{m({type:"unspectate"}),u="lobby",v()},Pe(),ye(),ce(),P(),le()}function he(){const e=document.getElementById("spec-grid-1");e&&ue(e,ae);const n=document.getElementById("spec-grid-2");n&&ue(n,se)}function ue(e,n){e.innerHTML="";for(let o=0;o<f;o++)for(let a=0;a<f;a++){const s=document.createElement("div");s.className="gcell water";const t=n[o][a];t===1&&s.classList.add("ship"),t===2&&(s.classList.add("miss"),s.textContent="•"),t===3&&(s.classList.add("hit","ship-hit"),s.textContent="✕"),e.appendChild(s)}}function Pe(){const e=document.getElementById("spec-events");e&&(e.innerHTML=fe.slice(-10).reverse().map(n=>{const o=n.player===0?V:R,a=n.data||{};return`<div class="spec-event">${a.result==="hit"?"🎯":a.result==="sunk"?"💥":"💧"} <strong>${d(o)}</strong> ${a.x},${a.y} ${a.ship||""}</div>`}).join(""))}function ce(){const e=document.getElementById("spec-balance");if(!e)return;const n=N>0?"gain":N<0?"loss":"",o=N>=0?"+":"";e.textContent=o+N+" pts",e.className="spec-balance "+n}function ye(){const e=document.getElementById("spec-bet-btns");if(!e||!x)return;const n=document.getElementById("odd-val-0"),o=document.getElementById("odd-val-1");n&&(n.textContent=x.odds0+"x"),o&&(o.textContent=x.odds1+"x");const a=document.getElementById("odd-card-0"),s=document.getElementById("odd-card-1");a&&(a.className="odd-card pick0"+(x.odds0>x.odds1?" favorite":"")),s&&(s.className="odd-card pick1"+(x.odds1>x.odds0?" favorite":"")),e.innerHTML=`
    <button class="btn-bet btn-bet-main" data-kind="match_winner" data-pick="1">
      🏆 Miser sur ${d(V)}
      <span class="btn-bet-odds">${x.odds0}x</span>
    </button>
    <button class="btn-bet btn-bet-main" data-kind="match_winner" data-pick="2">
      🏆 Miser sur ${d(R)}
      <span class="btn-bet-odds">${x.odds1}x</span>
    </button>
    <div class="bet-separator">Paris express</div>
    <button class="btn-bet btn-bet-quick" data-kind="next_hit" data-pick="1">
      🎯 Prochain hit: ${d(V)}
    </button>
    <button class="btn-bet btn-bet-quick" data-kind="next_hit" data-pick="2">
      🎯 Prochain hit: ${d(R)}
    </button>
  `,e.querySelectorAll(".btn-bet").forEach(t=>t.addEventListener("click",()=>{const i=t.dataset.kind,r=parseInt(t.dataset.pick);Oe(i,r)}))}function Oe(e,n){j();const o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`<div class="modal">
    <h3>🎲 Pari: ${e.replace("_"," ")}</h3>
    <p>Tu paries sur <strong>${d(n===1?V:R)}</strong></p>
    <label>Mise (max ${h} pts)</label>
    <input id="bet-amount" type="number" min="5" max="${h}" value="10" inputmode="numeric"/>
    <div class="modal-btns">
      <button id="bet-cancel">Annuler</button>
      <button id="bet-ok" class="btn-primary">PARIER</button>
    </div>
  </div>`,document.body.appendChild(o),o.onclick=a=>a.target===o&&o.remove(),document.getElementById("bet-cancel").onclick=()=>o.remove(),document.getElementById("bet-ok").onclick=()=>{const a=Math.min(h,Math.max(5,+document.getElementById("bet-amount").value||10));m({type:"bet",gameId:ie,kind:e,pick:n,amount:a}),h-=a,o.remove()}}function re(e){return e.replace(/"/g,"&quot;").replace(/</g,"&lt;")}window.addEventListener("error",e=>{m({type:"client_log",level:"error",message:`${e.message} @ ${e.filename}:${e.lineno}`})});window.addEventListener("unhandledrejection",e=>{m({type:"client_log",level:"error",message:`unhandled rejection: ${e.reason}`})});be();v();
