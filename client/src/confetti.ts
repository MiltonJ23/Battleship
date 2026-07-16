export function confetti(el: HTMLElement) {
  const colors = ["#00f0ff", "#ff0055", "#ffe600", "#00ff88", "#ff6600", "#cc00ff"];
  for (let i = 0; i < 60; i++) {
    const particle = document.createElement("div");
    particle.style.cssText = `
      position:fixed;width:8px;height:8px;border-radius:50%;
      background:${colors[i % colors.length]};pointer-events:none;z-index:9999;
      left:${Math.random() * 100}%;top:${Math.random() * 100}%;
      animation: confettiFall ${1 + Math.random() * 2}s ease-out forwards;
      animation-delay:${Math.random() * 0.5}s;
      opacity:1;
    `;
    el.appendChild(particle);
    setTimeout(() => particle.remove(), 3000);
  }
}
