class GameAudio {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }

  play(type: "fire" | "hit" | "miss" | "sunk" | "win" | "lose" | "spin" | "zone" | "tick") {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      switch (type) {
        case "tick": {
          osc.type = "square";
          osc.frequency.setValueAtTime(1200, now);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }
        case "spin": {
          for (let i = 0; i < 20; i++) {
            const t = now + Math.pow(i / 20, 1.6) * 2.2;
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = "square";
            o.frequency.setValueAtTime(1000 + Math.random() * 300, t);
            g.gain.setValueAtTime(0.05, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
            o.start(t);
            o.stop(t + 0.05);
          }
          break;
        }
        case "zone": {
          for (let i = 0; i < 5; i++) {
            const t = now + i * 0.12;
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = "sawtooth";
            o.frequency.setValueAtTime(160 - i * 15, t);
            o.frequency.exponentialRampToValueAtTime(40, t + 0.35);
            g.gain.setValueAtTime(0.18, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
            o.start(t);
            o.stop(t + 0.4);
          }
          break;
        }
        case "fire":
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        case "hit":
          osc.type = "square";
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);

          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.type = "triangle";
          osc2.frequency.setValueAtTime(400, now);
          osc2.frequency.exponentialRampToValueAtTime(100, now + 0.3);
          gain2.gain.setValueAtTime(0.1, now);
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc2.start(now);
          osc2.stop(now + 0.35);
          break;
        case "sunk":
          for (let i = 0; i < 3; i++) {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = "sawtooth";
            o.frequency.setValueAtTime(100 - i * 30, now + i * 0.15);
            o.frequency.exponentialRampToValueAtTime(30, now + i * 0.15 + 0.5);
            g.gain.setValueAtTime(0.2, now + i * 0.15);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.6);
            o.start(now + i * 0.15);
            o.stop(now + i * 0.15 + 0.6);
          }
          break;
        case "miss":
          osc.type = "sine";
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        case "win":
          [523, 659, 784, 1047].forEach((freq, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = "triangle";
            o.frequency.setValueAtTime(freq, now + i * 0.15);
            g.gain.setValueAtTime(0.15, now + i * 0.15);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4);
            o.start(now + i * 0.15);
            o.stop(now + i * 0.15 + 0.4);
          });
          break;
        case "lose":
          [400, 300, 250, 200].forEach((freq, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = "sawtooth";
            o.frequency.setValueAtTime(freq, now + i * 0.2);
            g.gain.setValueAtTime(0.12, now + i * 0.2);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.5);
            o.start(now + i * 0.2);
            o.stop(now + i * 0.2 + 0.5);
          });
          break;
      }
    } catch {}
  }
}

export const audio = new GameAudio();
