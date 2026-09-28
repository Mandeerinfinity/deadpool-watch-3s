/* Deadpool Watch 3S — feature screens: Ask Deadpool, Multiverse Roulette, Daily Challenge + streaks, Widgets (spring gauges),
   Physics Sandbox, Soundtrack + Soundboard, Visual FX settings, plus glue: v2 import notice, intro, music, new eggs/achievements. */
(function () {
  "use strict";
  const K = DP.core, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const { LS, settings, saveSettings, stats, saveStats, say, pick, toast, ach, egg, go, onEnter, onFrame, esc, centerOf } = K;
  const F = K.F, rnd = (a, b) => a + Math.random() * (b - a);
  const bump = (k, n = 1) => { stats[k] = (stats[k] || 0) + n; saveStats(); };
  const todayKey = () => new Date().toDateString();

  // ---------- v2 import notice ----------
  const imp = LS.get("imported", null);
  if (imp && imp.pending) setTimeout(() => { toast("Imported your Deadpool Watch 2 progress (a copy, v2 is untouched)."); ach("imported"); imp.pending = false; LS.set("imported", imp); }, 4200);

  // ---------- reduce motion ----------
  const applyRM = () => { document.documentElement.classList.toggle("rm", !!settings.reduceMotion); };
  applyRM();

  // ---------- intro ----------
  if (DP.intro && DP.intro.shouldPlay()) setTimeout(() => DP.intro.play(false), 60);
  document.addEventListener("dp-hub-act", e => { if (e.detail === "act-intro") DP.intro.play(true); });

  // ---------- counters for challenges ----------
  document.addEventListener("dp-face", () => bump("faceviews"));
  document.addEventListener("dp-face-tap", () => bump("faceTaps"));

  // ---------- music glue ----------
  const M = DP.music;
  function musicUI() { const on = M && M.on; $$(".music-toggle").forEach(b => { b.classList.toggle("on", !!on); b.setAttribute("aria-pressed", on ? "true" : "false"); }); const pb = $("#musPlay"); if (pb) pb.textContent = on ? "\u275A\u275A PAUSE" : "\u25B6 PLAY"; const nm = $("#musName"); if (nm && M) nm.textContent = (M.styles.find(s => s.id === settings.musicStyle) || M.styles[0]).name; $$("#musStyles button").forEach(b => b.classList.toggle("on", b.dataset.st === settings.musicStyle)); }
  function toggleMusic(force) {
    if (!M) return; const want = force != null ? force : !M.on;
    if (want) { if (!M.start(settings.musicStyle)) { toast("Audio isn't available here."); return; } settings.music = true; ach("music"); if (Math.random() < 0.6) say(pick("soundtrack")); }
    else { M.stop(); settings.music = false; }
    saveSettings(); musicUI();
  }
  document.addEventListener("dp-music", musicUI);
  if (settings.music && M) { const kick = () => { removeEventListener("touchend", kick, true); removeEventListener("click", kick, true); setTimeout(() => { if (settings.music && !M.on) M.start(settings.musicStyle); musicUI(); }, 30); }; addEventListener("touchend", kick, true); addEventListener("click", kick, true); }
  let musicRun = 0;
  setInterval(() => { if (M && M.on) { bump("musicSec"); musicRun++; if (musicRun >= 60 && egg("needle_drop")) say("A full minute of my sick beats. You're officially a fan. There's no cure."); } else musicRun = 0; }, 1000);
  $$(".music-toggle").forEach(b => b.addEventListener("click", () => toggleMusic()));

  // ---------- Multiverse Roulette ----------
  const ACC = Object.keys(K.ACCENTS), SCN = DP.gl && DP.gl.scenes ? DP.gl.scenes.map(s => s.id) : ["plasma"];
  let lastRoll = -1;
  function applyRoll(fi, acc, scene) {
    settings.accent = acc; settings.wolverine = false; settings.scene = scene; saveSettings(); K.applyTheme(); if (DP.gl) DP.gl.setScene(scene); trackScene(scene);
    K.setFace(fi, false);
    bump("spins"); ach("roulette_1"); if ((stats.spins || 0) >= 10) ach("roulette_10");
    if (fi === lastRoll && egg("jackpot")) { DP.phys && DP.phys.confetti(160); DP.sound.cash && DP.sound.cash(); say("JACKPOT! Same universe twice. The multiverse is lazy today."); }
    lastRoll = fi; visualsUI();
  }
  function quickRoll() {
    const fi = Math.floor(Math.random() * F.list.length), acc = ACC[Math.floor(Math.random() * ACC.length)], sc = SCN[Math.floor(Math.random() * SCN.length)];
    applyRoll(fi, acc, sc); DP.fx.word("MULTIVERSE!", ""); DP.sound.whoosh ? DP.sound.whoosh() : DP.sound.swish(); if (DP.phys) DP.phys.confetti(60); if (DP.gl) DP.gl.boom(1);
    const uni = DP.ROULETTE[Math.floor(Math.random() * DP.ROULETTE.length)]; setTimeout(() => say(`${uni}: ${F.list[fi].name}. ` + pick("roulette")), 350);
  }
  const btnR = $("#btnRoulette"); if (btnR) btnR.addEventListener("click", quickRoll);
  // wheel
  const wc = $("#rouWheel"), wx = wc ? wc.getContext("2d") : null;
  const RW = { ang: 0, vel: 0, slices: [], spinning: false, lastIdx: -1 };
  function buildSlices() { const idx = F.list.map((f, i) => i).sort(() => Math.random() - 0.5).slice(0, 12); RW.slices = idx.map((fi, k) => ({ fi, acc: ACC[(k * 3 + Math.floor(Math.random() * 8)) % ACC.length], scene: SCN[Math.floor(Math.random() * SCN.length)], uni: DP.ROULETTE[(k + Math.floor(Math.random() * 16)) % DP.ROULETTE.length] })); }
  function drawWheel() {
    if (!wx) return; const r = wc.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1), W = Math.round(r.width * dpr); if (wc.width !== W) { wc.width = wc.height = W; }
    const c = W / 2, R = c * 0.94, n = RW.slices.length; wx.clearRect(0, 0, W, W);
    wx.save(); wx.translate(c, c); wx.rotate(RW.ang);
    RW.slices.forEach((s, i) => { const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2, A = K.ACCENTS[s.acc];
      wx.beginPath(); wx.moveTo(0, 0); wx.arc(0, 0, R, a0, a1); wx.closePath(); const g = wx.createRadialGradient(0, 0, R * 0.2, 0, 0, R); g.addColorStop(0, A[2]); g.addColorStop(1, i % 2 ? A[0] : A[1]); wx.fillStyle = g; wx.fill(); wx.strokeStyle = "#000"; wx.lineWidth = 3 * dpr; wx.stroke();
      const art = F.list[s.fi].art; wx.save(); wx.rotate((a0 + a1) / 2); wx.translate(R * 0.72, 0); wx.rotate(Math.PI / 2); wx.fillStyle = "#fff"; wx.font = `${Math.round(R * 0.13)}px system-ui`; wx.textAlign = "center"; wx.textBaseline = "middle"; wx.fillText(art ? art[2] : "\u2605", 0, 0); wx.restore(); });
    wx.restore();
    wx.beginPath(); wx.arc(c, c, R * 0.2, 0, 7); wx.fillStyle = "#111"; wx.fill(); wx.lineWidth = 4 * dpr; wx.strokeStyle = "#ffd54a"; wx.stroke();
    wx.fillStyle = "#ffd54a"; wx.font = `${Math.round(R * 0.11)}px Bangers, Impact, sans-serif`; wx.textAlign = "center"; wx.textBaseline = "middle"; wx.fillText("SPIN", c, c + 1);
  }
  function curIdx() { const n = RW.slices.length, a = ((-Math.PI / 2 - RW.ang) % (Math.PI * 2) + Math.PI * 4) % (Math.PI * 2); return Math.floor(a / (Math.PI * 2) * n) % n; }
  function spin() { if (RW.spinning) return; RW.spinning = true; RW.vel = rnd(16, 24); DP.sound.drumroll ? DP.sound.drumroll() : DP.sound.swish(); $("#rouResult").classList.remove("show"); if (DP.haptic) DP.haptic("medium"); }
  if (wc) {
    buildSlices();
    wc.addEventListener("click", spin); $("#rouSpin").addEventListener("click", spin);
    $("#rouGo").addEventListener("click", () => go("scr-watch"));
    onFrame("scr-roulette", (now, dt) => {
      if (RW.spinning) { RW.ang += RW.vel * dt; RW.vel *= Math.pow(0.42, dt); const i = curIdx(); if (i !== RW.lastIdx) { RW.lastIdx = i; DP.sound.tick(); }
        if (RW.vel < 0.25) { RW.spinning = false; RW.vel = 0; const s = RW.slices[curIdx()]; applyRoll(s.fi, s.acc, s.scene); const sc = DP.gl.scenes.find(x => x.id === s.scene) || { name: s.scene };
          $("#rouResult").innerHTML = `<small>YOU LANDED IN</small><b>${esc(s.uni)}</b><div class="rou-tags"><span>\uD83C\uDFAD ${esc(F.list[s.fi].name)}</span><span style="--c:${K.ACCENTS[s.acc][0]}">\uD83C\uDFA8 ${esc(K.ACCENTS[s.acc][3])}</span><span>\uD83C\uDFAC ${esc(sc.name)}</span></div><p>${esc(pick("roulette"))}</p>`;
          $("#rouResult").classList.add("show"); DP.sound.fanfare(); if (DP.phys) DP.phys.confetti(80); if (DP.gl) DP.gl.boom(1); say(pick("roulette")); } }
      drawWheel();
    });
    onEnter("scr-roulette", () => { if (!RW.spinning) buildSlices(); drawWheel(); });
  }
  DP.roulette = { quick: quickRoll, spin, RW };

  // ---------- Ask Deadpool ----------
  const askLog = $("#askLog"), askTri = $("#askTri"), ball = $("#askBall");
  function answer(q) {
    for (const [re, list, eg] of DP.ASK.kw) if (re.test(q)) { if (eg && egg(eg)) setTimeout(() => say(pick(eg === "peggy" ? "peggy" : "claws")), 1800); return list[Math.floor(Math.random() * list.length)]; }
    const r = Math.random(), cat = r < 0.4 ? "yes" : r < 0.75 ? "no" : "maybe";
    return DP.ASK[cat][Math.floor(Math.random() * DP.ASK[cat].length)];
  }
  let asking = false;
  function ask(q) {
    q = (q || "").trim(); if (asking) return; if (!q) q = ["Will today be awesome?", "Should I eat a chimichanga?", "Am I the main character?"][Math.floor(Math.random() * 3)];
    asking = true; const a = answer(q);
    askLog.insertAdjacentHTML("afterbegin", `<li class="me">${esc(q)}</li>`);
    ball.classList.remove("shake3"); void ball.offsetWidth; ball.classList.add("shake3"); askTri.classList.add("hide"); DP.sound.whoosh ? DP.sound.whoosh() : DP.sound.swish(); if (DP.haptic) DP.haptic("medium");
    setTimeout(() => { askTri.innerHTML = esc(a); askTri.classList.remove("hide"); askLog.insertAdjacentHTML("afterbegin", `<li class="dp">${esc(a)}</li>`); while (askLog.children.length > 12) askLog.lastChild.remove(); say(a); DP.sound.pop ? DP.sound.pop() : DP.sound.tick(); asking = false; }, 1100);
    bump("asks"); ach("ask_1"); if (stats.asks >= 10) ach("ask_10");
  }
  if (ball) {
    $("#askForm").addEventListener("submit", e => { e.preventDefault(); const i = $("#askIn"); ask(i.value); i.value = ""; i.blur(); });
    ball.addEventListener("click", () => ask($("#askIn").value));
    $("#askQuick").addEventListener("click", e => { const b = e.target.closest("button"); if (b) ask(b.textContent); });
    let lastShake = 0; addEventListener("devicemotion", e => { if (K.current !== "scr-ask") return; const a = e.accelerationIncludingGravity || e.acceleration; if (!a) return; const m = Math.hypot(a.x || 0, a.y || 0, a.z || 0); if (m > 24 && Date.now() - lastShake > 2500) { lastShake = Date.now(); ask(""); } });
  }

  // ---------- Daily challenge + streak ----------
  function seedFor(day) { let h = 2166136261; for (const ch of day) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function todays() { const s = seedFor(todayKey()), pool = DP.DAILY.slice(), out = []; let x = s; while (out.length < 3) { x = (Math.imul(x, 1103515245) + 12345) >>> 0; out.push(pool.splice(x % pool.length, 1)[0]); } return out; }
  const metricNow = m => m.metric === "moodLogs" ? (stats.moods || []).length : (stats[m.metric] || 0);
  function dayState() {
    let d = LS.get("daily", null);
    if (!d || d.day !== todayKey()) { const base = {}; todays().forEach(c => { if (!c.abs) base[c.id] = metricNow(c); }); d = Object.assign({ streak: 0, best: 0, last: "", hist: {} }, d || {}, { day: todayKey(), base, done: {} }); LS.set("daily", d); }
    return d;
  }
  function progress(c, d) {
    if (c.abs) { const g = c.metric.split(".")[1], t0 = new Date(); t0.setHours(0, 0, 0, 0); return (stats.games || []).filter(x => x.g === g && x.t >= +t0).reduce((m, x) => Math.max(m, x.s), 0); }
    return Math.max(0, metricNow(c) - (d.base[c.id] || 0));
  }
  function checkDaily(render) {
    const d = dayState(), list = todays(); let changed = false;
    list.forEach(c => { if (!d.done[c.id] && progress(c, d) >= c.n) { d.done[c.id] = Date.now(); changed = true; toast("DAILY CHALLENGE DONE: " + c.text); DP.sound.coin(); ach("daily_1"); } });
    if (changed && list.every(c => d.done[c.id]) && d.last !== d.day) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      d.streak = d.last === y.toDateString() ? d.streak + 1 : 1; d.best = Math.max(d.best, d.streak); d.last = d.day; d.hist[d.day] = 1;
      setTimeout(() => { say(pick("daily")); if (DP.phys) DP.phys.confetti(120); DP.sound.fanfare(); }, 600);
      if (d.streak >= 3) ach("streak_3"); if (d.streak >= 7) ach("streak_7");
    }
    if (changed) LS.set("daily", d);
    if (render || changed) renderDaily();
  }
  function renderDaily() {
    const el = $("#dailyList"); if (!el) return; const d = dayState(), list = todays();
    el.innerHTML = list.map(c => { const p = Math.min(c.n, progress(c, d)), ok = !!d.done[c.id]; return `<li class="${ok ? "done" : ""}"><i>${ok ? "\u2714" : "\u25CB"}</i><div><b>${esc(c.text)}</b><span class="dl-bar"><em style="transform:scaleX(${(p / c.n).toFixed(3)})"></em></span></div><small>${p}/${c.n}</small></li>`; }).join("");
    const y = new Date(); y.setDate(y.getDate() - 1); const alive = d.last === d.day || d.last === y.toDateString();
    $("#dailyStreak").textContent = alive ? d.streak : 0; $("#dailyBest").textContent = d.best;
    const cal = []; for (let i = 13; i >= 0; i--) { const t = new Date(); t.setDate(t.getDate() - i); const k = t.toDateString(); cal.push(`<span class="${d.hist[k] ? "hit" : ""} ${i === 0 ? "today" : ""}" title="${k}">${t.getDate()}</span>`); }
    $("#dailyCal").innerHTML = cal.join("");
    const next = new Date(); next.setHours(24, 0, 0, 0); const ms = next - new Date(); $("#dailyReset").textContent = `New dares in ${Math.floor(ms / 3600000)}h ${Math.floor(ms / 60000) % 60}m`;
  }
  onEnter("scr-daily", () => checkDaily(true));
  setInterval(() => checkDaily(K.current === "scr-daily"), 2500);

  // ---------- Widgets ----------
  const WG = [
    { id: "day", name: "DAY BURNED", unit: "%", kind: "ring", color: "#ff3b44", val: () => { const n = new Date(); return (n.getHours() * 3600 + n.getMinutes() * 60 + n.getSeconds()) / 864; } },
    { id: "year", name: "YEAR BURNED", unit: "%", kind: "ring", color: "#ffd54a", val: () => { const n = new Date(), s = new Date(n.getFullYear(), 0, 1), e = new Date(n.getFullYear() + 1, 0, 1); return (n - s) / (e - s) * 100; } },
    { id: "hunger", name: "CHIMI HUNGER", unit: "%", kind: "needle", color: "#ff8a3d", val: () => hunger() },
    { id: "sass", name: "SASS LEVEL", unit: "", kind: "needle", color: "#b47aff", val: () => 62 + 30 * Math.sin(Date.now() / 7000) + 6 * Math.sin(Date.now() / 1300) },
    { id: "steps", name: "STEPS / 10K", unit: "%", kind: "ring", color: "#4dffa0", val: () => Math.min(100, (stats.steps || 0) / 100), sub: () => (stats.steps || 0).toLocaleString() + " steps" },
    { id: "heal", name: "HEALING", unit: "%", kind: "ring", color: "#ff5aa0", val: () => parseInt(($("#healVal") || {}).textContent, 10) || 100 },
    { id: "wall", name: "4TH WALL", unit: "%", kind: "ring", color: "#58a6ff", val: () => Math.max(0, 100 - ((stats.walls || 0) % 10) * 10), sub: () => (stats.walls || 0) + " broken" },
    { id: "focus", name: "FOCUS TODAY", unit: "%", kind: "ring", color: "#ffc814", val: () => Math.min(100, (stats.focusToday || 0) * 25), sub: () => (stats.focusToday || 0) + "/4 blocks" }
  ];
  function hunger() { const h = LS.get("hunger", { v: 40, t: Date.now() }); return Math.min(100, h.v + (Date.now() - h.t) / 3600000 * 6); }
  const wgEl = $("#wgGrid");
  if (wgEl) {
    wgEl.innerHTML = WG.map(w => `<div class="wg ${w.kind}" data-w="${w.id}" style="--c:${w.color}"><svg viewBox="0 0 120 120">${w.kind === "ring" ? `<circle cx="60" cy="60" r="48" class="wg-track"/><circle cx="60" cy="60" r="48" class="wg-arc" transform="rotate(-90 60 60)"/>` : `<path d="M16 84 A48 48 0 1 1 104 84" class="wg-track"/><path d="M16 84 A48 48 0 1 1 104 84" class="wg-arc"/>${[0, 1, 2, 3, 4, 5, 6].map(i => { const a = (-210 + i * 40) * Math.PI / 180; return `<line x1="${60 + Math.cos(a) * 40}" y1="${60 + Math.sin(a) * 40}" x2="${60 + Math.cos(a) * 46}" y2="${60 + Math.sin(a) * 46}" class="wg-tick"/>`; }).join("")}<g class="wg-needle"><path d="M58 60 L60 20 L62 60 Z"/><circle cx="60" cy="60" r="6"/></g>`}</svg><b class="wg-val">0</b><span class="wg-name">${w.name}</span><small class="wg-sub"></small></div>`).join("");
    const st = WG.map(() => ({ v: 0, vel: 0 }));
    const RING = 2 * Math.PI * 48, ARC = 2 * Math.PI * 48 * (240 / 360);
    $$("#wgGrid .wg-arc").forEach((a, i) => { const L = WG[i].kind === "ring" ? RING : ARC; a.style.strokeDasharray = L; a.style.strokeDashoffset = L; });
    onEnter("scr-widgets", () => { st.forEach(s => { s.v = 0; s.vel = 0; }); ach("widgets"); });
    onFrame("scr-widgets", (now, dt) => {
      const els = wgEl.children;
      WG.forEach((w, i) => { const s = st[i], tgt = Math.max(0, Math.min(100, w.val())); const k = settings.reduceMotion ? 400 : 60, c = settings.reduceMotion ? 40 : 9; s.vel += (k * (tgt - s.v) - c * s.vel) * dt; s.v += s.vel * dt;
        const el = els[i], v = Math.max(0, Math.min(105, s.v)); const arc = el.querySelector(".wg-arc"), L = w.kind === "ring" ? RING : ARC; arc.style.strokeDashoffset = (L * (1 - Math.min(100, v) / 100)).toFixed(1);
        if (w.kind === "needle") el.querySelector(".wg-needle").style.transform = `rotate(${(-120 + v * 2.4).toFixed(1)}deg)`;
        el.querySelector(".wg-val").textContent = Math.round(Math.max(0, s.v)) + w.unit; const sb = el.querySelector(".wg-sub"); if (w.sub) sb.textContent = w.sub(); });
    });
    let feeds = [];
    $("#wgFeed").addEventListener("click", () => {
      const h = hunger(), now = Date.now(); feeds = feeds.filter(t => now - t < 8000); feeds.push(now);
      LS.set("hunger", { v: Math.max(0, h - 25), t: now }); DP.sound.crunch ? DP.sound.crunch() : DP.sound.chop();
      const [x, y] = centerOf($("#wgFeed")); DP.fx.burst(x, y, 12, ["#e0a650", "#ffd54a", "#ff8a3d"]);
      if (h < 5 && feeds.length >= 4) { feeds = []; if (egg("chimi_overload")) { DP.fx.boom(innerWidth / 2, innerHeight / 2, 40, ["#e0a650", "#ffd54a", "#ff3b1f"]); DP.sound.boom(); K.shake("shake-hard"); say("I'm... so... full. *BURP* That one registered on the Richter scale."); } }
      else say(pick(["Nom. Hunger reduced. Soul still empty.", "Chimichanga consumed. Tell my cardiologist nothing.", "Crunchy. Cheesy. Deep-fried. Like my personality."]));
    });
  }

  // ---------- Physics Sandbox ----------
  const sand = $("#sandStage");
  if (sand && DP.phys) {
    let tool = "blood", gmode = "tilt";
    const P = DP.phys;
    function setG(m) { gmode = m; $$("#sandGrav button").forEach(b => b.classList.toggle("on", b.dataset.g === m)); if (m === "tilt") { P.fixed = false; P.setGravity(0, 1); } else { P.fixed = true; P.setGravity(0, m === "down" ? 1 : m === "up" ? -1 : m === "zero" ? 0 : 1); } }
    $("#sandTools").addEventListener("click", e => { const b = e.target.closest("[data-t]"); if (!b) return; tool = b.dataset.t; $$("#sandTools button").forEach(x => x.classList.toggle("on", x === b)); DP.sound.tick(); });
    $("#sandGrav").addEventListener("click", e => { const b = e.target.closest("[data-g]"); if (b) { setG(b.dataset.g); DP.sound.tick(); } });
    $("#sandClear").addEventListener("click", () => { P.clear(); DP.sound.whoosh ? DP.sound.whoosh() : DP.sound.swish(); });
    $("#sandFling").addEventListener("click", () => { P.fling(rnd(-900, 900), -1100); DP.sound.whoosh ? DP.sound.whoosh() : DP.sound.swish(); K.shake(); });
    $("#sandTilt").addEventListener("click", async () => {
      try { if (typeof DeviceOrientationEvent !== "undefined" && DeviceOrientationEvent.requestPermission) { const r = await DeviceOrientationEvent.requestPermission(); if (r !== "granted") { toast("Tilt denied. Settings > Safari > Motion & Orientation Access."); return; } try { await DeviceMotionEvent.requestPermission(); } catch (_) { } } if (K.startMotion) K.startMotion(); setG("tilt"); settings.tiltGravity = true; saveSettings(); $("#sandTilt").textContent = "TILT ON \u2713"; $("#sandTilt").classList.add("done"); toast("Tilt the phone. Gravity follows. Newton is spinning in his grave. Tilt-ily."); }
      catch (err) { toast("Tilt permission failed: " + (err && err.message || err)); }
    });
    sand.addEventListener("pointerdown", e => {
      const x = e.clientX, y = e.clientY; ach("sandbox");
      if (tool === "blood") { P.splat(x, y, 22); DP.sound.splat && DP.sound.splat(); }
      else if (tool === "confetti") { P.confetti(60, x, y); DP.sound.pop ? DP.sound.pop() : DP.sound.tick(); }
      else if (tool === "pistol") { DP.sound.gun ? DP.sound.gun() : DP.sound.bang(); P.casings(1, x, y); DP.fx.burst(x, y, 10, ["#fff3a0", "#ffd54a", "#ff8a3d"]); DP.fx.shock(x, y, "#ffd54a", 60); if (DP.haptic) DP.haptic("medium"); }
      else if (tool === "shotgun") { DP.sound.shotgun ? DP.sound.shotgun() : DP.sound.boom(); P.casings(2, x, y); P.splat(x, y - 10, 30); K.shake(); if (DP.haptic) DP.haptic("heavy"); }
      else if (tool === "chimis") { P.balls(3, x, y); DP.sound.bloop ? DP.sound.bloop() : DP.sound.pop(); }
      if (Math.random() < 0.05) say(pick("sandbox"));
    });
    onEnter("scr-sandbox", () => setG(gmode));
    let wasSand = false; setInterval(() => { const on = K.current === "scr-sandbox"; if (wasSand && !on) { P.fixed = false; P.setGravity(0, 1); } wasSand = on; }, 500);
  }

  // ---------- Soundtrack + Soundboard ----------
  const sb = $("#sbGrid");
  if (sb) {
    sb.innerHTML = DP.SOUNDBOARD.map(([k, ic, n]) => `<button data-sfx="${k}"><i>${ic}</i><span>${n}</span></button>`).join("");
    sb.addEventListener("click", e => { const b = e.target.closest("[data-sfx]"); if (!b) return; const f = DP.sound[b.dataset.sfx]; if (f) f(); if (!settings.sound) toast("Sound effects are off in Settings."); b.classList.remove("hit"); void b.offsetWidth; b.classList.add("hit"); bump("sb"); if ((stats.sb || 0) >= 10) ach("soundboard_10"); const [x, y] = centerOf(b); DP.fx.burst(x, y, 8); if (DP.haptic) DP.haptic("light"); });
    if (M) $("#musStyles").innerHTML = M.styles.map(s => `<button data-st="${s.id}">${s.name.split(" (")[0]}<i>${s.bpm} BPM</i></button>`).join("");
    $("#musStyles").addEventListener("click", e => { const b = e.target.closest("[data-st]"); if (!b) return; settings.musicStyle = b.dataset.st; saveSettings(); if (M.on) { M.stop(); setTimeout(() => M.start(settings.musicStyle), 120); } else toggleMusic(true); musicUI(); });
    $("#musPlay").addEventListener("click", () => toggleMusic());
    const vol = $("#musVol"); vol.value = settings.musicVol; vol.addEventListener("input", () => { settings.musicVol = +vol.value; saveSettings(); M.setVol(settings.musicVol); });
    const vc = $("#musViz"), vx = vc.getContext("2d");
    onFrame("scr-sound", now => { const r = vc.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1), W = Math.round(r.width * dpr), H = Math.round(r.height * dpr); if (vc.width !== W || vc.height !== H) { vc.width = W; vc.height = H; } vx.clearRect(0, 0, W, H); const n = 32, bars = M && M.on ? M.bars(n) : new Array(n).fill(0).map((_, i) => 0.05 + 0.03 * Math.sin(now / 400 + i)); const bw = W / n; bars.forEach((v, i) => { const h = Math.max(3 * dpr, v * H * 0.95); const g = vx.createLinearGradient(0, H, 0, H - h); g.addColorStop(0, "#ff2a36"); g.addColorStop(1, "#ffd54a"); vx.fillStyle = g; vx.fillRect(i * bw + bw * 0.15, H - h, bw * 0.7, h); }); });
    onEnter("scr-sound", musicUI);
  }
  musicUI();

  // ---------- Visual FX screen ----------
  function trackScene(id) { stats.scenes = stats.scenes || {}; stats.scenes[id] = 1; saveStats(); if (SCN.every(s => stats.scenes[s])) ach("scene_all"); }
  function visualsUI() {
    $$("#sceneGrid [data-scene]").forEach(b => b.classList.toggle("on", b.dataset.scene === (settings.scene || "plasma")));
    $$("#segPerf button").forEach(b => b.classList.toggle("on", b.dataset.v === settings.perf));
    $$("#segIntro button").forEach(b => b.classList.toggle("on", b.dataset.v === settings.intro));
    $$("#segTrans button, #segTrans2 button").forEach(b => b.classList.toggle("on", b.dataset.v === settings.trans));
  }
  const sg = $("#sceneGrid");
  if (sg && DP.gl) {
    sg.innerHTML = DP.gl.scenes.map(s => `<button data-scene="${s.id}" class="scn scn-${s.id}"><i>${s.glyph}</i><b>${s.name}</b><span>${s.note}</span></button>`).join("");
    sg.addEventListener("click", e => { const b = e.target.closest("[data-scene]"); if (!b) return; DP.gl.setScene(b.dataset.scene); saveSettings(); trackScene(b.dataset.scene); if (!settings.shader) { settings.shader = true; saveSettings(); DP.gl.setVisible(true); const c = $('[data-set="shader"]'); if (c) c.checked = true; document.getElementById("app").classList.remove("no-shader"); } DP.gl.boom(1); DP.sound.whoosh ? DP.sound.whoosh() : DP.sound.swish(); visualsUI(); toast("Scene: " + b.querySelector("b").textContent); });
    $("#segPerf").addEventListener("click", e => { const b = e.target.closest("[data-v]"); if (!b) return; settings.perf = b.dataset.v; saveSettings(); DP.gl.applyPerf(); if (settings.perf === "saver") { ach("eco"); toast("Battery saver: lower-res background at 30 fps, fewer particles."); } visualsUI(); DP.sound.tick(); });
    $("#segIntro").addEventListener("click", e => { const b = e.target.closest("[data-v]"); if (!b) return; settings.intro = b.dataset.v; saveSettings(); visualsUI(); DP.sound.tick(); });
    $("#segTrans2").addEventListener("click", e => { const b = e.target.closest("[data-v]"); if (!b) return; settings.trans = b.dataset.v; saveSettings(); visualsUI(); DP.sound.tick(); });
    $("#segTrans").addEventListener("click", () => setTimeout(visualsUI, 0));
    $("#visIntro").addEventListener("click", () => DP.intro.play(true));
    $("#visGl").textContent = DP.gl.ok ? "WebGL OK" : "WebGL unavailable (CSS fallback)";
    onEnter("scr-visuals", () => { visualsUI(); const s = DP.gl.stats(); $("#visGl").textContent = DP.gl.ok ? `WebGL OK \u2022 ${Math.round(s.scale * 100)}% res \u2022 ~${s.fps} fps` : "WebGL unavailable (CSS fallback)"; });
    trackScene(settings.scene || "plasma");
    if (settings.scene && settings.scene !== "plasma") DP.gl.setScene(settings.scene);
  }
  // react to 3S toggles (app.js already saved them)
  $$("[data-set]").forEach(inp => inp.addEventListener("change", () => { const k = inp.dataset.set; if (k === "reduceMotion") applyRM(); if (k === "haptics" && inp.checked && DP.haptic) DP.haptic("success"); if (k === "tiltGravity" && !inp.checked && DP.phys) DP.phys.setGravity(0, 1); }));
  visualsUI();

  // ---------- post-credits egg + misc eggs ----------
  let fineTaps = []; $$(".fine").forEach(f => f.addEventListener("click", () => { const now = Date.now(); fineTaps = fineTaps.filter(t => now - t < 2500); fineTaps.push(now); if (fineTaps.length >= 3) { fineTaps = []; postCredits(); } }));
  function postCredits() {
    egg("postcredits");
    const el = document.createElement("div"); el.className = "postcredits"; el.innerHTML = `<div><small>POST-CREDITS SCENE</small><p>${esc(pick(["You actually sat through the fine print? Nobody does that. I'm touched. Weirdly.", "Deadpool Watch 4: coming never. Unless Nick asks nicely.", "Stay tuned for... nothing. Go home. The movie's over. Wait, this isn't a movie."]))}</p><button class="btn btn-red btn-small">OK, BYE</button></div>`;
    document.getElementById("app").appendChild(el); el.querySelector("button").addEventListener("click", () => el.remove()); DP.sound.impact ? DP.sound.impact() : DP.sound.boom();
  }
  setInterval(() => {
    const n = new Date(); if (n.getHours() % 12 === 11 && n.getMinutes() === 11 && egg("wish1111")) DP.phys && DP.phys.confetti(111);
    const ne = Object.keys(stats.eggs).length, na = DP.ACHIEVEMENTS.filter(a => stats.ach[a.id]).length;
    if (ne >= 15) ach("eggs_15"); if (na >= 30) ach("ach_30");
  }, 3000);
  // counts in labels
  const cc = $("#eggCount"); if (cc) cc.textContent = `${Object.keys(stats.eggs).length}/${DP.EGGS.length}`;
  DP.f3 = { toggleMusic, checkDaily, todays, quickRoll, ask };
})();
