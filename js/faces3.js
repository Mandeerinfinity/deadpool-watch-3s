/* Deadpool Watch 3S — NEW faces, part 1: Snikt O'Clock, Void Storm, Deadpool Corps, Chimi-Clock. All original SVG/canvas art. */
(function () {
  const F = DP.faces, U = F.util, { pol, ticks, hands3, secHand } = U;
  const setText = F.setText, TAU = Math.PI * 2;
  const rnd = (a, b) => a + Math.random() * (b - a);
  let S3woof;

  // ---------- shared helpers for canvas faces ----------
  let fw = 0, fwAt = 0;
  addEventListener("resize", () => { fwAt = 0; });
  const P3 = DP.perf3 = {
    faceW() { const n = performance.now(); if (!fw || n - fwAt > 2000) { const w = document.getElementById("facesVp"); fw = w ? w.clientWidth : 320; fwAt = n; } return fw || 320; },
    dpr() { const s = DP.settings || {}, d = Math.min(3, devicePixelRatio || 1); return s.perf === "saver" ? Math.min(1.25, d) : s.perf === "max" ? Math.min(3, d) : Math.min(2, d); },
    frameMs() { const s = DP.settings || {}; return s.perf === "saver" ? 32 : s.perf === "max" ? 0 : 15; },
    reduced() { return !!(DP.settings && DP.settings.reduceMotion); }
  };
  F.P3 = P3;
  function fit(E, scale = 1) {
    const w = P3.faceW(), px = Math.max(64, Math.round(w * P3.dpr() * scale));
    if (E.cv.width !== px) { E.cv.width = px; E.cv.height = px; }
    E.k = px / 400; return true;
  }
  function gate(E, now) { const ms = P3.frameMs(); if (ms && now - (E.lastDraw || 0) < ms) return false; E.dt = Math.min(0.1, (now - (E.lastDraw || now)) / 1000); E.lastDraw = now; return true; }
  const accCache = {};
  function acc(which) { if (!accCache.base) { const cs = getComputedStyle(document.getElementById("app")); accCache.base = cs.getPropertyValue("--accent").trim() || "#d1121c"; accCache.hi = cs.getPropertyValue("--accent-hi").trim() || "#ff3b44"; accCache.lo = cs.getPropertyValue("--accent-lo").trim() || "#5e040a"; } return accCache[which] || accCache.base; }
  document.addEventListener("dp-theme", () => { delete accCache.base; });
  F.s3 = { fit, gate, P3, acc };

  // =====================================================================
  // FACE: SNIKT O'CLOCK (claws)
  // =====================================================================
  function slashPath(x1, y1, x2, y2, w, seed) {
    let s = seed || 1; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const n = 16, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = -dy / L, uy = dx / L, top = [], bot = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, taper = Math.sin(Math.PI * t) ** 0.7, cx = x1 + dx * t, cy = y1 + dy * t;
      top.push([cx + ux * w * taper * (0.55 + r() * 0.5), cy + uy * w * taper * (0.55 + r() * 0.5)]);
      bot.push([cx - ux * w * taper * (0.45 + r() * 0.5), cy - uy * w * taper * (0.45 + r() * 0.5)]);
    }
    const pts = top.concat(bot.reverse());
    return "M" + pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L") + "Z";
  }
  function slashes(seed) {
    const a = rnd(-1.2, -0.5), len = 300, cx = 200 + rnd(-20, 20), cy = 200 + rnd(-10, 30);
    let s = "";
    for (let k = -1; k <= 1; k++) {
      const off = k * 38, ox = -Math.sin(a) * off, oy = Math.cos(a) * off;
      const x1 = cx + ox - Math.cos(a) * len / 2, y1 = cy + oy - Math.sin(a) * len / 2, x2 = cx + ox + Math.cos(a) * len / 2, y2 = cy + oy + Math.sin(a) * len / 2;
      const d = slashPath(x1, y1, x2, y2, 13, (seed || 7) + k * 31 + 100);
      s += `<path d="${d}" fill="#140a02" stroke="#000" stroke-width="2"/><path d="${d}" fill="none" stroke="#ff3b1f" stroke-width="1" opacity=".55" transform="translate(1.5 1.5)"/>`;
    }
    return s;
  }
  F.register({
    id: "claws", name: "SNIKT O'CLOCK", analog: true, s3: true, art: ["#1f5fd6", "#ffc814", "\u2694"],
    make() {
      let idx = "";
      for (let i = 0; i < 12; i++) {
        const big = i % 3 === 0, [x, y] = pol(big ? 160 : 164, i * 30);
        idx += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${i * 30})"><path d="M-${big ? 7 : 4} -${big ? 14 : 9} L0 ${big ? 18 : 11} L${big ? 7 : 4} -${big ? 14 : 9} Z" fill="url(#clawGrad)" stroke="#111" stroke-width="1.6"/></g>`;
      }
      const hourClaw = `<path d="M-6 16 L-6 -60 Q-4 -84 2 -96 Q6 -80 6 -60 L6 16 Z" fill="url(#clawGrad)" stroke="#22303e" stroke-width="1"/><path d="M1.5 -8 L1.5 -86" stroke="#fff" stroke-width="1.2" opacity=".9"/><rect x="-12" y="4" width="24" height="16" rx="6" fill="#ffc814" stroke="#111" stroke-width="1.8"/>`;
      const minClaw = `<g class="claw-ext">${U.claws(146)}</g>`;
      const sec = `<line x1="0" y1="28" x2="0" y2="-170" stroke="#e8eef6" stroke-width="1.8"/><path d="M-3.5 -140 L0 -176 L3.5 -140 Z" fill="#ff2a36" stroke="#000" stroke-width=".8"/><circle r="5" fill="#1f5fd6" stroke="#fff" stroke-width="1.5"/>`;
      return `<svg viewBox="0 0 400 400" class="face-svg">
      <defs><clipPath id="clawClip"><circle cx="200" cy="200" r="184"/></clipPath>
        <radialGradient id="wvDial" cx="50%" cy="36%" r="72%"><stop offset="0" stop-color="#fff39a"/><stop offset=".42" stop-color="#ffc814"/><stop offset="1" stop-color="#7a4d00"/></radialGradient>
        <linearGradient id="wvBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a7bff"/><stop offset="1" stop-color="#0a2466"/></linearGradient>
        <path id="clawArc" d="M 26 200 A 174 174 0 0 1 374 200"/></defs>
      <circle cx="200" cy="200" r="199" fill="url(#bezelGrad)"/><circle cx="200" cy="200" r="186" fill="#0b0b0d"/>
      <g clip-path="url(#clawClip)">
        <rect width="400" height="400" fill="url(#wvDial)"/>
        <path d="M0 0 L128 0 C96 120 92 270 126 400 L0 400 Z" fill="url(#wvBlue)"/><path d="M400 0 L272 0 C304 120 308 270 274 400 L400 400 Z" fill="url(#wvBlue)"/>
        <path d="M128 0 C96 120 92 270 126 400 M272 0 C304 120 308 270 274 400" stroke="#000" stroke-width="5" fill="none"/>
        <path d="M112 40 C150 110 170 150 196 176 L200 190 L204 176 C230 150 250 110 288 40 C262 100 246 150 220 196 L200 214 L180 196 C154 150 138 100 112 40 Z" fill="#101014" opacity=".85"/>
        <rect width="400" height="400" fill="url(#halftoneRed)" opacity=".35"/>
        <g data-slash class="claw-slash">${slashes(11)}</g>
        ${idx}
      </g>
      <circle cx="200" cy="200" r="184" fill="none" stroke="#000" stroke-width="4"/>
      <text class="claw-arc"><textPath href="#clawArc" startOffset="50%" text-anchor="middle">SNIKT O'CLOCK &#8226; ADAMANTIUM GRADE &#8226; NO REFUNDS, BUB</textPath></text>
      <g transform="translate(200 300)"><path d="M-46 -16 L40 -16 Q50 -16 50 -6 L50 6 Q50 16 40 16 L-46 16 Q-50 0 -46 -16Z" fill="url(#steelGrad)" stroke="#111" stroke-width="2"/><circle cx="-38" cy="0" r="3.5" fill="#333"/><text x="4" y="7" class="claw-dig" data-dig>10:42</text></g>
      ${hands3(hourClaw, minClaw, sec)}
      <circle cx="200" cy="200" r="10" fill="#111" stroke="#ffc814" stroke-width="3"/><circle cx="200" cy="200" r="3.5" fill="#1f5fd6"/>
    </svg>`;
    },
    init(E, r) { E.sl = r.querySelector("[data-slash]"); E.strikes = 0; },
    tap(E) {
      E.sl.innerHTML = slashes(Math.floor(Math.random() * 99999) + 1);
      E.root.classList.remove("snikt"); void E.root.offsetWidth; E.root.classList.add("snikt");
      DP.sound.snikt(); if (DP.fx.claws && Math.random() < 0.5) DP.fx.claws();
      if (DP.haptic) DP.haptic("heavy");
      return "claws";
    },
    render(E, c) { setText(E.dig, "clawdig", c.t.full); }
  });

  // =====================================================================
  // FACE: VOID STORM (canvas)
  // =====================================================================
  function cloudSprite(col) {
    const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d");
    for (let i = 0; i < 9; i++) {
      const x = 64 + rnd(-26, 26), y = 64 + rnd(-18, 18), r = rnd(22, 40), gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, col + "cc"); gr.addColorStop(0.6, col + "44"); gr.addColorStop(1, col + "00");
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    }
    return c;
  }
  let stormSprites = null;
  function bolt(x1, y1, x2, y2, depth) {
    const segs = []; const walk = (ax, ay, bx, by, d, w) => {
      const n = 7, pts = [[ax, ay]];
      for (let i = 1; i < n; i++) { const t = i / n; pts.push([ax + (bx - ax) * t + rnd(-16, 16) * (1 - t * 0.3), ay + (by - ay) * t + rnd(-10, 10)]); }
      pts.push([bx, by]); segs.push({ pts, w });
      if (d > 0) for (let k = 0; k < 2; k++) { const p = pts[2 + Math.floor(Math.random() * 4)], a = Math.atan2(by - ay, bx - ax) + rnd(-0.9, 0.9), L = rnd(40, 90); walk(p[0], p[1], p[0] + Math.cos(a) * L, p[1] + Math.sin(a) * L, d - 1, w * 0.55); }
    };
    walk(x1, y1, x2, y2, depth, 3.2); return segs;
  }
  const DEBRIS = ["car", "rock", "sign", "chimi", "rock", "lamp"];
  F.register({
    id: "storm", name: "VOID STORM", s3: true, art: ["#1a0730", "#ff7a1f", "\u26A1"],
    make() { return `<div class="f3 storm"><canvas class="f3-cv"></canvas><div class="storm-time"><b data-t>10:42</b><small data-s>PM</small></div><div class="storm-cap" data-cap>THE VOID &bull; STORM FRONT</div></div>`; },
    init(E, r) {
      E.cv = r.querySelector("canvas"); E.cx = E.cv.getContext("2d"); E.t = r.querySelector("[data-t]"); E.s = r.querySelector("[data-s]"); E.cap = r.querySelector("[data-cap]");
      E.clouds = Array.from({ length: 64 }, (_, i) => ({ r: 30 + Math.pow(Math.random(), 0.7) * 190, a: rnd(0, TAU), sz: rnd(60, 150), sp: rnd(0.12, 0.35), k: i % 3 }));
      E.debris = DEBRIS.map((type, i) => ({ type, r: 110 + i * 11, a: i * 1.05, sp: rnd(0.15, 0.4) * (i % 2 ? 1 : -1), rot: rnd(0, 6), vr: rnd(-1, 1) }));
      E.bolts = []; E.nextBolt = 0; E.flash = 0; E.strikes = 0; E.eye = 0;
    },
    tap(E) { this.strike(E, true); return "storm"; },
    strike(E, user) {
      const a = rnd(0, TAU), x1 = 200 + Math.cos(a) * 210, y1 = 200 + Math.sin(a) * 210;
      E.bolts.push({ segs: bolt(x1, y1, 200 + rnd(-40, 40), 200 + rnd(-40, 40), 2), born: performance.now() }); E.flash = 1;
      if (user) { E.strikes++; DP.sound.thunder && DP.sound.thunder(); if (E.strikes >= 10) DP.core.ach("storm_10"); E.eye = 1; if (DP.haptic) DP.haptic("heavy"); }
    },
    render(E, c) {
      setText(E.t, "stT", `${c.t.hh}:${c.t.mm}`); setText(E.s, "stS", (c.t.ampm || "") + " \u2022 " + c.t.ss);
      if (!gate(E, c.now)) return; fit(E, 0.75);
      if (!stormSprites) stormSprites = [cloudSprite("#4a1a7a"), cloudSprite("#7a2a9a"), cloudSprite("#c2571f")];
      const g = E.cx, k = E.k, dt = E.dt || 0.016, t = c.now / 1000;
      g.setTransform(k, 0, 0, k, 0, 0);
      const bgG = g.createRadialGradient(200, 200, 10, 200, 200, 230); bgG.addColorStop(0, "#ff9a3a"); bgG.addColorStop(0.12, "#5a1a50"); bgG.addColorStop(0.55, "#1a0830"); bgG.addColorStop(1, "#05020a");
      g.fillStyle = bgG; g.fillRect(0, 0, 400, 400);
      // vortex clouds
      g.globalCompositeOperation = "lighter";
      for (const cl of E.clouds) {
        cl.a += cl.sp * dt * (1.6 - cl.r / 240) * (P3.reduced() ? 0.3 : 1);
        const x = 200 + Math.cos(cl.a) * cl.r, y = 200 + Math.sin(cl.a) * cl.r * 0.92;
        g.globalAlpha = 0.28 + 0.2 * Math.sin(cl.a * 3 + t);
        g.drawImage(stormSprites[cl.k], x - cl.sz / 2, y - cl.sz / 2, cl.sz, cl.sz);
      }
      g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
      // storm eye
      E.eye = Math.max(0, E.eye - dt * 0.4);
      const eo = 0.35 + 0.65 * E.eye + 0.1 * Math.sin(t * 1.3);
      g.save(); g.translate(200, 200);
      const eg = g.createRadialGradient(0, 0, 0, 0, 0, 44); eg.addColorStop(0, `rgba(255,220,140,${0.9 * eo})`); eg.addColorStop(0.35, `rgba(255,110,30,${0.6 * eo})`); eg.addColorStop(1, "rgba(80,0,60,0)");
      g.fillStyle = eg; g.beginPath(); g.arc(0, 0, 44, 0, TAU); g.fill();
      g.restore();
      // debris orbiting
      for (const d of E.debris) {
        d.a += d.sp * dt * (P3.reduced() ? 0.3 : 1); d.rot += d.vr * dt;
        const x = 200 + Math.cos(d.a) * d.r, y = 200 + Math.sin(d.a) * d.r * 0.9;
        g.save(); g.translate(x, y); g.rotate(d.rot); g.fillStyle = "#0a0410"; g.strokeStyle = "rgba(255,140,60,.55)"; g.lineWidth = 1.2;
        if (d.type === "car") { g.fillRect(-14, -5, 28, 9); g.fillRect(-8, -10, 15, 6); g.strokeRect(-14, -5, 28, 9); g.beginPath(); g.arc(-8, 5, 3.5, 0, TAU); g.arc(8, 5, 3.5, 0, TAU); g.fill(); }
        else if (d.type === "rock") { g.beginPath(); g.moveTo(-9, -4); g.lineTo(-2, -10); g.lineTo(9, -6); g.lineTo(10, 5); g.lineTo(0, 9); g.lineTo(-9, 5); g.closePath(); g.fill(); g.stroke(); }
        else if (d.type === "sign") { g.fillRect(-1.5, -2, 3, 18); g.fillStyle = "#1c7a3a"; g.fillRect(-14, -12, 28, 11); g.fillStyle = "#fff"; g.font = "bold 7px Oswald, sans-serif"; g.textAlign = "center"; g.fillText("EXIT \u2192", 0, -4); }
        else if (d.type === "chimi") { g.fillStyle = "#c98a3a"; g.beginPath(); g.ellipse(0, 0, 13, 6, 0, 0, TAU); g.fill(); g.strokeStyle = "#3a1d06"; g.stroke(); }
        else { g.fillRect(-1.5, -14, 3, 26); g.beginPath(); g.arc(0, -14, 4, 0, TAU); g.fillStyle = "#ffd27a"; g.fill(); }
        g.restore();
      }
      // lightning
      if (c.now > E.nextBolt) { E.nextBolt = c.now + rnd(2600, 6500); this.strike(E, false); }
      g.lineCap = "round"; g.lineJoin = "round";
      for (let i = E.bolts.length - 1; i >= 0; i--) {
        const b = E.bolts[i], age = (c.now - b.born) / 1000; if (age > 0.45) { E.bolts.splice(i, 1); continue; }
        const a = (1 - age / 0.45) * (Math.random() < 0.2 ? 0.4 : 1);
        for (const s of b.segs) {
          g.globalAlpha = a * 0.5; g.strokeStyle = "#b98aff"; g.lineWidth = s.w * 4; g.beginPath(); s.pts.forEach((p, j) => j ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke();
          g.globalAlpha = a; g.strokeStyle = "#fff"; g.lineWidth = s.w; g.stroke();
        }
      }
      g.globalAlpha = 1;
      if (E.flash > 0) { g.fillStyle = `rgba(210,180,255,${E.flash * 0.35})`; g.fillRect(0, 0, 400, 400); E.flash = Math.max(0, E.flash - dt * 3); }
      // seconds ring
      const si = Math.floor(c.s);
      for (let i = 0; i < 60; i++) { const [x, y] = pol(186, i * 6); g.fillStyle = i <= si ? (i % 5 ? "#ff9a3a" : "#fff") : "rgba(255,255,255,.12)"; g.beginPath(); g.arc(x, y, i % 5 ? 2 : 3.4, 0, TAU); g.fill(); }
      const vg = g.createRadialGradient(200, 200, 150, 200, 200, 205); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.7)"); g.fillStyle = vg; g.fillRect(0, 0, 400, 400);
      E.root.style.setProperty("--jit", E.flash > 0.3 ? (Math.random() * 4 - 2).toFixed(1) + "px" : "0px");
    }
  });

  // =====================================================================
  // FACE: DEADPOOL CORPS (8 variants roll call)
  // =====================================================================
  const eyePair = (w = 1) => `<path d="M-3 2 C-6 -10 -22 -14 -34 -10 L-35 6 C-24 10 -10 8 -3 5Z M3 2 C6 -10 22 -14 34 -10 L35 6 C24 10 10 8 3 5Z" fill="#0a0a0b"/>
    <g class="eyes"><g class="eye"><path d="M-30 -3 C-24 -9 -12 -8 -6 1 C-14 5 -24 4 -30 -3Z" fill="#fff" transform="scale(${w})"/></g><g class="eye"><path d="M30 -3 C24 -9 12 -8 6 1 C14 5 24 4 30 -3Z" fill="#fff" transform="scale(${w})"/></g></g>`;
  const baseMask = (fill = "url(#maskGrad)", w = 1) => `<circle r="42" fill="#000"/><circle r="39" fill="${fill}"/><path d="M0 -39 V39" stroke="#000" stroke-width="1.6" opacity=".35"/>${eyePair(w)}<path d="M-24 -26 C-12 -34 8 -35 22 -28" stroke="#fff" stroke-width="5" fill="none" opacity=".22" stroke-linecap="round"/>`;
  const CORPS = [
    ["Classic", baseMask()],
    ["Lady", `<path d="M20 -30 C44 -46 62 -20 54 8 C48 26 56 40 60 50 C40 40 44 16 38 0 C34 -12 28 -20 20 -24Z" fill="#f2cf63" stroke="#8a6414" stroke-width="2"/>${baseMask("url(#ladyDial)")}<path d="M-30 -3 l-6 -5 M-26 -7 l-4 -7" stroke="#000" stroke-width="2.4"/>`],
    ["Kidpool", `<g transform="scale(.86)">${baseMask("#e8302a", 1.35)}</g><path d="M-10 22 Q0 28 10 22" stroke="#000" stroke-width="2.5" fill="none"/>`],
    ["Headpool", `${baseMask()}<path d="M-30 -30 C-18 -50 18 -50 30 -30Z" fill="#ffc814" stroke="#000" stroke-width="2"/><rect x="-2" y="-58" width="4" height="12" fill="#333"/><g class="corps-prop" transform="translate(0 -58)"><ellipse cx="-14" rx="14" ry="3" fill="#d1121c" stroke="#000"/><ellipse cx="14" rx="14" ry="3" fill="#1f5fd6" stroke="#000"/></g>`],
    ["Dogpool", `<path d="M-30 -24 C-58 -28 -58 16 -40 26 C-36 8 -34 -4 -24 -12Z M30 -24 C58 -28 58 16 40 26 C36 8 34 -4 24 -12Z" fill="#e7ddcf" stroke="#222" stroke-width="2.5"/><circle r="39" fill="#efe6d8" stroke="#222" stroke-width="3"/><path d="M-38 -2 C-36 -30 -18 -40 0 -40 C18 -40 36 -30 38 -2 C20 6 -20 6 -38 -2Z" fill="url(#redGrad)"/>${eyePair(0.9)}<ellipse cx="0" cy="16" rx="8" ry="6" fill="#1a1a1a"/><path d="M2 22 C2 36 8 40 12 36 C14 32 10 26 8 22Z" fill="#ff7aa2" stroke="#222" stroke-width="1.6"/>`],
    ["Nicepool", `<path d="M-40 -8 C-46 -40 -10 -56 14 -52 C44 -46 50 -10 46 30 C40 14 40 0 36 -10 L-34 -10 C-36 6 -38 20 -44 30 C-44 16 -42 4 -40 -8Z" fill="url(#hairGrad)" stroke="#5a3418" stroke-width="1.5"/>${baseMask("url(#niceMask)")}<ellipse cx="-20" cy="16" rx="7" ry="3.5" fill="#ff9ab8"/><ellipse cx="20" cy="16" rx="7" ry="3.5" fill="#ff9ab8"/>`],
    ["Cowboypool", `${baseMask()}<ellipse cx="0" cy="-30" rx="58" ry="11" fill="#7a4a22" stroke="#2a1606" stroke-width="2.5"/><path d="M-26 -32 C-26 -64 26 -64 26 -32Z" fill="#8a5a2a" stroke="#2a1606" stroke-width="2.5"/><rect x="-26" y="-40" width="52" height="7" fill="#d1121c"/>`],
    ["Yarrpool", `${baseMask()}<path d="M-38 -14 C-20 -46 20 -46 38 -14 C20 -26 -20 -26 -38 -14Z" fill="#111"/><circle cx="-14" cy="-30" r="3" fill="#fff"/><path d="M-40 -8 L38 -32" stroke="#111" stroke-width="3"/><ellipse cx="18" cy="-2" rx="15" ry="10" fill="#111" stroke="#333"/>`]
  ];
  F.register({
    id: "corps", name: "DEADPOOL CORPS", s3: true, art: ["#5e040a", "#ffc814", "\u2726"],
    make() {
      let m = "";
      CORPS.forEach(([n, art], i) => { const [x, y] = pol(128, i * 45); m += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="corps-m" style="animation-delay:${i * 0.09}s" data-cm="${i}">${art}</g><text y="56" class="corps-lbl">${n.toUpperCase()}</text></g>`; });
      let tk = ""; for (let i = 0; i < 60; i++) { const [x1, y1] = pol(i % 5 ? 188 : 182, i * 6), [x2, y2] = pol(194, i * 6); tk += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" data-tk="${i}"/>`; }
      return `<svg viewBox="0 0 400 400" class="face-svg corps-svg">
      <defs><radialGradient id="corpsBg" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#3a0810"/><stop offset=".7" stop-color="#16060a"/><stop offset="1" stop-color="#050203"/></radialGradient></defs>
      <circle cx="200" cy="200" r="199" fill="url(#corpsBg)"/><circle cx="200" cy="200" r="199" fill="url(#halftone)"/>
      <g class="corps-rays">${Array.from({ length: 16 }, (_, i) => `<path d="M200 200 L${pol(240, i * 22.5 - 4).map(v => v.toFixed(1)).join(" ")} L${pol(240, i * 22.5 + 4).map(v => v.toFixed(1)).join(" ")} Z"/>`).join("")}</g>
      <g class="corps-tk" data-tks>${tk}</g>
      ${m}
      <circle cx="200" cy="200" r="70" fill="#060607" stroke="#000" stroke-width="4"/><circle cx="200" cy="200" r="66" fill="none" style="stroke:var(--accent)" stroke-width="2"/>
      <circle cx="200" cy="200" r="60" class="corps-prog" data-ring transform="rotate(-90 200 200)"/>
      <text x="200" y="182" class="corps-hd">THE CORPS</text>
      <text x="200" y="218" class="corps-time" data-dig>10:42</text>
      <text x="200" y="238" class="corps-sub" data-sub>ROLL CALL: 8/8</text>
    </svg>`;
    },
    init(E, r) { E.ring = r.querySelector("[data-ring]"); E.sub = r.querySelector("[data-sub]"); E.tks = [...r.querySelectorAll("[data-tk]")]; E.C = TAU * 60; E.ring.style.strokeDasharray = E.C; E.ms = [...r.querySelectorAll("[data-cm]")]; E.nextBlink = 0; },
    tap(E) {
      E.root.classList.remove("rollcall"); void E.root.offsetWidth; E.root.classList.add("rollcall");
      const n = CORPS[Math.floor(Math.random() * CORPS.length)][0]; setText(E.sub, "corpsSub", `${n.toUpperCase()} SAYS HI`);
      DP.sound.fanfare && DP.sound.fanfare();
      return "corps";
    },
    render(E, c) {
      setText(E.dig, "corpsdig", `${c.t.hh}:${c.t.mm}`);
      E.ring.style.strokeDashoffset = (E.C * (1 - c.s / 60)).toFixed(1);
      const si = Math.floor(c.s); if (E.si !== si) { E.si = si; E.tks.forEach((el, i) => el.classList.toggle("on", i <= si)); if (si === 0) this.tap(E); }
      if (c.now > E.nextBlink) { E.nextBlink = c.now + rnd(400, 1400); const m = E.ms[Math.floor(Math.random() * E.ms.length)], e = m.querySelector(".eyes"); if (e) { e.classList.remove("blink"); void e.getBoundingClientRect(); e.classList.add("blink"); setTimeout(() => e.classList.remove("blink"), 230); } }
      const L = F.look; if (E.lx !== L.x.toFixed(2)) { E.lx = L.x.toFixed(2); const tr = `translate(${(L.x * 4).toFixed(1)} ${(L.y * 3).toFixed(1)})`; E.ms.forEach(m => { const e = m.querySelector(".eyes"); if (e) e.setAttribute("transform", tr); }); }
    }
  });

  // =====================================================================
  // FACE: CHIMI-CLOCK (plate of 12 chimichangas; eaten ones = hours gone)
  // =====================================================================
  const chimiSVG = eaten => `<rect x="-19" y="-9" width="38" height="18" rx="9" fill="#e0a650" stroke="#3a1d06" stroke-width="2"/><path d="M-9 -8 Q-6 0 -9 8 M0 -9 Q3 0 0 9 M9 -8 Q12 0 9 8" stroke="#8a4a12" stroke-width="1.6" fill="none"/><path d="M-14 -5 L10 -5" stroke="#fff" stroke-width="1.6" opacity=".4"/>${eaten ? `<g class="bite"><circle cx="17" cy="-4" r="6.5"/><circle cx="19" cy="4" r="6"/><circle cx="12" cy="9" r="4.5"/></g><circle cx="26" cy="12" r="1.3" fill="#c98a3a"/><circle cx="24" cy="-12" r="1" fill="#c98a3a"/>` : ""}`;
  F.register({
    id: "chimi", name: "CHIMI-CLOCK", analog: true, s3: true, art: ["#e0a650", "#fbf1d6", "\uD83C\uDF2F"],
    make() {
      let rim = ""; for (let i = 0; i < 36; i++) { const [x, y] = pol(176, i * 10); rim += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#2a5db0" opacity=".75"/>`; }
      let ch = ""; for (let i = 0; i < 12; i++) { const [x, y] = pol(146, i * 30 || 360); ch += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${i * 30 + 90})" data-ch="${i === 0 ? 12 : i}"></g>`; }
      const knife = `<path d="M-4 18 L-4 -8 L4 -8 L4 18 Z" fill="#6a3a14" stroke="#2a1606" stroke-width="1.2"/><path d="M-4 -8 L-4 -78 Q2 -92 6 -80 L4 -8 Z" fill="url(#bladeGrad)" stroke="#333" stroke-width="1"/>`;
      const fork = `<path d="M-3 22 L-3 -96 L3 -96 L3 22 Z" fill="url(#steelGrad)" stroke="#333" stroke-width="1"/><path d="M-10 -96 L-10 -126 M-3.5 -96 L-3.5 -130 M3.5 -96 L3.5 -130 M10 -96 L10 -126 M-10 -96 Q0 -88 10 -96" stroke="#9aa1aa" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
      const drop = `<line y1="24" y2="-150" stroke="#b30f18" stroke-width="1.4" opacity=".7"/><path d="M0 -176 C-6 -166 -8 -160 -8 -156 A8 8 0 0 0 8 -156 C8 -160 6 -166 0 -176Z" fill="#e8302a" stroke="#5e040a" stroke-width="1.2"/><circle r="4" fill="#e8302a"/>`;
      return `<svg viewBox="0 0 400 400" class="face-svg">
      <defs><radialGradient id="plateG" cx="45%" cy="38%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#ece8df"/><stop offset="1" stop-color="#c9c3b6"/></radialGradient>
        <radialGradient id="salsaG" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ff6a3a"/><stop offset="1" stop-color="#9a1a08"/></radialGradient></defs>
      <circle cx="200" cy="200" r="199" fill="#2a1a10"/><circle cx="200" cy="200" r="199" fill="url(#leather)"/>
      <circle cx="200" cy="200" r="190" fill="url(#plateG)" stroke="#8a857a" stroke-width="2"/>${rim}
      <circle cx="200" cy="200" r="164" fill="none" stroke="#d8d2c4" stroke-width="2"/>
      <g class="chimi-ring" data-chs>${ch}</g>
      <g class="chimi-steam"><path d="M150 120 C140 104 160 96 150 80"/><path d="M250 120 C240 104 260 96 250 80"/><path d="M200 108 C190 92 210 84 200 68"/></g>
      <g transform="translate(200 272)"><path d="M-56 -20 L56 -20 L50 20 L-50 20 Z" fill="#fff" stroke="#bbb" stroke-width="1.5"/><path d="M-56 -20 L-30 0 L-50 20" fill="#f1ede4" stroke="#ccc"/><text y="9" class="chimi-dig" data-dig>10:42</text></g>
      <circle cx="200" cy="200" r="46" fill="#7a3a1a"/><circle cx="200" cy="200" r="42" fill="url(#salsaG)"/>
      ${[[-16, -10], [12, -18], [18, 8], [-6, 16], [-22, 10], [4, -2]].map(([x, y]) => `<circle cx="${200 + x}" cy="${200 + y}" r="${3 + Math.abs(x % 3)}" fill="${x % 2 ? "#3ab04a" : "#ffd54a"}" opacity=".9"/>`).join("")}
      <text x="200" y="130" class="chimi-cap">CHIMI O'CLOCK</text>
      <text x="200" y="146" class="chimi-sub" data-left>10 EATEN &#8226; 2 TO GO</text>
      ${hands3(knife, fork, drop)}
      <circle cx="200" cy="200" r="8" fill="#ddd" stroke="#555" stroke-width="2"/>
    </svg>`;
    },
    init(E, r) { E.chs = [...r.querySelectorAll("[data-ch]")]; E.left = r.querySelector("[data-left]"); E.hr = -1; E.refill = -1; },
    tap(E) {
      const eaten = E.chs.filter(g => g.dataset.eaten === "1");
      if (eaten.length) { const g = eaten[Math.floor(Math.random() * eaten.length)]; g.innerHTML = chimiSVG(false); g.dataset.eaten = "0"; g.classList.remove("pop"); void g.getBoundingClientRect(); g.classList.add("pop"); setTimeout(() => { E.hr = -1; }, 5000); }
      E.root.classList.remove("steamy"); void E.root.offsetWidth; E.root.classList.add("steamy");
      DP.sound.crunch ? DP.sound.crunch() : DP.sound.chop();
      const r = E.root.getBoundingClientRect(); DP.fx.burst(r.left + r.width / 2, r.top + r.height / 2, 18, ["#ffd54a", "#e0a650", "#c98a3a"]);
      return "chimi";
    },
    render(E, c) {
      setText(E.dig, "chimidig", c.t.full);
      const h12 = c.d.getHours() % 12;
      if (E.hr !== h12) {
        E.hr = h12;
        E.chs.forEach(g => { const n = +g.dataset.ch, eaten = (n % 12) < h12 && n !== 12 ? true : false, e = n === 12 ? false : n <= h12; g.innerHTML = chimiSVG(e); g.dataset.eaten = e ? "1" : "0"; });
        setText(E.left, "chimiLeft", `${h12} EATEN \u2022 ${12 - h12} TO GO`);
      }
    }
  });

  // =====================================================================
  // FACE: GOOD GIRL O'CLOCK (Peggy-style scruffy multiverse dog; original drawing)
  // =====================================================================
  const WOOF = ["WOOF!", "BORK!", "ARF!", "HRRMPH!", "BLEP!", "AWOO!"];
  S3woof = () => { const S = DP.sound; if (!S || !S._play) return S && S.bloop && S.bloop(); S._play(t => { S._tone(520, t, 0.09, "sawtooth", 0.16, 260); S._noise(t, 0.08, 0.3, "bandpass", 900, 500, 2); S._tone(430, t + 0.13, 0.12, "sawtooth", 0.14, 210); S._noise(t + 0.13, 0.1, 0.25, "bandpass", 800, 450, 2); }); };
  F.register({
    id: "peggy", name: "GOOD GIRL O'CLOCK", s3: true, analog: true, art: ["#8ec5ff", "#c9b08a", "\uD83D\uDC36"],
    make() {
      let paws = ""; for (let i = 0; i < 60; i++) { const [x, y] = pol(180, i * 6); paws += `<circle class="pg-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i % 5 ? 2.2 : 4.2}"/>`; }
      let bones = ""; for (let i = 1; i <= 12; i++) { const [x, y] = pol(160, i * 30); bones += `<text class="pg-num" x="${x.toFixed(1)}" y="${(y + 6).toFixed(1)}">${i}</text>`; }
      const bone = L => `<g><rect x="-4" y="${-L}" width="8" height="${L + 10}" rx="4" fill="#fff6e0" stroke="#5a4020" stroke-width="2"/><circle cx="-6" cy="${-L}" r="7" fill="#fff6e0" stroke="#5a4020" stroke-width="2"/><circle cx="6" cy="${-L}" r="7" fill="#fff6e0" stroke="#5a4020" stroke-width="2"/></g>`;
      const tuft = (x, y, r) => `<path d="M${x} ${y} l${-r} ${-r * 1.4} l${r * 0.5} ${r * 0.9} l${r * 0.2} ${-r * 1.5} l${r * 0.5} ${r * 1.3} l${r * 0.6} ${-r * 1.2} l${-r * 0.1} ${r * 1.6}Z" fill="#8a7358"/>`;
      return `<svg viewBox="0 0 400 400" class="face-svg pg-svg">
      <defs><radialGradient id="pgSky" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#d9f0ff"/><stop offset=".7" stop-color="#8ec5ff"/><stop offset="1" stop-color="#4a7fd0"/></radialGradient>
        <radialGradient id="pgFur" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#e3cfa8"/><stop offset=".7" stop-color="#b89a70"/><stop offset="1" stop-color="#7a6146"/></radialGradient></defs>
      <circle cx="200" cy="200" r="199" fill="url(#pgSky)"/>
      <path d="M1 262 Q100 236 200 250 T399 258 L399 300 A199 199 0 0 1 1 300Z" fill="#6cc46a"/><path d="M1 290 Q120 270 200 282 T399 288 L380 330 A199 199 0 0 1 20 330Z" fill="#4fa84e"/>
      <g class="pg-dots">${paws}</g>${bones}
      <g class="pg-tail"><path d="M252 300 C300 290 312 250 296 226" stroke="#8a7358" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M296 226 l-6 -12 l12 4 l2 -12 l6 12" fill="#8a7358"/></g>
      <ellipse cx="200" cy="318" rx="70" ry="44" fill="url(#pgFur)" stroke="#4a3622" stroke-width="3"/>
      <g class="pg-head">
        <g class="pg-ear l"><path d="M130 150 C92 140 78 200 96 246 C110 256 126 236 132 200Z" fill="#6e553c" stroke="#3a2a18" stroke-width="3"/></g>
        <g class="pg-ear r"><path d="M270 150 C308 140 322 200 304 246 C290 256 274 236 268 200Z" fill="#6e553c" stroke="#3a2a18" stroke-width="3"/></g>
        <path d="M200 110 C262 110 290 150 288 204 C286 256 250 290 200 290 C150 290 114 256 112 204 C110 150 138 110 200 110Z" fill="url(#pgFur)" stroke="#4a3622" stroke-width="3"/>
        ${tuft(176, 116, 10)}${tuft(204, 112, 12)}${tuft(226, 118, 9)}
        <ellipse cx="200" cy="244" rx="54" ry="38" fill="#efe1c4"/>
        <g class="pg-eyes"><circle cx="164" cy="190" r="22" fill="#fff" stroke="#3a2a18" stroke-width="3"/><circle cx="238" cy="186" r="18" fill="#fff" stroke="#3a2a18" stroke-width="3"/>
          <g data-pupils><circle cx="166" cy="192" r="10" fill="#1a0f06"/><circle cx="240" cy="188" r="8.5" fill="#1a0f06"/><circle cx="162" cy="187" r="3.4" fill="#fff"/><circle cx="237" cy="184" r="2.8" fill="#fff"/></g>
          <g class="pg-lids"><rect x="140" y="166" width="48" height="0" fill="#b89a70" data-lid/><rect x="218" y="166" width="42" height="0" fill="#b89a70" data-lid/></g></g>
        <path d="M184 222 Q200 212 216 222 Q214 236 200 238 Q186 236 184 222Z" fill="#1a0f06"/><ellipse cx="195" cy="222" rx="5" ry="2.4" fill="#fff" opacity=".5"/>
        <path d="M168 252 Q200 270 232 252" stroke="#3a2a18" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M214 254 l6 -12 l6 11" fill="#fff" stroke="#3a2a18" stroke-width="2"/>
        <g class="pg-tongue"><path d="M184 258 Q186 294 200 296 Q214 294 214 258Z" fill="#ff6f8f" stroke="#a02845" stroke-width="2.5"/><path d="M199 262 L199 286" stroke="#a02845" stroke-width="2"/></g>
        <path d="M150 290 Q200 312 250 290 L246 304 Q200 324 154 304Z" fill="#d4121c" stroke="#5e040a" stroke-width="2.5"/>
        <g transform="translate(200 318)"><circle r="17" fill="#ffc814" stroke="#6a4a00" stroke-width="2.5"/><text y="5" class="pg-tag" data-tag>10:42</text></g>
      </g>
      <g class="pg-hands">${hands3(bone(88), bone(128), `<line y1="22" y2="-150" stroke="#d4121c" stroke-width="2.4" stroke-linecap="round"/><circle cy="-150" r="7" fill="#d4121c"/><path d="M-4 -150 l4 -9 l4 9" fill="#fff"/>`)}</g>
      <circle cx="200" cy="200" r="7" fill="#5a4020"/>
      <rect x="112" y="52" width="176" height="46" rx="12" class="pg-sign"/><text x="200" y="86" class="pg-dig" data-dig>10:42</text>
      <text x="200" y="112" class="pg-sub" data-sub>WHO'S A GOOD GIRL</text>
      <g class="pg-woof" data-woof><path d="M290 110 l10 -24 l6 18 l18 -14 l-4 20 l22 2 l-18 12 l14 16 l-22 -4 l-2 20 l-12 -16 l-14 12 l2 -20 l-20 0 l18 -12Z" fill="#fff" stroke="#000" stroke-width="3"/><text x="312" y="126" class="pg-woof-t" data-wt>WOOF!</text></g>
    </svg>`;
    },
    init(E, r) { E.pup = r.querySelector("[data-pupils]"); E.lids = [...r.querySelectorAll("[data-lid]")]; E.tag = r.querySelector("[data-tag]"); E.sub = r.querySelector("[data-sub]"); E.wt = r.querySelector("[data-wt]"); E.dots = [...r.querySelectorAll(".pg-dot")]; E.si = -1; E.nextBlink = 0; E.pets = 0; },
    tap(E) {
      E.pets++; setText(E.wt, "pgw", WOOF[Math.floor(Math.random() * WOOF.length)]);
      E.root.classList.remove("woofing"); void E.root.offsetWidth; E.root.classList.add("woofing");
      setText(E.sub, "pgs", E.pets >= 10 ? "MAXIMUM GOOD GIRL" : ["WHO'S A GOOD GIRL", "SHE IS. OBVIOUSLY.", "PETS: " + E.pets, "10/10 WOULD PET"][E.pets % 4]);
      S3woof();
      const r = E.root.getBoundingClientRect(); DP.fx.burst(r.left + r.width / 2, r.top + r.height * 0.45, 16, ["#ff6f8f", "#ff3b6b", "#ffffff"]);
      if (E.pets === 10 && DP.core) DP.core.egg("peggy_pets");
      return "peggy";
    },
    render(E, c) {
      setText(E.dig, "pgdig", c.t.full); setText(E.tag, "pgtag", `${c.t.hh}:${c.t.mm}`);
      const si = Math.floor(c.s); if (E.si !== si) { E.si = si; E.dots.forEach((d, i) => d.classList.toggle("on", i <= si)); }
      const L = F.look; E.pup.setAttribute("transform", `translate(${(L.x * 6).toFixed(1)} ${(L.y * 5).toFixed(1)})`);
      if (c.now > E.nextBlink) { E.nextBlink = c.now + rnd(2200, 5200); E.lids.forEach(l => { l.setAttribute("height", "48"); setTimeout(() => l.setAttribute("height", "0"), 140); }); }
    }
  });
})();
