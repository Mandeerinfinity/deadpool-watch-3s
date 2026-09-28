/* Deadpool Watch 3S — physics particles (blood splatter, confetti, brass casings with tilt gravity), new screen
   transitions (shatter, glitch, claws, portal, fade), a reusable mask SVG, and the skippable cinematic intro. */
(function () {
  const rand = (a, b) => a + Math.random() * (b - a);
  const S = () => DP.settings || {};
  // ---------- mask SVG (original drawing) ----------
  DP.maskSVG = function (o = {}) {
    const red = o.red || "#d4121c", dark = o.dark || "#111", eye = o.eye || "#fff", sq = o.squint || 0, id = "m" + Math.random().toString(36).slice(2, 7);
    return `<svg viewBox="0 0 100 100" class="${o.cls || ""}" aria-hidden="true"><defs><radialGradient id="${id}" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#ff5a5f"/><stop offset=".45" stop-color="${red}"/><stop offset="1" stop-color="#5a0006"/></radialGradient></defs>
<ellipse cx="50" cy="52" rx="40" ry="46" fill="url(#${id})" stroke="#000" stroke-width="3"/>
<path d="M50 6 C47 30 47 70 50 98" stroke="#000" stroke-width="2.5" fill="none" opacity=".75"/>
<path d="M14 44 C20 30 38 30 46 46 C44 58 26 62 16 56 Z" fill="${dark}"/><path d="M86 44 C80 30 62 30 54 46 C56 58 74 62 84 56 Z" fill="${dark}"/>
<path d="M22 47 C27 ${41 + sq} 36 ${41 + sq} 41 48 C35 ${53 - sq * 0.4} 27 ${53 - sq * 0.4} 22 47 Z" fill="${eye}"/><path d="M78 47 C73 ${41 + sq} 64 ${41 + sq} 59 48 C65 ${53 - sq * 0.4} 73 ${53 - sq * 0.4} 78 47 Z" fill="${eye}"/>
<ellipse cx="36" cy="24" rx="12" ry="6" fill="#fff" opacity=".18" transform="rotate(-20 36 24)"/></svg>`;
  };

  // ---------- physics layer ----------
  const cv = document.createElement("canvas"); cv.id = "fxPhys"; cv.setAttribute("aria-hidden", "true");
  document.getElementById("app").appendChild(cv);
  const x = cv.getContext("2d"), DPR = Math.min(2, devicePixelRatio || 1);
  let W = innerWidth, H = innerHeight;
  function resize() { W = innerWidth; H = innerHeight; cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); cv.style.width = W + "px"; cv.style.height = H + "px"; x.setTransform(DPR, 0, 0, DPR, 0, 0); }
  resize(); addEventListener("resize", resize);
  const P = { list: [], decals: [], g: { x: 0, y: 1 }, running: false, splats: 0, nCasings: 0 };
  const grav = { x: 0, y: 1, tx: 0, ty: 1 };
  addEventListener("deviceorientation", e => {
    if (P.fixed) return;
    if (e.beta == null || !S().tiltGravity) { grav.tx = 0; grav.ty = 1; return; }
    const b = e.beta * Math.PI / 180, gm = (e.gamma || 0) * Math.PI / 180;
    grav.tx = Math.sin(gm) * 1.1; grav.ty = Math.sin(b);
    const m = Math.hypot(grav.tx, grav.ty); if (m < 0.15) { grav.tx *= 0.15 / Math.max(m, 0.001); grav.ty = grav.ty * 0.15 / Math.max(m, 0.001) || 0.15; }
  });
  P.setGravity = (gx, gy) => { grav.tx = gx; grav.ty = gy; };
  P.gravity = grav;
  const MAX = () => (S().perf === "saver" ? 160 : 420);
  function add(p) { if (P.list.length >= MAX()) P.list.shift(); P.list.push(p); wake(); }
  P.splat = function (px, py, n = 14, color, pow = 1) {
    if (S().reduceMotion) n = Math.min(n, 5);
    for (let i = 0; i < n; i++) { const a = rand(-Math.PI, 0) + rand(-0.4, 0.4), sp = rand(120, 520) * pow; add({ k: "blood", x: px, y: py, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: rand(1.6, 4.6) * (0.6 + 0.4 * pow), c: color || (Math.random() < 0.3 ? "#8a0010" : "#d4121c"), life: 3 }); }
    P.splats++; if (DP.core) { DP.core.stats.splats = (DP.core.stats.splats || 0) + 1; if (DP.core.stats.splats >= 100) DP.core.ach("splat_100"); }
  };
  P.confetti = function (n = 90, px, py) {
    const pal = ["#ff2a36", "#ffc814", "#2f7bff", "#ffffff", "#4dff88", "#ff4dcf"];
    for (let i = 0; i < n; i++) { const fromTop = px == null; add({ k: "conf", x: fromTop ? rand(0, W) : px, y: fromTop ? rand(-60, -5) : py, vx: fromTop ? rand(-60, 60) : rand(-380, 380), vy: fromTop ? rand(0, 120) : rand(-620, -150), w: rand(6, 11), h: rand(3, 6), rot: rand(0, 6.28), vr: rand(-9, 9), c: pal[i % pal.length], life: rand(5, 8), ph: rand(0, 6.28) }); }
  };
  let lastClink = 0;
  P.casings = function (n = 6, px, py) {
    for (let i = 0; i < n; i++) add({ k: "case", x: px, y: py, vx: rand(80, 320) * (Math.random() < 0.5 ? -1 : 1), vy: rand(-520, -240), rot: rand(0, 6.28), vr: rand(-18, 18), life: 7, w: 4.5, h: 11 });
    P.nCasings += n; if (DP.core) { DP.core.stats.casings = (DP.core.stats.casings || 0) + n; if (DP.core.stats.casings >= 100) DP.core.egg("casings100"); }
  };
  P.balls = function (n, px, py) { for (let i = 0; i < n; i++) add({ k: "ball", x: px + rand(-20, 20), y: py + rand(-20, 20), vx: rand(-200, 200), vy: rand(-300, 0), r: rand(10, 22), c: ["#d4121c", "#ffc814", "#fff", "#2f7bff"][i % 4], life: 30, glyph: ["🌯", "💀", "🦄", "🐶", "🌮", "⚔️"][Math.floor(Math.random() * 6)] }); };
  P.clear = () => { P.list.length = 0; P.decals.length = 0; x.clearRect(0, 0, W, H); };
  P.count = () => P.list.length;
  let last = 0, raf = 0;
  function wake() { if (!P.running) { P.running = true; last = performance.now(); raf = requestAnimationFrame(step); } }
  function step(now) {
    const dt = Math.min(0.033, (now - last) / 1000); last = now;
    grav.x += (grav.tx - grav.x) * 0.1; grav.y += (grav.ty - grav.y) * 0.1;
    const gx = grav.x * 1500, gy = grav.y * 1500;
    x.clearRect(0, 0, W, H);
    for (let i = P.decals.length - 1; i >= 0; i--) {
      const d = P.decals[i]; d.life -= dt; if (d.life <= 0) { P.decals.splice(i, 1); continue; }
      x.globalAlpha = Math.min(1, d.life / 1.5) * 0.85; x.fillStyle = d.c; x.beginPath(); x.ellipse(d.x, d.y, d.rx, d.ry, d.a, 0, 6.283); x.fill();
      if (d.drip) { d.dl = Math.min(d.dl + dt * 14, d.dripMax); x.fillRect(d.x - 0.9, d.y, 1.8, d.dl); }
    }
    x.globalAlpha = 1;
    const floor = H - 2, sp = P.list;
    for (let i = sp.length - 1; i >= 0; i--) {
      const p = sp[i]; p.life -= dt;
      if (p.life <= 0) { sp.splice(i, 1); continue; }
      if (p.k === "conf") { p.vx += gx * 0.12 * dt + Math.sin(now / 300 + p.ph) * 40 * dt; p.vy += gy * 0.12 * dt; p.vx *= 0.985; p.vy *= 0.985; }
      else { p.vx += gx * dt; p.vy += gy * dt; }
      p.x += p.vx * dt; p.y += p.vy * dt; if (p.rot != null) p.rot += p.vr * dt;
      const R = p.r || 4;
      let hit = false;
      if (p.x < R) { p.x = R; p.vx = -p.vx * 0.5; hit = "w"; } else if (p.x > W - R) { p.x = W - R; p.vx = -p.vx * 0.5; hit = "w"; }
      if (p.y > floor - R) { p.y = floor - R; p.vy = -p.vy * (p.k === "ball" ? 0.62 : 0.42); p.vx *= 0.8; hit = "f"; } else if (p.y < R && gy < 0) { p.y = R; p.vy = -p.vy * 0.45; hit = "c"; }
      if (hit && p.k === "blood") { P.decals.push({ x: p.x, y: p.y, rx: R * rand(1.3, 2.4), ry: R * (hit === "f" ? 0.5 : 1.2), a: hit === "w" ? 1.57 : 0, c: p.c, life: 4, drip: hit !== "f" && Math.random() < 0.5, dl: 0, dripMax: rand(8, 30) }); if (P.decals.length > 140) P.decals.shift(); sp.splice(i, 1); continue; }
      if (hit && p.k === "case" && Math.abs(p.vy) + Math.abs(p.vx) > 90 && now - lastClink > 45) { lastClink = now; if (DP.sound.casing) DP.sound.casing(); }
      if (p.k === "blood") { x.fillStyle = p.c; x.beginPath(); const v = Math.min(3, Math.hypot(p.vx, p.vy) / 180); x.ellipse(p.x, p.y, R * (1 + v * 0.5), R, Math.atan2(p.vy, p.vx), 0, 6.283); x.fill(); }
      else if (p.k === "conf") { x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.scale(1, Math.sin(now / 160 + p.ph)); x.globalAlpha = Math.min(1, p.life); x.fillStyle = p.c; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.restore(); }
      else if (p.k === "case") { x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.globalAlpha = Math.min(1, p.life); const g = x.createLinearGradient(-p.w / 2, 0, p.w / 2, 0); g.addColorStop(0, "#7a5212"); g.addColorStop(0.45, "#ffd36b"); g.addColorStop(1, "#8a5d14"); x.fillStyle = g; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.fillStyle = "#5a3a0a"; x.fillRect(-p.w / 2, p.h / 2 - 2, p.w, 2); x.restore(); }
      else if (p.k === "ball") {
        for (let j = 0; j < i; j++) { const q = sp[j]; if (q.k !== "ball") continue; const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy), m = p.r + q.r; if (d > 0 && d < m) { const nx = dx / d, ny = dy / d, o = (m - d) / 2; p.x -= nx * o; p.y -= ny * o; q.x += nx * o; q.y += ny * o; const rv = (q.vx - p.vx) * nx + (q.vy - p.vy) * ny; if (rv < 0) { const imp = -rv * 0.9; p.vx -= nx * imp; p.vy -= ny * imp; q.vx += nx * imp; q.vy += ny * imp; } } }
        x.globalAlpha = Math.min(1, p.life); x.font = (p.r * 1.8) + "px system-ui"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(p.glyph, p.x, p.y + 1); x.globalAlpha = 1;
      }
    }
    if (sp.length || P.decals.length) raf = requestAnimationFrame(step); else { P.running = false; x.clearRect(0, 0, W, H); }
  }
  P.fling = function (dx, dy) { P.list.forEach(p => { p.vx += dx; p.vy += dy; }); wake(); };
  DP.phys = P;
  // tap splatter: small blood burst on taps that aren't on form controls / games / camera
  addEventListener("pointerdown", e => {
    const s = S(); if (!s.splatter || !s.particles) return;
    if (DP.games && DP.games.active) return;
    const t = e.target; if (t.closest && t.closest("input,select,textarea,.no-splat,#gameLayer,#lightLayer,.booth-stage,.sand-stage,#intro3")) return;
    P.splat(e.clientX, e.clientY, 6 + Math.floor(Math.random() * 4), null, 0.6);
  }, { passive: true });

  // ---------- transitions (each returns an Animation on `to`) ----------
  const cx = () => [innerWidth / 2, innerHeight * 0.45];
  function jag(k) { // 14-point jagged star polygon, radius scale k (same point count for interpolation)
    const pts = []; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r = (i % 2 ? 0.62 : 1) * k * (0.85 + ((i * 37) % 11) / 30); pts.push((50 + Math.cos(a) * r).toFixed(1) + "% " + (45 + Math.sin(a) * r * 0.62).toFixed(1) + "%"); }
    return "polygon(" + pts.join(",") + ")";
  }
  DP.trans3 = {
    shatter(to, from) {
      const [x0, y0] = cx(); DP.fx.shatter(x0, y0); DP.sound.shatter(); if (DP.fx.shock) DP.fx.shock(x0, y0, "#ffffff", 220); DP.haptic && DP.haptic("heavy");
      if (DP.core) DP.core.ach("shatter");
      from.animate([{ transform: "none", filter: "none" }, { transform: "scale(1.04) rotate(.8deg)", filter: "brightness(1.6) contrast(1.3)", offset: 0.15 }, { transform: "scale(.9) rotate(-2deg)", filter: "brightness(.3)" }], { duration: 640, easing: "ease-in" });
      return to.animate([{ clipPath: jag(0), webkitClipPath: jag(0) }, { clipPath: jag(0), webkitClipPath: jag(0), offset: 0.2 }, { clipPath: jag(160), webkitClipPath: jag(160) }], { duration: 640, easing: "cubic-bezier(.6,0,.3,1)" });
    },
    glitch(to, from) {
      DP.sound.static ? DP.sound.static() : DP.sound.swish();
      from.animate([{ opacity: 1, transform: "none" }, { opacity: 0.2, transform: "translateX(-14px) skewX(8deg)" }], { duration: 380, easing: "steps(5)" });
      const kf = []; for (let i = 0; i <= 8; i++) { const a = Math.random() * 80, b = a + 5 + Math.random() * 30; kf.push({ clipPath: i === 8 ? "inset(0 0 0 0)" : `inset(${a}% 0 ${100 - b}% 0)`, webkitClipPath: i === 8 ? "inset(0 0 0 0)" : `inset(${a}% 0 ${100 - b}% 0)`, transform: i === 8 ? "none" : `translateX(${(Math.random() * 30 - 15).toFixed(0)}px)`, filter: i === 8 ? "none" : `hue-rotate(${Math.floor(Math.random() * 360)}deg) saturate(3)` }); }
      return to.animate(kf, { duration: 420, easing: "steps(9, end)" });
    },
    claws(to, from) {
      DP.fx.claws(); (DP.sound.snikt || DP.sound.slash)(); DP.haptic && DP.haptic("medium");
      from.animate([{ transform: "none", opacity: 1 }, { transform: "translate(-3%,3%) rotate(2deg)", opacity: 0.3 }], { duration: 520, easing: "ease-in" });
      return to.animate([{ clipPath: "polygon(100% 0,100% 0,100% 0,100% 0)", webkitClipPath: "polygon(100% 0,100% 0,100% 0,100% 0)", opacity: 0.4 }, { clipPath: "polygon(100% 0,-100% 0,100% 200%,100% 0)", webkitClipPath: "polygon(100% 0,-100% 0,100% 200%,100% 0)", opacity: 1 }], { duration: 520, delay: 60, easing: "cubic-bezier(.7,0,.25,1)", fill: "backwards" });
    },
    portal(to, from) {
      const [x0, y0] = cx(); DP.sound.whoosh ? DP.sound.whoosh() : DP.sound.swish(); for (let i = 0; i < 3; i++) setTimeout(() => DP.fx.shock(x0, y0, i % 2 ? "#ffb13d" : "#ff7a1a", 280), i * 90);
      from.animate([{ transform: "none", opacity: 1 }, { transform: "scale(.85) rotate(-6deg)", opacity: 0.2 }], { duration: 560, easing: "ease-in" });
      return to.animate([{ clipPath: "circle(0% at 50% 45%)", webkitClipPath: "circle(0% at 50% 45%)", filter: "sepia(1) saturate(4) hue-rotate(-20deg)" }, { clipPath: "circle(110% at 50% 45%)", webkitClipPath: "circle(110% at 50% 45%)", filter: "none" }], { duration: 560, easing: "cubic-bezier(.5,0,.2,1)" });
    },
    fade(to, from) {
      from.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220 });
      return to.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: "ease-out" });
    }
  };

  // ---------- cinematic intro ----------
  const WORDS = ["SNIKT!", "BLAM!", "CHIMICHANGA!", "MAXIMUM EFFORT", "BANG!", "WHOOPS", "OW.", "KA-CHUNK", "ZOOM!", "FOURTH WALL?", "UNALIVED", "PEGGY!", "THWIP? NO.", "BAMF!", "DEFINITELY NOT A LAWSUIT"];
  const PAL = [["#d4121c", "#5a0006"], ["#ffc814", "#8a5b00"], ["#1f5fd6", "#08204f"], ["#111", "#000"], ["#ff5a1f", "#6a1800"], ["#eee", "#888"], ["#7a1cff", "#23004f"]];
  DP.intro = {
    shouldPlay() { const m = S().intro || "daily"; if (m === "never") return false; if (m === "always") return true; const k = new Date().toDateString(); return DP.core ? DP.core.LS.get("introDay", "") !== k : true; },
    play(manual) {
      if (document.getElementById("intro3")) return;
      const rm = !!S().reduceMotion;
      const el = document.createElement("div"); el.id = "intro3"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Intro. Tap to skip.");
      const panels = []; const nP = rm ? 0 : 16;
      for (let i = 0; i < nP; i++) {
        const [a, b] = PAL[i % PAL.length], w = WORDS[(i * 7 + (manual ? 3 : 0)) % WORDS.length];
        const kind = i % 4;
        panels.push(`<div class="in3-p" style="--a:${a};--b:${b};--r:${(i * 53) % 9 - 4}deg">${kind === 1 ? DP.maskSVG({ cls: "in3-mask", squint: i % 3 * 2 }) : kind === 3 ? `<div class="in3-kat">⚔️</div>` : ""}<b class="in3-w k${kind}">${w}</b></div>`);
      }
      el.innerHTML = `<div class="in3-flip">${panels.join("")}</div>
        <div class="in3-card"><div class="in3-strips"></div><div class="in3-title"><span class="in3-dp">DEADPOOL</span><span class="in3-watch">WATCH</span><span class="in3-3s">3S</span></div><div class="in3-sub">Now with 300% more unnecessary features.</div></div>
        <div class="in3-skip">TAP TO SKIP ▸</div>`;
      document.getElementById("app").appendChild(el);
      if (DP.core) DP.core.LS.set("introDay", new Date().toDateString());
      let done = false; const t0 = performance.now();
      const finish = () => { if (done) return; done = true; el.classList.add("out"); setTimeout(() => el.remove(), 450); if (performance.now() - t0 > 4200 && DP.core) DP.core.ach("intro_watch"); };
      el.addEventListener("pointerdown", e => { e.stopPropagation(); finish(); });
      const ps = el.querySelectorAll(".in3-p"), step = 115;
      if (DP.sound.riser) DP.sound.riser();
      ps.forEach((p, i) => setTimeout(() => { if (done) return; ps.forEach(q => q.classList.remove("on")); p.classList.add("on"); if (i % 3 === 0 && DP.sound.tick) DP.sound.tick(); }, i * step));
      const cardAt = nP * step + (rm ? 100 : 80);
      setTimeout(() => { if (done) return; el.classList.add("card"); if (DP.sound.impact) DP.sound.impact(); if (DP.gl) DP.gl.boom(1); }, cardAt);
      setTimeout(() => { if (done) return; el.classList.add("slam"); if (DP.sound.bang) DP.sound.bang(); if (DP.phys && !rm) DP.phys.confetti(70); }, cardAt + 650);
      setTimeout(finish, cardAt + (rm ? 2200 : 2700));
    }
  };
})();
