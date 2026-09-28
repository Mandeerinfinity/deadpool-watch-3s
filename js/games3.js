/* Deadpool Watch 3S — four more arcade games plugged into the v2 arcade via DP.games.register:
   Chimichanga Flight (flappy), Claws vs Katana (rhythm duel), Whack-a-Merc (3x3), Taco Trail (snake). All art drawn in code. */
(function () {
  "use strict";
  const G = DP.games, A = G.api, K = DP.core, cx = A.cx, cv = A.cv;
  const { LS, say, pick, ach, egg, stats, saveStats } = K;
  const $ = s => document.querySelector(s);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const best = { flappy: LS.get("best.flappy", 0), duel: LS.get("best.duel", 0), whack: LS.get("best.whack", 0), snake: LS.get("best.snake", 0) };
  Object.assign(G.names, { flappy: "\uD83C\uDF2F CHIMI FLIGHT", duel: "\u2694\uFE0F CLAWS VS KATANA", whack: "\uD83D\uDD28 WHACK-A-MERC", snake: "\uD83C\uDF2E TACO TRAIL" });
  Object.assign(G.units, { snake: " tacos" });
  G.best3 = best;
  function renderBests3() { for (const k in best) { const el = document.getElementById("best_" + k); if (el) el.textContent = best[k] || 0; } }
  K.onEnter("scr-games", renderBests3); renderBests3();
  let topInset = 0; { const p = document.createElement("div"); p.style.cssText = "position:fixed;top:0;height:env(safe-area-inset-top,0px);visibility:hidden"; document.body.appendChild(p); topInset = p.getBoundingClientRect().height || 0; p.remove(); }
  const HUDH = () => topInset + 64;
  function finish(name, score, lowerBetter) {
    const rec = score > 0 && (lowerBetter ? (!best[name] || score < best[name]) : score > best[name]);
    if (rec) { best[name] = score; LS.set("best." + name, score); }
    A.record(name, score); renderBests3();
    DP.sound[rec ? "fanfare" : "gong"](); if (rec && DP.phys) DP.phys.confetti(90);
    if (DP.haptic) DP.haptic(rec ? "success" : "fail");
    return rec;
  }
  function hud(score, lives, max = 3) { $("#gScore").textContent = score; $("#gLives").innerHTML = lives == null ? "" : "\u2764\uFE0F".repeat(Math.max(0, lives)) + "<s>" + "\u2764\uFE0F".repeat(Math.max(0, max - lives)) + "</s>"; }
  function big(t, x, y, size, fill = "#fff", a = 1) { cx.globalAlpha = a; cx.font = `${size}px Bangers, Impact, sans-serif`; cx.textAlign = "center"; cx.textBaseline = "alphabetic"; cx.lineWidth = Math.max(4, size / 7); cx.strokeStyle = "#000"; cx.lineJoin = "round"; cx.strokeText(t, x, y); cx.fillStyle = fill; cx.fillText(t, x, y); cx.globalAlpha = 1; }
  // original mask head for canvases. v: dp | kid | dog | head | gold | nice | wolv
  function head(x, y, r, v = "dp", o = {}) {
    cx.save(); cx.translate(x, y); if (o.rot) cx.rotate(o.rot);
    const pal = { dp: ["#ff4a52", "#cf111b", "#5e040a"], kid: ["#ff7a80", "#e0303a", "#7a0a12"], head: ["#ff6a6a", "#b0141c", "#3a0205"], gold: ["#fff3a0", "#f0b400", "#7a5200"], nice: ["#ffd0ea", "#ff7ac3", "#8a2a5a"], wolv: ["#ffe36b", "#ffc814", "#8a6a00"] }[v];
    if (v === "dog") {
      cx.fillStyle = "#e9e4dc"; cx.strokeStyle = "#000"; cx.lineWidth = r * 0.08;
      for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; cx.beginPath(); cx.arc(Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78, r * 0.34, 0, 7); cx.fill(); }
      cx.beginPath(); cx.arc(0, 0, r * 0.85, 0, 7); cx.fill(); cx.stroke();
      cx.fillStyle = "#d4121c"; cx.beginPath(); cx.ellipse(0, -r * 0.2, r * 0.8, r * 0.35, 0, 0, 7); cx.fill();
      cx.fillStyle = "#111"; cx.beginPath(); cx.ellipse(-r * 0.32, -r * 0.2, r * 0.22, r * 0.18, 0, 0, 7); cx.ellipse(r * 0.32, -r * 0.2, r * 0.22, r * 0.18, 0, 0, 7); cx.fill();
      cx.fillStyle = "#fff"; cx.beginPath(); cx.arc(-r * 0.3, -r * 0.22, r * 0.09, 0, 7); cx.arc(r * 0.34, -r * 0.2, r * 0.07, 0, 7); cx.fill();
      cx.fillStyle = "#222"; cx.beginPath(); cx.ellipse(0, r * 0.18, r * 0.16, r * 0.11, 0, 0, 7); cx.fill();
      cx.fillStyle = "#ff7a9a"; cx.beginPath(); cx.ellipse(r * 0.05, r * 0.45, r * 0.12, r * 0.2, 0.2, 0, 7); cx.fill();
      cx.restore(); return;
    }
    const g = cx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r * 1.1); g.addColorStop(0, pal[0]); g.addColorStop(0.6, pal[1]); g.addColorStop(1, pal[2]);
    cx.fillStyle = g; cx.strokeStyle = "#000"; cx.lineWidth = Math.max(2, r * 0.07);
    cx.beginPath(); cx.ellipse(0, 0, r * 0.88, r, 0, 0, 7); cx.fill(); cx.stroke();
    if (v === "wolv") { cx.fillStyle = "#111"; cx.beginPath(); cx.moveTo(-r * 0.1, -r * 0.1); cx.lineTo(-r * 1.05, -r * 1.05); cx.lineTo(-r * 0.85, r * 0.2); cx.closePath(); cx.moveTo(r * 0.1, -r * 0.1); cx.lineTo(r * 1.05, -r * 1.05); cx.lineTo(r * 0.85, r * 0.2); cx.closePath(); cx.fill(); cx.fillStyle = "#1f5fd6"; cx.fillRect(-r * 0.6, r * 0.45, r * 1.2, r * 0.12); }
    else { cx.fillStyle = "#0a0a0b"; for (const s of [-1, 1]) { cx.beginPath(); cx.moveTo(s * r * 0.06, 0); cx.bezierCurveTo(s * r * 0.15, -r * 0.34, s * r * 0.56, -r * 0.44, s * r * 0.9, -r * 0.3); cx.lineTo(s * r * 0.92, r * 0.22); cx.bezierCurveTo(s * r * 0.6, r * 0.28, s * r * 0.2, r * 0.2, s * r * 0.06, r * 0.1); cx.closePath(); cx.fill(); } }
    const wide = o.eyes == null ? 1 : o.eyes, er = v === "kid" ? 1.35 : 1;
    cx.fillStyle = "#fff"; for (const s of [-1, 1]) { cx.save(); cx.translate(s * r * 0.44, -r * 0.08); cx.scale(1, wide); cx.beginPath(); cx.ellipse(0, 0, r * 0.28 * er, r * 0.1 * er, s * 0.15, 0, 7); cx.fill(); cx.restore(); }
    if (v === "head") { cx.strokeStyle = "rgba(0,0,0,.6)"; cx.lineWidth = r * 0.06; cx.beginPath(); cx.moveTo(-r * 0.4, r * 0.95); cx.lineTo(-r * 0.2, r * 0.8); cx.lineTo(0, r * 0.97); cx.lineTo(r * 0.2, r * 0.8); cx.lineTo(r * 0.4, r * 0.95); cx.stroke(); }
    if (v === "nice") { cx.fillStyle = "#ffe36b"; cx.beginPath(); cx.ellipse(r * 0.7, -r * 0.75, r * 0.22, r * 0.45, 0.6, 0, 7); cx.fill(); cx.stroke(); }
    if (v === "gold") { cx.fillStyle = "rgba(255,255,255,.7)"; cx.beginPath(); cx.ellipse(-r * 0.3, -r * 0.55, r * 0.25, r * 0.1, -0.5, 0, 7); cx.fill(); }
    cx.restore();
  }
  G.head = head;
  const fx = { parts: [], texts: [] };
  function spark(x, y, n, pal, sp = 280) { for (let i = 0; i < n; i++) { const a = rnd(0, 6.283), s = rnd(60, sp); fx.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 80, life: 1, c: pal[i % pal.length], r: rnd(2, 5) }); } }
  function pop(t, x, y, c) { fx.texts.push({ t, x, y, c, life: 1 }); }
  function drawFx(dt) {
    cx.globalCompositeOperation = "lighter";
    for (let i = fx.parts.length - 1; i >= 0; i--) { const p = fx.parts[i]; p.vy += 600 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 1.6; if (p.life <= 0) { fx.parts.splice(i, 1); continue; } cx.globalAlpha = p.life; cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill(); }
    cx.globalAlpha = 1; cx.globalCompositeOperation = "source-over";
    for (let i = fx.texts.length - 1; i >= 0; i--) { const t = fx.texts[i]; t.life -= dt * 1.1; t.y -= 50 * dt; if (t.life <= 0) { fx.texts.splice(i, 1); continue; } big(t.t, t.x, t.y, 30, t.c, Math.min(1, t.life * 2)); }
  }
  function intro(name, title, body, btn) { A.showMsg(`<h2>${title}</h2><p>${body}</p><button class="btn btn-red btn-big" data-b="g3go">${btn || "LET'S GO"}</button>`, "intro"); }
  A.msg.addEventListener("click", e => { if (!e.target.closest("[data-b='g3go']")) return; e.stopPropagation(); A.msg.className = "game-msg"; const g = G.reg[G.active]; if (g && g.go) g.go(); });
  const played = () => { stats.played = stats.played || {}; return stats.played; };
  new MutationObserver(() => { const n = document.getElementById("gameLayer").dataset.game; if (!n || document.getElementById("gameLayer").hidden) return; played()[n] = 1; saveStats(); if (["slice", "bullet", "flappy", "duel", "whack", "snake"].every(k => played()[k])) ach("arcade_all"); }).observe(document.getElementById("gameLayer"), { attributes: true, attributeFilter: ["data-game", "hidden"] });

  // ======================= CHIMICHANGA FLIGHT =======================
  const Flappy = {
    start() { fx.parts = []; fx.texts = []; Object.assign(this, { st: "intro", y: A.H * 0.45, vy: 0, pipes: [], coins: [], score: 0, t: 0, spawn: 0, dist: 0, flash: 0, trail: [] }); hud(0); intro("flappy", "CHIMICHANGA FLIGHT", "Tap to flap your deep-fried jet.<br>Dodge the katana gates. Grab tacos for +3.", "FLY!"); say(pick(["Buckle up. This chimichanga has no seatbelts.", "Flight attendants, prepare for crash landing. Which is soon."])); },
    go() { this.st = "play"; this.flap(); },
    flap() { if (this.st !== "play") return; this.vy = -Math.min(520, A.H * 0.56); DP.sound.flap ? DP.sound.flap() : DP.sound.swish(); for (let i = 0; i < 5; i++) this.trail.push({ x: A.W * 0.28 - 30, y: this.y + 8, vx: rnd(-160, -60), vy: rnd(-30, 60), life: 0.5 }); },
    tap() { if (this.st === "play") this.flap(); },
    end() { if (this.st !== "play") return; this.st = "over"; DP.sound.splat ? DP.sound.splat() : DP.sound.hit(); K.shake("shake-hard"); this.flash = 1; spark(A.W * 0.28, this.y, 26, ["#ff2a36", "#ffd54a", "#e0a650"]);
      const s = this.score, rec = finish("flappy", s); if (s >= 10) ach("flappy_10"); if (s >= 30) ach("flappy_30");
      setTimeout(() => A.overMsg("CRASHED", s, rec ? pick("game.record") : pick(["You flew like a chimichanga. Which is to say: not at all.", "Pilot error. The pilot was you.", "Deep-fried and deeply disappointing."]), rec), 800); },
    frame(now, dt) {
      const W = A.W, H = A.H, top = HUDH(), px = W * 0.28, speed = Math.min(270, 170 + this.score * 3);
      // sky
      const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#12051f"); g.addColorStop(0.55, "#4a0b2c"); g.addColorStop(1, "#ff5a1f"); cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.fillStyle = "rgba(255,210,120,.9)"; cx.beginPath(); cx.arc(W * 0.7, H * 0.72, W * 0.22, 0, 7); cx.fill();
      this.dist += (this.st === "play" ? speed : 40) * dt;
      for (let L = 0; L < 2; L++) { const sp = L ? 0.5 : 0.25, bw = L ? 46 : 70; cx.fillStyle = L ? "#1a0610" : "#2d0a1c"; for (let i = -1; i < W / bw + 2; i++) { const wx = i * bw - (this.dist * sp) % bw, idx = Math.floor((this.dist * sp) / bw) + i, hh = (L ? 90 : 150) + ((idx * 7919) % 97) * (L ? 1.1 : 1.6); cx.fillRect(wx, H - hh, bw - 4, hh); } }
      if (this.st === "play") {
        this.t += dt; this.vy += Math.min(1700, H * 1.8) * dt; this.y += this.vy * dt; this.spawn -= dt;
        if (this.spawn <= 0) { const gap = Math.max(150, 215 - this.score * 2.5), gy = rnd(top + 60 + gap / 2, H - 90 - gap / 2); this.pipes.push({ x: W + 40, gy, gap, passed: false }); if (Math.random() < 0.45) this.coins.push({ x: W + 40, y: gy + rnd(-gap * 0.25, gap * 0.25), got: false }); this.spawn = Math.max(1.15, 1.7 - this.score * 0.015); }
        if (this.y > H - 20 || this.y < top - 10) this.end();
      } else if (this.st === "intro") { this.y = H * 0.45 + Math.sin(now / 300) * 14; }
      else if (this.st === "over") { this.vy += 1600 * dt; this.y = Math.min(H + 60, this.y + this.vy * dt); }
      // katana gates
      for (let i = this.pipes.length - 1; i >= 0; i--) {
        const p = this.pipes[i]; if (this.st === "play") p.x -= speed * dt; if (p.x < -80) { this.pipes.splice(i, 1); continue; }
        const bw = 46;
        for (const dir of [-1, 1]) {
          const edge = p.gy + dir * p.gap / 2, far = dir < 0 ? 0 : H;
          const y0 = Math.min(edge, far), h = Math.abs(far - edge);
          const bg = cx.createLinearGradient(p.x - bw / 2, 0, p.x + bw / 2, 0); bg.addColorStop(0, "#8a9099"); bg.addColorStop(0.5, "#f4f6f8"); bg.addColorStop(1, "#6a7079");
          cx.fillStyle = bg; cx.fillRect(p.x - bw / 2 + 8, y0, bw - 16, h);
          cx.fillStyle = "#c9a24a"; cx.fillRect(p.x - bw / 2, edge - (dir < 0 ? 14 : 0), bw, 14); cx.strokeStyle = "#000"; cx.lineWidth = 3; cx.strokeRect(p.x - bw / 2, edge - (dir < 0 ? 14 : 0), bw, 14);
          cx.fillStyle = "#1a1a1d"; for (let k = 1; k < 5; k++) { const yy = edge - dir * (14 + k * 26); cx.fillRect(p.x - 12, yy - 3, 24, 6); }
        }
        if (this.st === "play") {
          if (Math.abs(p.x - px) < 23 + 22 && Math.abs(this.y - p.gy) > p.gap / 2 - 18) this.end();
          if (!p.passed && p.x < px) { p.passed = true; this.score++; hud(this.score); DP.sound.coin(); if (this.score % 10 === 0) { pop(this.score + "!", W / 2, H * 0.3, "#ffd54a"); say(pick(["Double digits! Look at you, Top Chimi.", "The chimichanga is proud. Crispy, but proud."])); } }
        }
      }
      for (let i = this.coins.length - 1; i >= 0; i--) { const c = this.coins[i]; if (this.st === "play") c.x -= speed * dt; if (c.x < -40 || c.got) { this.coins.splice(i, 1); continue; } A.drawItem("taco", c.x, c.y + Math.sin(now / 200 + c.x) * 4, 16, 0, now / 1000); if (this.st === "play" && Math.hypot(c.x - px, c.y - this.y) < 34) { c.got = true; this.score += 3; hud(this.score); DP.sound.eat ? DP.sound.eat() : DP.sound.coin(); pop("+3 TACO", c.x, c.y - 20, "#4dff88"); spark(c.x, c.y, 12, ["#ffd54a", "#4dff88"]); } }
      // flame trail + player
      for (let i = this.trail.length - 1; i >= 0; i--) { const p = this.trail[i]; p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.life <= 0) { this.trail.splice(i, 1); continue; } A.glow(p.x, p.y, 14 * p.life / 0.5 + 4, "rgba(255,150,40,1)", p.life * 1.6); }
      const rot = Math.max(-0.5, Math.min(1.1, this.vy / 700));
      A.drawItem("chimi", px, this.y + 6, 22, rot, now / 1000);
      head(px + 6, this.y - 18, 15, "dp", { rot: rot * 0.6, eyes: this.st === "over" ? 0.3 : this.vy < 0 ? 1.4 : 1 });
      drawFx(dt);
      if (this.flash > 0) { cx.fillStyle = `rgba(255,255,255,${this.flash * 0.6})`; cx.fillRect(0, 0, W, H); this.flash -= dt * 3; }
      if (this.st === "play" && this.t < 1.6) big("TAP!", W / 2, H * 0.3, 60, "#fff", 1 - this.t / 1.6);
    }
  };
  G.register("flappy", Flappy);

  // ======================= CLAWS VS KATANA (rhythm duel) =======================
  const Duel = {
    start() { fx.parts = []; fx.texts = []; Object.assign(this, { st: "intro", notes: [], me: 100, foe: 100, score: 0, combo: 0, maxCombo: 0, misses: 0, t0: 0, beat: 0, next: 0, bpm: 108, judge: null, swing: { me: 0, foe: 0 }, flash: 0, hits: 0 }); hud("DUEL"); intro("duel", "CLAWS VS KATANA", "Notes slide in on two lanes. Tap the <b>top</b> or <b>bottom</b> half when a note hits the ring.<br>Hit = damage him. Miss = he shanks you.", "FIGHT!"); say(pick(["Grumpy vs Gorgeous. Round one. FIGHT!", "He's got claws. I've got rhythm. And katanas. Mostly rhythm."])); },
    go() { this.st = "play"; this.t0 = performance.now() + 600; this.next = 0; this.beat = 60000 / this.bpm; },
    lanes() { const H = A.H, top = HUDH() + 90; return [top + (H - top) * 0.3, top + (H - top) * 0.62]; },
    ringX() { return A.W * 0.2; },
    tap(x, y) {
      if (this.st !== "play") return;
      const L = this.lanes(), lane = y < (L[0] + L[1]) / 2 ? 0 : 1, now = performance.now();
      let bestN = null, bestD = 1e9;
      for (const n of this.notes) { if (n.done || n.lane !== lane) continue; const d = Math.abs(n.t - now); if (d < bestD) { bestD = d; bestN = n; } }
      if (bestN && bestD < 170) {
        bestN.done = true; const perfect = bestD < 70; this.combo++; this.maxCombo = Math.max(this.maxCombo, this.combo); this.hits++;
        const dmg = perfect ? 5 : 3; this.foe = Math.max(0, this.foe - dmg); this.score += (perfect ? 100 : 50) + this.combo * 5;
        this.judge = { t: perfect ? "PERFECT!" : "GOOD", c: perfect ? "#ffd54a" : "#fff", life: 1, lane };
        this.swing.me = 1; DP.sound[perfect ? "slash" : "swish"](); if (perfect && DP.sound.perfect) DP.sound.perfect();
        spark(this.ringX(), L[lane], perfect ? 18 : 10, ["#ffffff", "#ff2a36", "#ffd54a"], 320); if (DP.haptic) DP.haptic(perfect ? "medium" : "light");
        hud(this.score);
        if (this.foe <= 0) this.end(true);
      } else { this.whiff(lane); }
    },
    whiff(lane) { this.combo = 0; this.misses++; this.me = Math.max(0, this.me - 4); this.judge = { t: "WHIFF", c: "#ff3b44", life: 1, lane }; DP.sound.miss ? DP.sound.miss() : DP.sound.hit(); if (this.me <= 0) this.end(false); },
    end(win) {
      if (this.st !== "play") return; this.st = "over";
      if (win) { stats.duelWins = (stats.duelWins || 0) + 1; saveStats(); ach("duel_win"); if (!this.misses) ach("duel_perfect"); this.score += this.me * 10; }
      const s = this.score, rec = finish("duel", s);
      DP.fx.claws(); K.shake("shake-hard");
      setTimeout(() => A.overMsg(win ? "YOU WIN!" : "SHANKED", s, (win ? pick(["Flawless! Well, mostly. He'll heal. So will I. Rematch in five.", "Claws down! The katana wins again. Katana supremacy!"]) : pick(["He got me. Right in the healing factor.", "Lost to a guy who yells at vending machines. Embarrassing."])) + `  Max combo ${this.maxCombo}, misses ${this.misses}.`, rec), 700);
    },
    frame(now, dt) {
      const W = A.W, H = A.H, L = this.lanes(), rx = this.ringX(), top = HUDH();
      A.bg(now / 1000, "rgba(255,200,20,.06)");
      // HP bars
      const bw = W * 0.4;
      cx.fillStyle = "#000"; cx.fillRect(14, top + 8, bw, 16); cx.fillRect(W - 14 - bw, top + 8, bw, 16);
      cx.fillStyle = "#ff2a36"; cx.fillRect(16, top + 10, (bw - 4) * this.me / 100, 12);
      cx.fillStyle = "#ffc814"; cx.fillRect(W - 16 - (bw - 4) * this.foe / 100, top + 10, (bw - 4) * this.foe / 100, 12);
      cx.font = "15px Oswald, sans-serif"; cx.fillStyle = "#fff"; cx.textAlign = "left"; cx.fillText("MERC", 16, top + 42); cx.textAlign = "right"; cx.fillText("GRUMPY", W - 16, top + 42);
      // fighters
      this.swing.me = Math.max(0, this.swing.me - dt * 4); this.swing.foe = Math.max(0, this.swing.foe - dt * 4);
      const fy = top + 74;
      head(W * 0.22 + this.swing.me * 30, fy, 26, "dp", { eyes: this.swing.me > 0 ? 0.4 : 1 });
      head(W * 0.78 - this.swing.foe * 30, fy, 26, "wolv", { eyes: this.swing.foe > 0 ? 0.4 : 1 });
      cx.strokeStyle = "#ddd"; cx.lineWidth = 3; for (let k = -1; k <= 1; k++) { cx.beginPath(); cx.moveTo(W * 0.78 - 28 - this.swing.foe * 30, fy + 10 + k * 6); cx.lineTo(W * 0.78 - 58 - this.swing.foe * 50, fy + 4 + k * 8); cx.stroke(); }
      big("VS", W / 2, fy + 12, 34, "#ffd54a");
      // lanes
      L.forEach((y, i) => { cx.fillStyle = "rgba(255,255,255,.05)"; cx.fillRect(0, y - 34, W, 68); cx.strokeStyle = "rgba(255,255,255,.12)"; cx.setLineDash([6, 10]); cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke(); cx.setLineDash([]);
        cx.strokeStyle = i ? "#ff2a36" : "#ffd54a"; cx.lineWidth = 5; cx.beginPath(); cx.arc(rx, y, 30, 0, 7); cx.stroke(); cx.lineWidth = 2; cx.beginPath(); cx.arc(rx, y, 38 + Math.sin(now / 90) * 2, 0, 7); cx.stroke();
        big(i ? "LOW" : "HIGH", W - 40, y + 8, 20, "rgba(255,255,255,.35)"); });
      if (this.st === "play") {
        const el = now - this.t0, spd = Math.min(W * 0.95, W * 0.62 + el / 1000 * 4);
        // schedule notes one beat ahead of their arrival
        while (this.next * this.beat < el + 2400) {
          const i = this.next, bar = Math.floor(i / 8), s = i % 8;
          const pattern = [[1, 0, 1, 0, 1, 1, 0, 1], [1, 1, 0, 1, 0, 1, 1, 0], [1, 0, 1, 1, 1, 0, 1, 1]][bar % 3];
          if (i >= 4 && pattern[s] && (bar > 1 || s % 2 === 0)) this.notes.push({ t: this.t0 + i * this.beat, lane: ((i * 7 + bar * 3) % 5) < 2 ? 1 : 0, done: false, foe: (i % 6 === 5) });
          this.next++;
        }
        if (Math.floor(el / this.beat) !== this.lastBeat && el > 0) { this.lastBeat = Math.floor(el / this.beat); if (DP.sound.tick) DP.sound.tick(); }
        for (const n of this.notes) {
          if (n.done) continue;
          if (now - n.t > 170) { n.done = true; this.swing.foe = 1; DP.sound.hit(); this.me = Math.max(0, this.me - (n.foe ? 10 : 7)); this.combo = 0; this.misses++; this.judge = { t: "MISS", c: "#ff3b44", life: 1, lane: n.lane }; K.shake(); if (this.me <= 0) { this.end(false); break; } }
        }
        this.notes = this.notes.filter(n => !n.done || now - n.t < 400);
      }
      for (const n of this.notes) {
        if (n.done) continue;
        const el = now - this.t0, spd = Math.min(W * 0.95, W * 0.62 + el / 1000 * 4);
        const x = rx + (n.t - now) / 1000 * spd, y = L[n.lane]; if (x > W + 40) continue;
        cx.save(); cx.translate(x, y);
        if (n.foe) { cx.rotate(now / 200); cx.strokeStyle = "#ffc814"; cx.lineWidth = 4; for (let k = -1; k <= 1; k++) { cx.beginPath(); cx.moveTo(-18, k * 8); cx.lineTo(18, k * 8 - 6); cx.stroke(); } A.glow(0, 0, 30, "rgba(255,200,20,.6)"); }
        else { cx.rotate(-0.6); cx.fillStyle = "#e8ecf0"; cx.beginPath(); cx.moveTo(-22, -3); cx.lineTo(18, -3); cx.lineTo(24, 0); cx.lineTo(18, 3); cx.lineTo(-22, 3); cx.fill(); cx.fillStyle = "#c9a24a"; cx.fillRect(-26, -7, 4, 14); cx.fillStyle = "#222"; cx.fillRect(-38, -3, 12, 6); A.glow(0, 0, 26, "rgba(255,60,70,.45)"); }
        cx.restore();
      }
      if (this.judge && this.judge.life > 0) { this.judge.life -= dt * 1.5; big(this.judge.t, rx + 70, L[this.judge.lane] - 40, 30, this.judge.c, Math.min(1, this.judge.life * 2)); }
      if (this.combo >= 5) big(this.combo + "x COMBO", W / 2, H - 40, 34, "#ffd54a");
      drawFx(dt);
    }
  };
  G.register("duel", Duel);

  // ======================= WHACK-A-MERC =======================
  const VAR = [
    { v: "dp", p: 1, w: 50, stay: 1.0, label: "+1" }, { v: "kid", p: 2, w: 16, stay: 0.7, label: "+2 KID" }, { v: "head", p: 3, w: 10, stay: 0.55, label: "+3 HEAD" },
    { v: "nice", p: 1, w: 8, stay: 1.1, label: "+1 SORRY!" }, { v: "gold", p: 10, w: 3, stay: 0.6, label: "+10 GOLD!" }, { v: "dog", p: 0, w: 9, stay: 1.2, label: "NOT PEGGY!", bad: true }, { v: "bomb", p: 0, w: 7, stay: 1.1, label: "BOOM", bad: true }
  ];
  const Whack = {
    start() { fx.parts = []; fx.texts = []; Object.assign(this, { st: "intro", holes: [], score: 0, lives: 3, time: 45, spawn: 0.6, hitShake: 0, whacked: 0 }); for (let i = 0; i < 9; i++) this.holes.push({ m: null, up: 0, t: 0 }); hud(0, 3); intro("whack", "WHACK-A-MERC", "Variants pop out of manholes. Bonk them!<br>Kids +2, heads +3, gold +10.<br><b>Never bonk Peggy.</b> Bombs are also bad. Obviously.", "BONK!"); say(pick(["Whack-a-me! Finally, a game about my favourite subject.", "Bonk the variants. They signed waivers. Probably."])); },
    go() { this.st = "play"; },
    geo() { const W = A.W, H = A.H, top = HUDH() + 60, gw = Math.min(W - 40, (H - top - 80) * 0.95), cell = gw / 3, ox = (W - gw) / 2; return { cell, ox, oy: top + 20 }; },
    center(i) { const g = this.geo(); return [g.ox + (i % 3 + 0.5) * g.cell, g.oy + (Math.floor(i / 3) + 0.62) * g.cell]; },
    tap(x, y) {
      if (this.st !== "play") return; const g = this.geo();
      for (let i = 0; i < 9; i++) { const h = this.holes[i]; if (!h.m || h.up < 0.45 || h.hit) continue; const [hx, hy] = this.center(i); if (Math.abs(x - hx) < g.cell * 0.42 && y > hy - g.cell * 0.72 && y < hy + g.cell * 0.2) { this.bonk(i); return; } }
      DP.sound.whack ? DP.sound.whack() : DP.sound.hit();
    },
    bonk(i) {
      const h = this.holes[i], m = h.m, [hx, hy] = this.center(i); h.hit = 0.35; h.t = Math.min(h.t, 0.35);
      if (m.bad) { this.lives--; hud(this.score, this.lives); K.shake("shake-hard"); if (m.v === "bomb") { DP.sound.boom(); spark(hx, hy - 30, 30, ["#ff3b1f", "#ffd54a", "#fff"], 420); } else { DP.sound.buzzer ? DP.sound.buzzer() : DP.sound.hit(); say(pick("peggy")); } pop(m.label, hx, hy - 60, "#ff3b44"); if (DP.haptic) DP.haptic("heavy"); if (this.lives <= 0) this.end(); return; }
      this.score += m.p; this.whacked++; hud(this.score, this.lives); DP.sound.whack ? DP.sound.whack() : DP.sound.chop(); if (m.v === "gold" && DP.sound.cash) DP.sound.cash();
      pop(m.label, hx, hy - 60, m.v === "gold" ? "#ffd54a" : "#fff"); spark(hx, hy - 30, 14, m.v === "gold" ? ["#ffd54a", "#fff"] : ["#ff2a36", "#fff", "#ffd54a"]); if (DP.phys && Math.random() < 0.35) DP.phys.splat(hx, hy - 30, 6);
      if (DP.haptic) DP.haptic("light");
    },
    end() { if (this.st !== "play") return; this.st = "over"; const s = this.score, rec = finish("whack", s); if (s >= 50) ach("whack_50"); if (s >= 100) ach("whack_100"); setTimeout(() => A.overMsg("TIME'S UP", s, rec ? pick("game.record") : pick(["You bonked " + this.whacked + " of me. I felt every one. Worth it.", "Whack-a-Merc champion of... your couch."]), rec), 600); },
    frame(now, dt) {
      const W = A.W, H = A.H, g = this.geo();
      const bgc = cx.createLinearGradient(0, 0, 0, H); bgc.addColorStop(0, "#1b1d22"); bgc.addColorStop(1, "#0b0c0e"); cx.fillStyle = bgc; cx.fillRect(0, 0, W, H);
      cx.strokeStyle = "rgba(255,255,255,.04)"; cx.lineWidth = 2; for (let y = 0; y < H; y += 40) { cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y + 20); cx.stroke(); }
      if (this.st === "play") {
        this.time -= dt; if (this.time <= 0) { this.time = 0; this.end(); }
        this.spawn -= dt; const el = 45 - this.time;
        if (this.spawn <= 0) { const free = this.holes.map((h, i) => h.m ? -1 : i).filter(i => i >= 0); if (free.length) { const i = free[Math.floor(Math.random() * free.length)]; let r = Math.random() * VAR.reduce((a, b) => a + b.w, 0), m = VAR[0]; for (const v of VAR) { r -= v.w; if (r <= 0) { m = v; break; } } const h = this.holes[i]; h.m = m; h.up = 0; h.hit = 0; h.t = m.stay * Math.max(0.6, 1 - el / 90); } this.spawn = Math.max(0.32, 0.85 - el / 70) * rnd(0.7, 1.2); }
      }
      big(Math.ceil(this.time) + "s", W / 2, HUDH() + 40, 36, this.time < 10 ? "#ff3b44" : "#fff");
      for (let i = 0; i < 9; i++) {
        const h = this.holes[i], [hx, hy] = this.center(i), r = g.cell * 0.36;
        if (h.m) { if (h.hit > 0) { h.hit -= dt; if (h.hit <= 0) { h.m = null; } } else { h.t -= dt; h.up = h.t > 0 ? Math.min(1, h.up + dt * 7) : h.up - dt * 6; if (h.up <= 0 && h.t <= 0) h.m = null; } }
        // manhole
        cx.fillStyle = "#050506"; cx.beginPath(); cx.ellipse(hx, hy, r * 1.08, r * 0.38, 0, 0, 7); cx.fill();
        cx.strokeStyle = "#3a3d44"; cx.lineWidth = 5; cx.stroke();
        if (h.m) {
          const up = Math.max(0, h.up), yy = hy - up * r * 1.05 + (h.hit > 0 ? (0.35 - h.hit) * r * 3 : 0);
          cx.save(); cx.beginPath(); cx.rect(hx - r * 1.4, hy - r * 3, r * 2.8, r * 3); cx.ellipse(hx, hy, r * 1.08, r * 0.38, 0, 0, Math.PI); cx.clip();
          if (h.m.v === "bomb") { cx.fillStyle = "#222"; cx.strokeStyle = "#000"; cx.lineWidth = 4; cx.beginPath(); cx.arc(hx, yy, r * 0.62, 0, 7); cx.fill(); cx.stroke(); cx.fillStyle = "#fff"; cx.font = `bold ${Math.round(r * 0.36)}px Oswald, sans-serif`; cx.textAlign = "center"; cx.fillText("NOPE", hx, yy + r * 0.12); A.glow(hx + r * 0.4, yy - r * 0.7, 14 + Math.sin(now / 40) * 4, "rgba(255,200,60,1)"); }
          else head(hx, yy, r * (h.m.v === "head" ? 0.5 : h.m.v === "kid" ? 0.55 : 0.66), h.m.v, { eyes: h.hit > 0 ? 0.15 : 1 });
          cx.restore();
          if (h.hit > 0 && h.m && !h.m.bad) { cx.save(); cx.translate(hx + r * 0.3, yy - r * 0.6); cx.rotate(-0.8 + (0.35 - h.hit) * 2); cx.fillStyle = "#8a5a2a"; cx.fillRect(-4, -r * 0.2, 8, r * 1.1); cx.fillStyle = "#d4121c"; cx.fillRect(-r * 0.35, -r * 0.45, r * 0.7, r * 0.3); cx.restore(); }
        }
        cx.fillStyle = "#1b1d22"; cx.beginPath(); cx.ellipse(hx, hy + 2, r * 1.12, r * 0.16, 0, 0, Math.PI); cx.fill();
      }
      drawFx(dt);
    }
  };
  G.register("whack", Whack);

  // ======================= TACO TRAIL (snake) =======================
  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const KONAMI = ["up", "up", "down", "down", "left", "right", "left", "right"];
  const Snake = {
    start() { fx.parts = []; fx.texts = []; const g = this.geo(); Object.assign(this, { st: "intro", body: [[4, Math.floor(g.rows / 2)], [3, Math.floor(g.rows / 2)], [2, Math.floor(g.rows / 2)]], dir: "right", q: [], food: null, eaten: 0, acc: 0, step: 0.16, grow: 0, rainbow: false, keys: [], dead: 0 }); this.place(); hud(0); intro("snake", "TACO TRAIL", "Swipe (or use the D-pad) to steer my chimichanga caboose to the tacos.<br>Don't eat yourself. I've tried. Tastes like regret.", "NOM!"); say(pick(["Taco Trail! It's like Snake, but with more cholesterol.", "Follow the tacos. The tacos know the way."])); },
    go() { this.st = "play"; },
    geo() { const W = A.W, H = A.H, top = HUDH() + 10, pad = 12, dp = Math.min(190, H * 0.22), cols = 15, cell = Math.floor((W - pad * 2) / cols), rows = Math.max(10, Math.floor((H - top - dp - 20) / cell)); return { cols, rows, cell, ox: Math.floor((W - cols * cell) / 2), oy: top, dpY: top + rows * cell + 16 + (H - (top + rows * cell + 16)) / 2 - 10 }; },
    place() { const g = this.geo(); let p; do { p = [Math.floor(Math.random() * g.cols), Math.floor(Math.random() * g.rows)]; } while (this.body.some(b => b[0] === p[0] && b[1] === p[1])); this.food = p; this.foodGold = Math.random() < 0.12; },
    turn(d) {
      this.keys.push(d); this.keys = this.keys.slice(-8); if (this.keys.join() === KONAMI.join() && egg("konami")) { this.rainbow = true; this.grow += 5; say("Cheat code accepted! Rainbow caboose unlocked. Don't tell the other games."); DP.sound.sparkle(); }
      if (this.st !== "play") return; const last = this.q.length ? this.q[this.q.length - 1] : this.dir, a = DIRS[d], b = DIRS[last]; if (a[0] === -b[0] && a[1] === -b[1]) return; if (this.q.length < 3) this.q.push(d); if (DP.haptic) DP.haptic("light");
    },
    dpad() { const g = this.geo(), W = A.W, r = Math.min(40, (A.H - g.dpY) * 0.4, 44), cx0 = W / 2, cy0 = g.dpY; return { r, pts: { up: [cx0, cy0 - r * 1.25], down: [cx0, cy0 + r * 1.25], left: [cx0 - r * 1.6, cy0], right: [cx0 + r * 1.6, cy0] } }; },
    tap(x, y) { const d = this.dpad(); for (const k in d.pts) { const [px, py] = d.pts[k]; if (Math.hypot(x - px, y - py) < d.r * 1.05) { this.turn(k); return true; } } return false; },
    end() { if (this.st !== "play") return; this.st = "over"; DP.sound.splat ? DP.sound.splat() : DP.sound.hit(); K.shake(); const s = this.eaten, rec = finish("snake", s); if (s >= 15) ach("snake_15"); if (s >= 40) ach("snake_40"); setTimeout(() => A.overMsg("TACO COMA", s + "<small> tacos</small>", rec ? pick("game.record") : pick(["You ate yourself. Relatable.", "Trail ended. The tacos mourn you. Briefly."]), rec), 700); },
    frame(now, dt) {
      const W = A.W, H = A.H, g = this.geo();
      cx.fillStyle = "#0d0a08"; cx.fillRect(0, 0, W, H);
      for (let y = 0; y < g.rows; y++) for (let x = 0; x < g.cols; x++) { cx.fillStyle = (x + y) % 2 ? "#2a1a0e" : "#23160c"; cx.fillRect(g.ox + x * g.cell, g.oy + y * g.cell, g.cell, g.cell); }
      cx.strokeStyle = "#c9a24a"; cx.lineWidth = 3; cx.strokeRect(g.ox - 2, g.oy - 2, g.cols * g.cell + 4, g.rows * g.cell + 4);
      if (this.st === "play") {
        this.acc += dt; const step = Math.max(0.075, this.step - this.eaten * 0.0022);
        while (this.acc >= step && this.st === "play") {
          this.acc -= step; if (this.q.length) this.dir = this.q.shift();
          const d = DIRS[this.dir], h = this.body[0], n = [h[0] + d[0], h[1] + d[1]];
          if (n[0] < 0 || n[1] < 0 || n[0] >= g.cols || n[1] >= g.rows || this.body.some((b, i) => i < this.body.length - (this.grow ? 0 : 1) && b[0] === n[0] && b[1] === n[1])) { this.end(); break; }
          this.body.unshift(n);
          if (n[0] === this.food[0] && n[1] === this.food[1]) { const v = this.foodGold ? 3 : 1; this.eaten += v; this.grow += v; hud(this.eaten); DP.sound.eat ? DP.sound.eat() : DP.sound.coin(); const fx0 = g.ox + (n[0] + 0.5) * g.cell, fy0 = g.oy + (n[1] + 0.5) * g.cell; spark(fx0, fy0, 12, ["#ffd54a", "#4dff88", "#ff4d4d"]); pop(v > 1 ? "+3 GOLDEN!" : "+1", fx0, fy0 - 16, v > 1 ? "#ffd54a" : "#fff"); this.place(); if (this.eaten % 10 === 0) say(pick(["Burp. Excuse me. Keep going.", "My caboose is getting long. That's what she... no. No."])); }
          if (this.grow > 0) this.grow--; else this.body.pop();
        }
      }
      // food
      const f = this.food; if (f) { const fx0 = g.ox + (f[0] + 0.5) * g.cell, fy0 = g.oy + (f[1] + 0.5) * g.cell + Math.sin(now / 180) * 2; if (this.foodGold) A.glow(fx0, fy0, g.cell * 1.3, "rgba(255,220,60,.6)"); A.drawItem("taco", fx0, fy0, g.cell * 0.42, 0, now / 1000); }
      // body (chimichanga segments), head = mask
      for (let i = this.body.length - 1; i >= 1; i--) { const b = this.body[i], bx = g.ox + (b[0] + 0.5) * g.cell, by = g.oy + (b[1] + 0.5) * g.cell; cx.fillStyle = this.rainbow ? `hsl(${(i * 24 + now / 8) % 360},90%,58%)` : i % 2 ? "#e0a650" : "#c98a3a"; cx.strokeStyle = "#3a1d06"; cx.lineWidth = 2; A.rr(bx - g.cell * 0.44, by - g.cell * 0.44, g.cell * 0.88, g.cell * 0.88, g.cell * 0.3); cx.fill(); cx.stroke(); }
      const h = this.body[0]; if (h) { const d = DIRS[this.dir]; head(g.ox + (h[0] + 0.5) * g.cell, g.oy + (h[1] + 0.5) * g.cell, g.cell * 0.62, "dp", { rot: Math.atan2(d[1], d[0]) - Math.PI / 2 + Math.PI, eyes: this.st === "over" ? 0.2 : 1 }); }
      // d-pad
      const dp = this.dpad(); for (const k in dp.pts) { const [px, py] = dp.pts[k]; cx.fillStyle = "rgba(255,255,255,.08)"; cx.strokeStyle = "rgba(255,255,255,.35)"; cx.lineWidth = 2; cx.beginPath(); cx.arc(px, py, dp.r, 0, 7); cx.fill(); cx.stroke(); cx.save(); cx.translate(px, py); cx.rotate({ up: 0, right: Math.PI / 2, down: Math.PI, left: -Math.PI / 2 }[k]); cx.fillStyle = "#fff"; cx.beginPath(); cx.moveTo(0, -dp.r * 0.4); cx.lineTo(dp.r * 0.35, dp.r * 0.2); cx.lineTo(-dp.r * 0.35, dp.r * 0.2); cx.closePath(); cx.fill(); cx.restore(); }
      drawFx(dt);
    }
  };
  G.register("snake", Snake);

  // ---------- input for the new games ----------
  let sw = null;
  cv.addEventListener("pointerdown", e => {
    const g = G.active; if (!G.reg[g]) return;
    if (g === "snake") { if (!Snake.tap(e.clientX, e.clientY)) sw = { x: e.clientX, y: e.clientY }; return; }
    G.reg[g].tap(e.clientX, e.clientY);
  });
  cv.addEventListener("pointermove", e => { if (G.active !== "snake" || !sw) return; const dx = e.clientX - sw.x, dy = e.clientY - sw.y; if (Math.hypot(dx, dy) > 24) { Snake.turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up")); sw = { x: e.clientX, y: e.clientY }; } });
  cv.addEventListener("pointerup", () => { sw = null; });
  addEventListener("keydown", e => {
    const g = G.active; if (!G.reg[g]) return;
    const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
    if (g === "snake" && map[e.key]) { Snake.turn(map[e.key]); e.preventDefault(); }
    else if (g === "flappy" && (e.key === " " || e.key === "ArrowUp")) { Flappy.tap(); e.preventDefault(); }
    else if (g === "duel" && (e.key === "ArrowUp" || e.key === "ArrowDown")) { const L = Duel.lanes(); Duel.tap(0, e.key === "ArrowUp" ? L[0] : L[1]); e.preventDefault(); }
  });
  G.Flappy = Flappy; G.Duel = Duel; G.Whack = Whack; G.Snake = Snake;
})();
