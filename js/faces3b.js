/* Deadpool Watch 3S — NEW faces, part 3: 16-Bit Merc (pixel arcade), Comic Panel (redraws every minute),
   Merc with a Mouth (lip-synced talking mask), Synthwave (neon 80s). */
(function () {
  const F = DP.faces, { pol } = F.util, setText = F.setText, { fit, gate, P3, acc } = F.s3, TAU = Math.PI * 2;
  const rnd = (a, b) => a + Math.random() * (b - a), pickA = a => a[Math.floor(Math.random() * a.length)];
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

  // =====================================================================
  // FACE: 16-BIT MERC
  // =====================================================================
  const FONT = { "0": "111101101101111", "1": "010110010010111", "2": "111001111100111", "3": "111001111001111", "4": "101101111001001", "5": "111100111001111", "6": "111100111101111", "7": "111001010010010", "8": "111101111101111", "9": "111101111001111",
    A: "010101111101101", B: "110101110101110", C: "011100100100011", D: "110101101101110", E: "111100110100111", F: "111100110100100", G: "011100101101011", H: "101101111101101", I: "111010010010111", J: "001001001101010", K: "101110100110101", L: "100100100100111", M: "101111111101101",
    N: "110101101101101", O: "010101101101010", P: "110101110100100", Q: "010101101110011", R: "110101110101101", S: "011100010001110", T: "111010010010010", U: "101101101101111", V: "101101101101010", W: "101101111111101", X: "101101010101101", Y: "101101010010010", Z: "111001010100111",
    ":": "000010000010000", "-": "000000111000000", " ": "000000000000000", "!": "010010010000010", "x": "000101010101000" };
  function ptext(g, s, x, y, col, sc = 1, center) {
    s = String(s).toUpperCase(); if (center) x -= Math.round((s.length * 4 - 1) * sc / 2);
    g.fillStyle = col;
    for (let i = 0; i < s.length; i++) { const f = FONT[s[i]] || FONT[" "]; for (let k = 0; k < 15; k++) if (f[k] === "1") g.fillRect(x + (i * 4 + (k % 3)) * sc, y + Math.floor(k / 3) * sc, sc, sc); }
  }
  const PAL = { K: "#0b0b10", R: "#e8202c", D: "#8a0a14", W: "#ffffff", S: "#c8d0da", Y: "#ffd23a", G: "#5a5a66", B: "#3a2a1a" };
  const HEAD = ["....KKKKKK......", "..KKRRRRRRKK..S.", ".KRRRRRRRRRRK.S.", ".KRKKKRRKKKRKS..", "KRKWWKRRKWWKRK..", "KRKKKKRRKKKKRK..", "KRRRRRRRRRRRRK..", ".KRRRRRRRRRRK...", "..KKRRRRRRKK....", "...KDDKKDDK.....", "..KRRKDDKRRK....", ".KRRKKDDKKRRK...", ".KRK.KRRK.KRK..."];
  const LEGS = [["...KRRKKRRK.....", "...KRK..KRK.....", "...KKK..KKK....."], ["....KRRRRK......", "...KRK.KRRK.....", "..KKK...KKK....."], ["..KRRK..KRRK....", ".KRK......KRK...", ".KKK......KKK..."]];
  function sprite(rows) { const c = document.createElement("canvas"); c.width = 16; c.height = rows.length; const g = c.getContext("2d"); rows.forEach((r, y) => [...r].forEach((ch, x) => { if (PAL[ch]) { g.fillStyle = PAL[ch]; g.fillRect(x, y, 1, 1); } })); return c; }
  let SPR = null;
  const BOT = ["..GGGGGG..", ".GKKKKKKG.", ".GKYKKYKG.", ".GGGGGGGG.", "..GSSSSG..", ".GGSSSSGG.", ".G.G..G.G.", "GG.GG.GG.G"];
  F.register({
    id: "arcade", name: "16-BIT MERC", s3: true, art: ["#2a1a5a", "#ffd23a", "\u25A3"],
    make() { return `<div class="f3 arcade"><canvas class="f3-cv px"></canvas><div class="arc-scan"></div></div>`; },
    init(E, r) {
      E.cv = r.querySelector("canvas"); E.cx = E.cv.getContext("2d"); E.cv.width = E.cv.height = 128;
      Object.assign(E, { x: 0, y: 0, vy: 0, score: 0, frame: 0, coins: [], bumps: [0, 0, 0, 0], digits: "----", bot: null, nextBot: 0, parts: [], slash: 0, city: Array.from({ length: 14 }, (_, i) => ({ x: i * 12, h: 14 + ((i * 37) % 26), w: 10 + (i % 3) * 2 })) });
    },
    jump(E) { if (E.y >= 0 && E.vy === 0) { E.vy = -150; DP.sound.jump ? DP.sound.jump() : DP.sound.coin(); } },
    tap(E) { this.jump(E); E.score += 100; E.coins.push({ x: 24, y: 70, vy: -90, life: 0.9 }); if (DP.haptic) DP.haptic("light"); return "arcade"; },
    render(E, c) {
      if (!gate(E, c.now)) return;
      if (!SPR) SPR = { a: sprite(HEAD.concat(LEGS[0])), b: sprite(HEAD.concat(LEGS[1])), j: sprite(HEAD.concat(LEGS[2])), bot: (() => { const cc = document.createElement("canvas"); cc.width = 10; cc.height = 8; const g = cc.getContext("2d"); BOT.forEach((r, y) => [...r].forEach((ch, x) => { if (PAL[ch]) { g.fillStyle = PAL[ch]; g.fillRect(x, y, 1, 1); } })); return cc; })() };
      const g = E.cx, dt = E.dt || 0.016, t = c.now / 1000, red = P3.reduced() ? 0.3 : 1;
      g.imageSmoothingEnabled = false;
      E.x += dt * 30 * red;
      // sky bands
      const bands = ["#1a0f3a", "#2a1a5a", "#4a2378", "#7a2e8a", "#c2427e", "#f06a6a", "#ffa35a"];
      bands.forEach((col, i) => { g.fillStyle = col; g.fillRect(0, i * 12, 128, 12); });
      // sun
      g.fillStyle = "#ffd23a"; for (let yy = -12; yy <= 12; yy++) { const w = Math.round(Math.sqrt(144 - yy * yy)); if ((yy > 2 && yy % 3 === 0)) continue; g.fillRect(96 - w, 64 + yy, w * 2, 1); }
      // stars
      g.fillStyle = "#fff"; for (let i = 0; i < 18; i++) { if ((i + Math.floor(t * 2)) % 5 === 0) continue; g.fillRect((i * 53) % 128, (i * 29) % 34, 1, 1); }
      // clouds
      g.fillStyle = "rgba(255,255,255,.75)"; for (let i = 0; i < 3; i++) { const cx = ((i * 50 - E.x * 0.3) % 170 + 170) % 170 - 20, cy = 18 + i * 9; g.fillRect(cx, cy, 16, 3); g.fillRect(cx + 3, cy - 2, 9, 2); }
      // city
      for (const b of E.city) { const bx = ((b.x - E.x * 0.6) % 168 + 168) % 168 - 20, by = 104 - b.h; g.fillStyle = "#1a1030"; g.fillRect(bx, by, b.w, b.h); g.fillStyle = "#ffd23a"; for (let wy = by + 3; wy < 100; wy += 5) for (let wx = bx + 2; wx < bx + b.w - 2; wx += 4) if (((wx * 7 + wy * 3 + b.h) % 5) < 2) g.fillRect(wx, wy, 1, 2); }
      // ground bricks
      g.fillStyle = "#3a8a2a"; g.fillRect(0, 104, 128, 3); g.fillStyle = "#b8562a"; g.fillRect(0, 107, 128, 21);
      g.fillStyle = "#6a2a10"; const off = Math.floor(E.x) % 8;
      for (let yy = 107; yy < 128; yy += 5) { g.fillRect(0, yy, 128, 1); for (let xx = -off + ((yy / 5) % 2 ? 4 : 0); xx < 128; xx += 8) g.fillRect(xx, yy, 1, 5); }
      // digit blocks
      const dg = `${c.t.hh.padStart(2, "0")}${c.t.mm}`;
      if (dg !== E.digits) { if (E.digits !== "----") { for (let i = 0; i < 4; i++) if (dg[i] !== E.digits[i]) { E.bumps[i] = 1; E.coins.push({ x: [24, 42, 70, 88][i] + 8, y: 36, vy: -80, life: 0.8 }); } this.jump(E); DP.sound && c.now > 3000 && F.renderIdx === F.list.findIndex(f => f.id === "arcade") && DP.sound.coin(); } E.digits = dg; }
      [24, 42, 70, 88].forEach((bx, i) => {
        E.bumps[i] = Math.max(0, E.bumps[i] - dt * 4); const by = 40 - Math.round(Math.sin(E.bumps[i] * Math.PI) * 5);
        g.fillStyle = "#0b0b10"; g.fillRect(bx - 1, by - 1, 18, 18); g.fillStyle = "#ffb020"; g.fillRect(bx, by, 16, 16); g.fillStyle = "#ffe07a"; g.fillRect(bx, by, 16, 2); g.fillRect(bx, by, 2, 16);
        g.fillStyle = "#8a4a00"; g.fillRect(bx + 14, by + 2, 2, 14); g.fillRect(bx + 2, by + 14, 14, 2);
        g.fillStyle = "#0b0b10"; [[1, 1], [14, 1], [1, 14], [14, 14]].forEach(([rx, ry]) => g.fillRect(bx + rx, by + ry, 1, 1));
        ptext(g, dg[i], bx + 5, by + 3, "#3a1a00", 2);
      });
      g.fillStyle = Math.floor(c.s) % 2 ? "#ffd23a" : "#fff"; g.fillRect(63, 44, 2, 2); g.fillRect(63, 50, 2, 2);
      // coins
      for (let i = E.coins.length - 1; i >= 0; i--) { const k = E.coins[i]; k.vy += 260 * dt; k.y += k.vy * dt; k.life -= dt; if (k.life <= 0) { E.coins.splice(i, 1); continue; } const w = Math.abs(Math.round(Math.sin(t * 20 + i) * 2)) + 1; g.fillStyle = "#ffd23a"; g.fillRect(k.x - w, k.y, w * 2, 6); g.fillStyle = "#fff"; g.fillRect(k.x - w + 1, k.y + 1, 1, 3); }
      // enemy bot
      if (!E.bot && c.now > E.nextBot) { E.bot = { x: 132 }; E.nextBot = c.now + rnd(7000, 14000); }
      if (E.bot) {
        E.bot.x -= dt * 26 * red; g.drawImage(SPR.bot, Math.round(E.bot.x), 96 + (Math.floor(t * 6) % 2));
        if (E.bot.x < 36) { E.slash = 0.25; for (let i = 0; i < 14; i++) E.parts.push({ x: E.bot.x + 5, y: 100, vx: rnd(-60, 60), vy: rnd(-120, -30), life: 0.8, c: pickA(["#5a5a66", "#ffd23a", "#c8d0da"]) }); E.score += 200; E.bot = null; }
      }
      for (let i = E.parts.length - 1; i >= 0; i--) { const p = E.parts[i]; p.vy += 300 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; if (p.life <= 0) { E.parts.splice(i, 1); continue; } g.fillStyle = p.c; g.fillRect(Math.round(p.x), Math.round(p.y), 1, 1); }
      // merc physics
      if (E.vy !== 0 || E.y < 0) { E.vy += 420 * dt; E.y += E.vy * dt; if (E.y >= 0) { E.y = 0; E.vy = 0; } }
      E.frame += dt * 9 * red; const spr = E.y < 0 ? SPR.j : (Math.floor(E.frame) % 2 ? SPR.a : SPR.b);
      g.drawImage(spr, 16, 88 + Math.round(E.y));
      if (E.slash > 0) { E.slash -= dt; g.fillStyle = "#fff"; for (let i = 0; i < 10; i++) g.fillRect(30 + i, 92 + Math.round(E.y) + (i % 3), 1, 1); }
      // HUD
      E.score += dt * 10;
      ptext(g, "MERC " + String(Math.floor(E.score)).padStart(6, "0"), 64, 12, "#fff", 1, true);
      ptext(g, "WORLD 3-S  TIME " + c.t.ss, 64, 19, "#ffd23a", 1, true);
      const hv = DP.cx ? DP.cx.heal() : 100, hearts = Math.max(1, Math.ceil(hv / 34));
      for (let i = 0; i < 3; i++) { const hx = 54 + i * 8, col = i < hearts ? "#e8202c" : "#3a3a44"; g.fillStyle = col; g.fillRect(hx, 27, 2, 2); g.fillRect(hx + 3, 27, 2, 2); g.fillRect(hx, 28, 5, 2); g.fillRect(hx + 1, 30, 3, 1); g.fillRect(hx + 2, 31, 1, 1); }
      ptext(g, (c.t.ampm || "") + " " + F.DAYS[c.d.getDay()].slice(0, 3), 64, 116, "#ffe07a", 1, true);
    }
  });

  // =====================================================================
  // FACE: COMIC PANEL (new page every minute)
  // =====================================================================
  const COLORS = ["#ffd23a", "#27c6ff", "#ff4f7a", "#9a5bff", "#3ad88a", "#ff8a3d", "#f4f1e6"];
  const LAYOUTS = [
    [[[16, 70], [384, 70], [384, 196], [16, 196]], [[16, 206], [196, 206], [196, 384], [16, 384]], [[206, 206], [384, 206], [384, 384], [206, 384]]],
    [[[16, 70], [196, 70], [196, 214], [16, 214]], [[206, 70], [384, 70], [384, 214], [206, 214]], [[16, 224], [384, 224], [384, 384], [16, 384]]],
    [[[16, 70], [384, 70], [384, 170], [16, 214]], [[16, 224], [384, 180], [384, 384], [16, 384]]],
    [[[16, 70], [230, 70], [180, 384], [16, 384]], [[240, 70], [384, 70], [384, 384], [190, 384]]]
  ];
  const WORDS = ["KRAK!", "SHINK!", "BLAM!", "SNIKT!", "WHUMP!", "POW!", "SPLAT!", "BAMF?", "THWACK!", "KA-CHUNK!", "YOINK!", "NOM!"];
  const LINES = ["Nick checks the time. AGAIN.", "Our hero, mid-snack.", "Meanwhile, in the Void...", "Previously: nothing happened.", "This panel was expensive.", "Not pictured: my good side.", "Plot twist: it's still today.", "Editor's note: he's lying.", "Artist quit. I drew this.", "Five minutes later: three minutes later.", "Chimichanga break. Canon.", "Legally distinct explosion."];
  const BUBBLES = ["Is it lunch yet?", "Don't read ahead!", "I can see you, Nick.", "Budget cuts, man.", "Love you 3000? Wrong franchise.", "Stay for the post-credits.", "I'm the hero here.", "Time is fake. Snacks are real.", "Who drew my butt like that?", "This is fine. Totally fine."];
  function bbox(poly) { const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]); return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; }
  function wrap(txt, n) { const w = txt.split(" "), L = []; let cur = ""; w.forEach(x => { if ((cur + " " + x).trim().length > n) { L.push(cur.trim()); cur = x; } else cur += " " + x; }); if (cur.trim()) L.push(cur.trim()); return L; }
  function scene(kind, b, d, uid) {
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2, m = Math.min(b.w, b.h);
    let s = "";
    const lines = (n, col) => { let o = ""; for (let i = 0; i < n; i++) { const a = i / n * TAU; o += `<line x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * 400).toFixed(0)}" y2="${(cy + Math.sin(a) * 400).toFixed(0)}" stroke="${col}" stroke-width="${2 + (i % 3)}" opacity=".35"/>`; } return o; };
    if (kind === "mask") {
      const r = m * 0.62;
      s += lines(28, "#fff") + `<g transform="translate(${cx} ${b.y + b.h * 0.72}) scale(${r / 100})"><circle r="100" fill="url(#maskGrad)" stroke="#000" stroke-width="6"/><path d="M-6 0 C-16 -40 -60 -54 -98 -44 L-100 20 C-60 26 -20 18 -6 8Z M6 0 C16 -40 60 -54 98 -44 L100 20 C60 26 20 18 6 8Z" fill="#0a0a0b"/><path d="M-84 -20 C-64 -34 -30 -30 -16 -2 C-40 6 -66 4 -84 -20Z M84 -20 C64 -34 30 -30 16 -2 C40 6 66 4 84 -20Z" fill="#fff"/><path d="M0 -100 V100" stroke="#000" stroke-width="3" opacity=".4"/></g>`;
    } else if (kind === "katana") {
      s += lines(20, "#000") + `<g transform="translate(${cx} ${cy}) rotate(-30)"><rect x="-${m * 0.55}" y="-4" width="${m * 1.1}" height="8" fill="url(#bladeGrad)" stroke="#000" stroke-width="2"/><rect x="${m * 0.35}" y="-7" width="${m * 0.22}" height="14" rx="3" fill="#111"/></g><g transform="translate(${cx} ${cy}) rotate(30)"><rect x="-${m * 0.55}" y="-4" width="${m * 1.1}" height="8" fill="url(#bladeGrad)" stroke="#000" stroke-width="2"/><rect x="${m * 0.35}" y="-7" width="${m * 0.22}" height="14" rx="3" fill="#111"/></g>`;
    } else if (kind === "chimi") {
      s += `<g transform="translate(${cx} ${cy + m * 0.12}) rotate(-12) scale(${m / 150})"><ellipse cx="0" cy="38" rx="80" ry="16" fill="#000" opacity=".25"/><rect x="-62" y="-22" width="124" height="48" rx="24" fill="#e0a650" stroke="#3a1d06" stroke-width="4"/><path d="M-30 -20 Q-24 2 -30 24 M0 -22 Q6 2 0 26 M30 -20 Q36 2 30 24" stroke="#8a4a12" stroke-width="3" fill="none"/><path d="M-30 -40 C-40 -54 -20 -60 -30 -76 M10 -44 C0 -58 20 -64 10 -80" stroke="#fff" stroke-width="4" fill="none" opacity=".7"/></g>`;
    } else if (kind === "clock") {
      const r = m * 0.38, H = (d.getHours() % 12 + d.getMinutes() / 60) * 30, M = d.getMinutes() * 6;
      s += lines(24, "#fff") + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#000" stroke-width="5"/>${Array.from({ length: 12 }, (_, i) => `<line x1="${cx}" y1="${cy - r + 4}" x2="${cx}" y2="${cy - r + 12}" stroke="#000" stroke-width="3" transform="rotate(${i * 30} ${cx} ${cy})"/>`).join("")}<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r * 0.5}" stroke="#000" stroke-width="6" stroke-linecap="round" transform="rotate(${H} ${cx} ${cy})"/><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r * 0.8}" stroke="#d1121c" stroke-width="4" stroke-linecap="round" transform="rotate(${M} ${cx} ${cy})"/>`;
    } else if (kind === "boom") {
      let st = ""; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, rr = (i % 2 ? 0.28 : 0.5) * m; st += (i ? "L" : "M") + (cx + Math.cos(a) * rr).toFixed(0) + " " + (cy + Math.sin(a) * rr).toFixed(0); }
      s += `<path d="${st}Z" fill="#ffd23a" stroke="#000" stroke-width="5"/><path d="${st}Z" fill="#ff4f1f" transform="translate(${cx} ${cy}) scale(.6) translate(${-cx} ${-cy})"/>`;
    } else if (kind === "claws") {
      s += lines(22, "#000") + [-1, 0, 1].map(k => `<path d="M${cx + k * m * 0.16 - 6} ${b.y + b.h} L${cx + k * m * 0.2} ${b.y + b.h * 0.18} L${cx + k * m * 0.16 + 6} ${b.y + b.h}Z" fill="url(#clawGrad)" stroke="#000" stroke-width="3"/>`).join("") + `<rect x="${cx - m * 0.3}" y="${b.y + b.h * 0.82}" width="${m * 0.6}" height="${b.h * 0.2}" fill="#ffc814" stroke="#000" stroke-width="4"/>`;
    } else if (kind === "dog") {
      s += `<g transform="translate(${cx} ${cy + m * 0.06}) scale(${m / 240})"><path d="M-60 -40 C-110 -50 -110 40 -76 60 C-70 20 -64 0 -44 -14Z M60 -40 C110 -50 110 40 76 60 C70 20 64 0 44 -14Z" fill="#e7ddcf" stroke="#000" stroke-width="6"/><ellipse rx="74" ry="80" fill="#efe6d8" stroke="#000" stroke-width="6"/><path d="M-72 -8 C-70 -50 -40 -74 0 -74 C40 -74 70 -50 72 -8 C40 4 -40 4 -72 -8Z" fill="url(#redGrad)" stroke="#000" stroke-width="5"/><path d="M-60 -20 C-46 -30 -22 -26 -12 -10 C-30 -4 -50 -6 -60 -20Z M60 -20 C46 -30 22 -26 12 -10 C30 -4 50 -6 60 -20Z" fill="#fff"/><ellipse cx="0" cy="26" rx="17" ry="12" fill="#111"/><path d="M2 38 C2 70 10 80 20 76 C26 70 20 52 14 40Z" fill="#ff7aa2" stroke="#000" stroke-width="4"/></g>`;
    } else if (kind === "void") {
      let sw = ""; for (let i = 0; i < 6; i++) sw += `<ellipse cx="${cx}" cy="${cy}" rx="${m * (0.12 + i * 0.08)}" ry="${m * (0.06 + i * 0.04)}" fill="none" stroke="${i % 2 ? "#ff9a3a" : "#b98aff"}" stroke-width="3" transform="rotate(${i * 22} ${cx} ${cy})" opacity=".8"/>`;
      s += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="#2a0d40"/>${sw}<circle cx="${cx}" cy="${cy}" r="${m * 0.06}" fill="#ffd27a"/>`;
    }
    return s;
  }
  function comicPage(d, t, seed) {
    const L = LAYOUTS[seed % LAYOUTS.length], kinds = ["mask", "katana", "chimi", "boom", "claws", "dog", "void", "clock"];
    const uid = "cp" + seed;
    let defs = "", body = "";
    const ks = kinds.slice().sort(() => Math.random() - 0.5);
    if (!ks.slice(0, L.length).includes("clock") && Math.random() < 0.5) ks[L.length - 1] = "clock";
    L.forEach((poly, i) => {
      const b = bbox(poly), pts = poly.map(p => p.join(",")).join(" "), id = `${uid}-${i}`, col = COLORS[(seed + i * 3) % COLORS.length];
      defs += `<clipPath id="${id}"><polygon points="${pts}"/></clipPath>`;
      const k = ks[i];
      body += `<g clip-path="url(#${id})"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="${col}"/><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="url(#halftoneRed)" opacity=".7"/>${scene(k, b, d, id)}`;
      if (k === "boom" || k === "katana" || k === "claws") { const w = k === "claws" ? "SNIKT!" : pickA(WORDS); body += `<text x="${b.x + b.w / 2}" y="${b.y + b.h / 2 + 12}" class="cp-word" transform="rotate(${rnd(-12, 12).toFixed(0)} ${b.x + b.w / 2} ${b.y + b.h / 2})">${w}</text>`; }
      if (i === L.length - 1 && k !== "boom") {
        const txt = pickA(BUBBLES), ls = wrap(txt, 16), bw = Math.min(b.w - 20, 150), bh = 18 + ls.length * 15, bx = b.x + b.w - bw - 8, by = b.y + 10;
        body += `<g><path d="M${bx + bw * 0.3} ${by + bh - 2} L${bx + bw * 0.18} ${by + bh + 18} L${bx + bw * 0.45} ${by + bh - 2}Z" fill="#fff" stroke="#000" stroke-width="3"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${bh / 2}" fill="#fff" stroke="#000" stroke-width="3"/>${ls.map((l, j) => `<text x="${bx + bw / 2}" y="${by + 20 + j * 15}" class="cp-bub">${esc(l)}</text>`).join("")}</g>`;
      }
      body += `</g><polygon points="${pts}" fill="none" stroke="#000" stroke-width="6" stroke-linejoin="round"/>`;
    });
    const cap = pickA(LINES);
    return `<svg viewBox="0 0 400 400" class="face-svg"><defs>${defs}</defs><rect width="400" height="400" fill="#f4f1e6"/><rect width="400" height="400" fill="url(#halftoneBrown)"/>
      ${body}
      <g transform="translate(200 40)"><rect x="-150" y="-26" width="300" height="50" fill="#ffd23a" stroke="#000" stroke-width="4" transform="skewX(-10)"/><text y="14" class="cp-time">${esc(t.hh + ":" + t.mm)} <tspan class="cp-ampm">${esc(t.ampm || "")}</tspan></text></g>
      <g transform="translate(200 ${L === LAYOUTS[2] ? 200 : 206})"><rect x="-120" y="-11" width="240" height="20" fill="#fff" stroke="#000" stroke-width="2.5"/><text y="5" class="cp-cap">${esc(cap)}</text></g>
      <text x="200" y="396" class="cp-issue">DEADPOOL WATCH 3S #${seed % 999 + 1}</text></svg>`;
  }
  F.register({
    id: "comic", name: "COMIC PANEL", s3: true, art: ["#ffd23a", "#27c6ff", "\u2637"],
    make() { return `<div class="f3 comic"><div class="cp-page" data-a></div><div class="cp-page" data-b></div></div>`; },
    init(E, r) { E.pa = r.querySelector("[data-a]"); E.pb = r.querySelector("[data-b]"); E.min = -1; E.seed = Math.floor(Math.random() * 500); E.pages = 0; },
    turn(E, c) {
      E.seed++; E.pages++;
      const [out, inn] = E.flip ? [E.pb, E.pa] : [E.pa, E.pb]; E.flip = !E.flip;
      inn.innerHTML = comicPage(c.d, c.t, E.seed); inn.className = "cp-page in"; out.className = "cp-page out";
      if (E.pages > 1 && F.renderIdx === F.list.findIndex(f => f.id === "comic")) DP.sound.swish();
    },
    tap(E) { E.forceTurn = true; E.taps = (E.taps || 0) + 1; if (E.taps >= 5) DP.core.ach("comic_5"); return "comic"; },
    render(E, c) { const k = c.d.getHours() * 60 + c.d.getMinutes(); if (k !== E.min || E.forceTurn) { E.min = k; E.forceTurn = false; this.turn(E, c); } }
  });

  // =====================================================================
  // FACE: MERC WITH A MOUTH (talking mask; lip-sync)
  // =====================================================================
  const synth = window.speechSynthesis;
  function pickVoice() {
    if (!synth) return null; const vs = synth.getVoices().filter(v => /^en/i.test(v.lang)), s = DP.settings || {};
    if (s.voiceName) { const v = vs.find(x => x.name === s.voiceName); if (v) return v; }
    for (const p of [/Daniel/i, /Aaron/i, /Fred/i, /Alex/i, /Arthur/i, /Google US English/i, /Samantha/i]) { const v = vs.find(x => p.test(x.name)); if (v) return v; }
    return vs[0] || null;
  }
  F.register({
    id: "mouth", name: "MERC WITH A MOUTH", s3: true, ownTap: true, art: ["#8a0a14", "#ff7a7a", "\uD83D\uDDE8"],
    make() {
      return `<div class="f3 mouthf"><svg viewBox="0 0 400 400" class="face-svg">
      <defs><radialGradient id="mouthIn" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="#1a0002"/><stop offset="1" stop-color="#4a0208"/></radialGradient><clipPath id="mouthClip"><circle cx="200" cy="200" r="184"/></clipPath></defs>
      <circle cx="200" cy="200" r="199" fill="url(#bezelGrad)"/>
      <g clip-path="url(#mouthClip)"><rect width="400" height="400" fill="url(#maskGrad)"/><rect width="400" height="400" fill="url(#halftoneRed)" opacity=".5"/>
        <path d="M200 10 V390" stroke="#000" stroke-width="3" opacity=".35"/><path d="M204 10 V390" stroke="#fff" stroke-width="1" opacity=".16"/>
        <path d="M192 176 C180 128 118 96 30 108 L20 226 C90 236 166 222 192 198 Z M208 176 C220 128 282 96 370 108 L380 226 C310 236 234 222 208 198 Z" fill="#0a0a0b"/>
        <g class="eyes"><g class="eye"><path d="M52 156 C92 132 150 146 176 184 C132 200 84 190 52 156 Z" fill="url(#eyeGrad)"/></g><g class="eye"><path d="M348 156 C308 132 250 146 224 184 C268 200 316 190 348 156 Z" fill="url(#eyeGrad)"/></g></g>
        <g data-brow><path d="M60 118 C110 96 160 104 186 130" stroke="#000" stroke-width="7" fill="none" opacity=".25"/><path d="M340 118 C290 96 240 104 214 130" stroke="#000" stroke-width="7" fill="none" opacity=".25"/></g>
        <g data-jaw><path data-cheekl d="M120 270 C130 300 150 318 170 322" stroke="#000" stroke-width="3" fill="none" opacity=".3"/><path data-cheekr d="M280 270 C270 300 250 318 230 322" stroke="#000" stroke-width="3" fill="none" opacity=".3"/>
          <path data-mouth fill="url(#mouthIn)" stroke="#000" stroke-width="3" d="M150 292 Q200 300 250 292 Q200 300 150 292Z"/><path data-lip d="M150 292 Q200 300 250 292" stroke="#ff8a8a" stroke-width="2" fill="none" opacity=".45"/></g>
        <path d="M70 70 C120 30 180 20 230 24" stroke="#fff" stroke-width="16" fill="none" opacity=".16" stroke-linecap="round"/></g>
      <circle cx="200" cy="200" r="184" fill="none" stroke="#000" stroke-width="5"/></svg>
      <div class="mo-time"><b data-t>10:42</b></div><div class="mo-cap" data-cap>Tap me. I'll tell you the time. With my MOUTH.</div></div>`;
    },
    init(E, r) { const q = s => r.querySelector(s); Object.assign(E, { mouth: q("[data-mouth]"), lip: q("[data-lip]"), jaw: q("[data-jaw]"), cl: q("[data-cheekl]"), cr: q("[data-cheekr]"), brow: q("[data-brow]"), t: q("[data-t]"), cap: q("[data-cap]"), open: 0, target: 0, pulse: 0, speakUntil: 0, typed: "", full: "", typeAt: 0, nextMutter: performance.now() + 25000, told: 0 }); },
    say(E, text, voice) {
      E.full = text; E.typed = ""; E.typeAt = performance.now(); E.cap.classList.add("on");
      const est = Math.max(1600, text.length * 68); E.speakUntil = performance.now() + est; E.voiced = false;
      if (voice && synth) {
        try {
          synth.cancel(); const u = new SpeechSynthesisUtterance(text.replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, "")); const v = pickVoice(); if (v) u.voice = v;
          const s = DP.settings || {}; u.rate = +s.rate || 1; u.pitch = +s.pitch || 1;
          u.onstart = () => { E.voiced = true; E.speakUntil = performance.now() + est * 1.6; };
          u.onboundary = () => { E.pulse = 1; };
          u.onend = () => { E.speakUntil = performance.now() + 150; E.voiced = false; };
          synth.speak(u);
        } catch (e) { }
      }
    },
    tap(E) {
      const d = new Date(), t = F.P3 && DP.core ? null : null;
      const h = d.getHours(), m = d.getMinutes(), h12 = h % 12 || 12, ap = h >= 12 ? "PM" : "AM";
      const timeTxt = DP.settings && DP.settings.h24 ? `${String(h).padStart(2, "0")} ${String(m).padStart(2, "0")}` : `${h12}:${String(m).padStart(2, "0")} ${ap}`;
      const lead = pickA(["It's", "The time is", "Listen up, Nick. It's", "Breaking news: it's", "Clock says", "Brace yourself. It's"]);
      const tail = DP.core ? DP.core.pick("mouth") : "";
      this.say(E, `${lead} ${timeTxt}. ${tail}`, true);
      E.told++; if (E.told >= 5 && DP.core) DP.core.egg("chatterbox"); if (DP.core) DP.core.ach("mouth_time");
      E.root.querySelector(".eyes") && F.eyes(Math.random() < 0.5 ? "wide" : "squint");
      document.dispatchEvent(new CustomEvent("dp-mouth"));
    },
    render(E, c) {
      setText(E.t, "moT", c.t.full + (c.t.ampm ? " " + c.t.ampm : ""));
      const now = c.now, talking = now < E.speakUntil || (synth && synth.speaking && E.voiced);
      if (!talking && E.cap.classList.contains("on") && now > E.speakUntil + 2500) E.cap.classList.remove("on");
      if (!talking && now > E.nextMutter && F.renderIdx === F.list.findIndex(f => f.id === "mouth") && DP.settings && DP.settings.autoQuips) { E.nextMutter = now + rnd(22000, 40000); this.say(E, `Psst. It's ${c.t.full}${c.t.ampm ? " " + c.t.ampm : ""}. ` + (DP.core ? DP.core.pick("mouth") : ""), false); }
      if (E.full && E.typed.length < E.full.length) { const n = Math.floor((now - E.typeAt) / 45); if (n > E.typed.length) { E.typed = E.full.slice(0, n); E.cap.textContent = E.typed; } }
      E.pulse = Math.max(0, E.pulse - 0.12);
      if (talking) { const syl = Math.abs(Math.sin(now / 70)) * (0.55 + 0.45 * Math.sin(now / 173)); E.target = Math.min(1, Math.max(syl, E.pulse)); }
      else E.target = 0;
      E.open += (E.target - E.open) * 0.35;
      const o = E.open, w = 50 - o * 8, up = 292 - 4 - o * 10, lo = 292 + 6 + o * 56;
      E.mouth.setAttribute("d", `M${200 - w} 292 Q200 ${up.toFixed(1)} ${200 + w} 292 Q200 ${lo.toFixed(1)} ${200 - w} 292Z`);
      E.lip.setAttribute("d", `M${200 - w} 292 Q200 ${up.toFixed(1)} ${200 + w} 292`);
      E.jaw.setAttribute("transform", `translate(0 ${(o * 7).toFixed(1)})`);
      E.brow.setAttribute("transform", `translate(0 ${(-o * 5).toFixed(1)})`);
      F.eyeT(E);
    }
  });

  // =====================================================================
  // FACE: SYNTHWAVE (neon 80s)
  // =====================================================================
  function palm(g, x, y, s, flip) {
    g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); g.fillStyle = "#07010f"; g.strokeStyle = "#07010f"; g.lineWidth = 5;
    g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(10, -60, 26, -120); g.stroke();
    for (let i = 0; i < 6; i++) { const a = -2.6 + i * 0.55; g.beginPath(); g.moveTo(26, -120); g.quadraticCurveTo(26 + Math.cos(a) * 40, -120 + Math.sin(a) * 40 - 12, 26 + Math.cos(a) * 64, -120 + Math.sin(a) * 64 + 14); g.lineWidth = 7 - i % 2 * 2; g.stroke(); }
    g.restore();
  }
  F.register({
    id: "neon", name: "SYNTHWAVE", s3: true, art: ["#2b0a57", "#ff2bd6", "\u25B2"],
    make() { return `<div class="f3 neon"><canvas class="f3-cv"></canvas></div>`; },
    init(E, r) { E.cv = r.querySelector("canvas"); E.cx = E.cv.getContext("2d"); E.zap = 0; E.stars = Array.from({ length: 60 }, () => [rnd(0, 400), rnd(0, 200), rnd(0.5, 1.8), rnd(0, 6)]); E.sun = document.createElement("canvas"); E.sun.width = E.sun.height = 200; },
    tap(E) { E.zap = 1; if (DP.music && DP.music.stab) DP.music.stab(); else DP.sound.sparkle(); return "neon"; },
    render(E, c) {
      if (!gate(E, c.now)) return; fit(E, 0.8);
      const g = E.cx, k = E.k, t = c.now / 1000, dt = E.dt || 0.016, HZ = 236, red = P3.reduced() ? 0.2 : 1;
      g.setTransform(k, 0, 0, k, 0, 0);
      const sky = g.createLinearGradient(0, 0, 0, HZ); sky.addColorStop(0, "#07021a"); sky.addColorStop(0.45, "#2b0a57"); sky.addColorStop(0.8, "#8a1a78"); sky.addColorStop(1, "#ff3b8a");
      g.fillStyle = sky; g.fillRect(0, 0, 400, HZ);
      for (const s of E.stars) { g.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * s[2] + s[3])); g.fillStyle = "#fff"; g.fillRect(s[0], s[1], s[2], s[2]); } g.globalAlpha = 1;
      // striped sun
      const sg = E.sun.getContext("2d"); sg.clearRect(0, 0, 200, 200);
      const sgr = sg.createLinearGradient(0, 20, 0, 180); sgr.addColorStop(0, "#fff36b"); sgr.addColorStop(0.5, "#ff9a3a"); sgr.addColorStop(1, "#ff2b8a");
      sg.fillStyle = sgr; sg.beginPath(); sg.arc(100, 100, 82 + E.zap * 6, 0, TAU); sg.fill();
      for (let i = 0; i < 7; i++) { const y = 100 + ((i * 13 + t * 8 * red) % 90), h = 2 + (y - 100) / 12; sg.clearRect(0, y, 200, h); }
      g.save(); g.shadowColor = "#ff5ab4"; g.shadowBlur = 40; g.drawImage(E.sun, 100, HZ - 158, 200, 200); g.restore();
      g.fillStyle = sky; g.fillRect(0, HZ, 400, 0);
      // mountains
      g.fillStyle = "#12012a"; g.strokeStyle = "#27e6ff"; g.lineWidth = 1.6;
      g.beginPath(); g.moveTo(0, HZ); [[30, 196], [70, 222], [110, 180], [150, 226], [180, 214], [220, HZ], [250, 210], [290, 186], [330, 220], [360, 194], [400, 216], [400, HZ]].forEach(p => g.lineTo(p[0], p[1])); g.closePath(); g.fill(); g.stroke();
      // grid floor
      const fl = g.createLinearGradient(0, HZ, 0, 400); fl.addColorStop(0, "#2a0450"); fl.addColorStop(1, "#060010"); g.fillStyle = fl; g.fillRect(0, HZ, 400, 400 - HZ);
      g.strokeStyle = "#ff2bd6"; g.lineWidth = 1.4; g.globalAlpha = 0.9;
      for (let i = -12; i <= 12; i++) { g.beginPath(); g.moveTo(200 + i * 8, HZ); g.lineTo(200 + i * 90, 400); g.stroke(); }
      const ph = (t * 0.6 * red) % 1;
      for (let i = 0; i < 12; i++) { const z = (i + ph) / 12, y = HZ + (400 - HZ) * z * z; g.globalAlpha = 0.25 + z * 0.75; g.beginPath(); g.moveTo(0, y); g.lineTo(400, y); g.stroke(); }
      g.globalAlpha = 1;
      const hg = g.createLinearGradient(0, HZ - 4, 0, HZ + 10); hg.addColorStop(0, "rgba(255,80,200,0)"); hg.addColorStop(0.5, "rgba(255,120,220,.9)"); hg.addColorStop(1, "rgba(255,80,200,0)"); g.fillStyle = hg; g.fillRect(0, HZ - 4, 400, 14);
      palm(g, 40, 330, 1.05, false); palm(g, 366, 320, 0.95, true);
      // chrome time
      const txt = `${c.t.hh}:${c.t.mm}`;
      g.textAlign = "center"; g.textBaseline = "alphabetic"; g.font = "italic 900 84px Orbitron, Bebas, sans-serif";
      g.save(); g.translate(200, 158); g.transform(1, 0, -0.12, 1, 0, 0);
      g.lineWidth = 10; g.strokeStyle = "rgba(39,230,255,.35)"; g.strokeText(txt, 0, 0);
      g.lineWidth = 3; g.strokeStyle = "#27e6ff"; g.strokeText(txt, 0, 0);
      const ch = g.createLinearGradient(0, -66, 0, 4); ch.addColorStop(0, "#f4fbff"); ch.addColorStop(0.45, "#8fb4e6"); ch.addColorStop(0.5, "#1a1040"); ch.addColorStop(0.62, "#ff8ad8"); ch.addColorStop(1, "#fff0fb");
      g.fillStyle = ch; g.fillText(txt, 0, 0); g.restore();
      const fl2 = Math.random() < 0.03 ? 0.35 : 1;
      g.font = "46px Vibes, cursive"; g.save(); g.translate(200, 212); g.rotate(-0.08); g.globalAlpha = fl2; g.shadowColor = "#ff2bd6"; g.shadowBlur = 16; g.fillStyle = "#ffd1f3"; g.fillText("Maximum Effort", 0, 0); g.restore(); g.globalAlpha = 1;
      g.font = "600 13px Oswald, sans-serif"; g.fillStyle = "#27e6ff"; g.fillText(`${c.t.ampm || ""} ${F.DAYS[c.d.getDay()]} \u2022 ${F.MONS[c.d.getMonth()]} ${c.d.getDate()}`.trim(), 200, 74);
      // seconds ring
      g.lineWidth = 4; g.strokeStyle = "#27e6ff"; g.shadowColor = "#27e6ff"; g.shadowBlur = 10; g.beginPath(); g.arc(200, 200, 192, -Math.PI / 2, -Math.PI / 2 + c.s / 60 * TAU); g.stroke(); g.shadowBlur = 0;
      if (E.zap > 0) { g.globalAlpha = E.zap; g.strokeStyle = "#ff2bd6"; g.lineWidth = 3; for (let i = 0; i < 5; i++) { const y = 60 + i * 60 + (1 - E.zap) * 40; g.beginPath(); g.moveTo(0, y); g.lineTo(400, y - 30); g.stroke(); } g.globalAlpha = 1; E.zap = Math.max(0, E.zap - dt * 2); }
    }
  });
})();
