/* Deadpool Watch 3S — extra synthesized SFX, a procedural soundtrack engine (3 original styles, no samples, no copyrighted music)
   and haptics (navigator.vibrate where it exists; iOS 18+ Safari gets a tiny switch-toggle haptic trick during taps). */
(function () {
  const S = DP.sound, T = (...a) => S._tone(...a), N = (...a) => S._noise(...a), play = S._play;
  // ---------- extra SFX ----------
  S.gun = () => play(t => { N(t, 0.12, 1, "lowpass", 5000, 400, 0.7); T(180, t, 0.12, "square", 0.3, 50); N(t + 0.01, 0.35, 0.25, "bandpass", 1200, 300, 1); });
  S.shotgun = () => play(t => { N(t, 0.4, 1, "lowpass", 3000, 120, 0.6); T(90, t, 0.3, "sine", 0.7, 35); });
  S.casing = () => play(t => { const f = 3800 + Math.random() * 1800; T(f, t, 0.18, "sine", 0.06); T(f * 1.51, t + 0.004, 0.12, "sine", 0.03); T(f * 0.8, t + 0.09, 0.1, "sine", 0.025); });
  S.thunder = () => play(t => { N(t, 1.8, 0.8, "lowpass", 900, 60, 0.8); T(55, t, 1.2, "sine", 0.5, 30); N(t + 0.05, 0.25, 0.6, "highpass", 3000, 1200, 0.7); });
  S.crunch = () => play(t => { for (let i = 0; i < 5; i++) N(t + i * 0.035, 0.05, 0.45, "bandpass", 1800 + Math.random() * 2000, 700, 2); });
  S.bloop = () => play(t => { T(280, t, 0.22, "sine", 0.35, 900); T(560, t + 0.06, 0.18, "sine", 0.12, 1400); });
  S.jump = () => play(t => T(300, t, 0.16, "square", 0.1, 900));
  S.flap = () => play(t => { N(t, 0.09, 0.35, "bandpass", 900, 400, 1.5); T(420, t, 0.08, "triangle", 0.1, 620); });
  S.laser = () => play(t => T(1800, t, 0.25, "sawtooth", 0.08, 120));
  S.whoosh = () => play(t => N(t, 0.5, 0.45, "bandpass", 300, 4000, 1.2));
  S.riser = () => play(t => { N(t, 1.6, 0.25, "bandpass", 200, 6000, 2); T(110, t, 1.6, "sawtooth", 0.05, 880); });
  S.impact = () => play(t => { T(70, t, 1.4, "sine", 0.9, 28); N(t, 0.9, 0.8, "lowpass", 2400, 60, 0.7); T(140, t, 0.3, "square", 0.15, 40); });
  S.splat = () => play(t => { N(t, 0.16, 0.6, "lowpass", 900, 150, 1); T(160, t, 0.12, "sine", 0.3, 60); });
  S.whack = () => play(t => { T(220, t, 0.12, "square", 0.25, 70); N(t, 0.08, 0.6, "lowpass", 1800, 300, 1); });
  S.eat = () => play(t => { T(660, t, 0.06, "square", 0.1); T(990, t + 0.06, 0.08, "square", 0.1); });
  S.buzzer = () => play(t => { T(140, t, 0.35, "sawtooth", 0.18); T(146, t, 0.35, "sawtooth", 0.14); });
  S.perfect = () => play(t => { T(1319, t, 0.1, "square", 0.08); T(1760, t + 0.05, 0.14, "square", 0.08); });
  S.ok = () => play(t => T(880, t, 0.08, "triangle", 0.12));
  S.miss = () => play(t => T(200, t, 0.18, "triangle", 0.2, 120));
  S.fart = () => play(t => { T(90, t, 0.45, "sawtooth", 0.25, 60); N(t, 0.45, 0.25, "lowpass", 400, 120, 4); });
  S.bruh = () => play(t => { T(150, t, 0.5, "sawtooth", 0.2, 110); T(75, t, 0.5, "square", 0.08, 55); });
  S.airhorn = () => play(t => { [0, 0.22, 0.44].forEach((d, i) => { [466, 470, 932].forEach(f => T(f, t + d, i === 2 ? 0.6 : 0.18, "sawtooth", 0.07)); }); });
  S.drumroll = () => play(t => { for (let i = 0; i < 24; i++) N(t + i * 0.045, 0.05, 0.2 + i * 0.012, "bandpass", 1500, 800, 1); N(t + 1.1, 0.5, 0.5, "highpass", 5000, 7000, 0.7); });
  S.sadTrombone = () => play(t => { [392, 370, 349, 330].forEach((f, i) => T(f, t + i * 0.36, i === 3 ? 1 : 0.34, "sawtooth", 0.1, i === 3 ? 300 : null)); });
  S.cash = () => play(t => { T(2093, t, 0.1, "square", 0.08); T(2637, t + 0.08, 0.3, "square", 0.08); N(t, 0.08, 0.3, "highpass", 6000, 8000, 1); });
  S.heartbeat = () => play(t => { T(60, t, 0.14, "sine", 0.8, 40); T(55, t + 0.22, 0.14, "sine", 0.6, 38); });

  // ---------- haptics ----------
  let hx = null;
  function iosTick() {
    try {
      if (!hx) { const l = document.createElement("label"); l.setAttribute("aria-hidden", "true"); l.style.cssText = "position:fixed;left:-99px;top:-99px;width:1px;height:1px;opacity:0;pointer-events:none"; const i = document.createElement("input"); i.type = "checkbox"; i.setAttribute("switch", ""); i.tabIndex = -1; l.appendChild(i); document.body.appendChild(l); hx = l; }
      hx.click();
    } catch (e) { }
  }
  DP.haptic = function (kind = "light") {
    if (DP.settings && DP.settings.haptics === false) return;
    const pat = { light: 10, medium: 22, heavy: [30, 30, 40], success: [15, 40, 25], fail: [60, 40, 60] }[kind] || 12;
    try { if (navigator.vibrate && navigator.vibrate(pat)) return; } catch (e) { }
    if (/iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) { iosTick(); if (kind === "heavy" || kind === "success" || kind === "fail") setTimeout(iosTick, 90); }
  };

  // ---------- procedural soundtrack ----------
  const M = { on: false, style: "synthwave", step: 0, next: 0, timer: 0, bus: null, verb: null, dly: null, startedAt: 0, level: 0 };
  const midi = n => 440 * Math.pow(2, (n - 69) / 12);
  function graph() {
    const c = S.ctx(); if (!c) return null;
    if (!M.bus) {
      M.bus = c.createGain(); M.bus.gain.value = 0;
      const comp = c.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
      M.bus.connect(comp); comp.connect(c.destination);
      // echo
      M.dly = c.createDelay(1); M.dly.delayTime.value = 0.36; const fb = c.createGain(); fb.gain.value = 0.32; const dl = c.createBiquadFilter(); dl.type = "lowpass"; dl.frequency.value = 2600;
      M.dly.connect(dl); dl.connect(fb); fb.connect(M.dly); dl.connect(M.bus);
      // cheap reverb: noise impulse
      M.verb = c.createConvolver(); const len = c.sampleRate * 1.8, ir = c.createBuffer(2, len, c.sampleRate);
      for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
      M.verb.buffer = ir; const vg = c.createGain(); vg.gain.value = 0.35; M.verb.connect(vg); vg.connect(M.bus);
      M.an = c.createAnalyser(); M.an.fftSize = 256; M.bus.connect(M.an); M.fft = new Uint8Array(M.an.frequencyBinCount);
    }
    return c;
  }
  function voice(c, t, f, dur, type, vol, opt = {}) {
    const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (opt.detune) o.detune.value = opt.detune;
    let node = o;
    if (opt.lp) { const fl = c.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.setValueAtTime(opt.lp, t); if (opt.lpEnd) fl.frequency.exponentialRampToValueAtTime(opt.lpEnd, t + dur); fl.Q.value = opt.q || 4; o.connect(fl); node = fl; }
    const a = opt.a || 0.005, r = opt.r || dur;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + a); g.gain.setValueAtTime(vol, t + Math.max(a, dur - r * 0.3)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + r * 0.2);
    node.connect(g); g.connect(M.bus); if (opt.send) g.connect(M.dly); if (opt.verb) g.connect(M.verb);
    o.start(t); o.stop(t + dur + r * 0.2 + 0.05);
  }
  function drum(c, t, kind, vol = 1) {
    if (kind === "kick") { const o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.14); g.gain.setValueAtTime(0.9 * vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.32); o.connect(g); g.connect(M.bus); o.start(t); o.stop(t + 0.35); return; }
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = S.noiseBuf();
    const P = { snare: ["bandpass", 1800, 0.18, 0.5], hat: ["highpass", 7000, 0.04, 0.16], ohat: ["highpass", 6500, 0.2, 0.12], clap: ["bandpass", 1200, 0.12, 0.45], brush: ["bandpass", 3500, 0.12, 0.08] }[kind];
    f.type = P[0]; f.frequency.value = P[1]; g.gain.setValueAtTime(P[3] * vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + P[2]);
    s.connect(f); f.connect(g); g.connect(M.bus); if (kind === "snare" || kind === "clap") g.connect(M.verb);
    s.start(t, Math.random() * 0.5); s.stop(t + P[2] + 0.05);
    if (kind === "snare") voice(c, t, 190, 0.08, "triangle", 0.2);
  }
  const STYLES = {
    synthwave: { bpm: 100, name: "Neon Regret (Synthwave)", chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]],
      step(c, t, st, sp) {
        const bar = Math.floor(st / 16) % 4, s = st % 16, ch = this.chords[bar];
        if (s % 4 === 0) drum(c, t, "kick"); if (s === 4 || s === 12) drum(c, t, "snare"); if (s % 2 === 0) drum(c, t, "hat", s % 4 === 2 ? 1.2 : 0.7);
        if (s % 2 === 0) voice(c, t, midi(ch[0] - 24 + (s % 4 === 2 ? 12 : 0)), sp * 1.7, "sawtooth", 0.16, { lp: 900, lpEnd: 300, q: 6 });
        const arp = [0, 1, 2, 1, 2, 0, 2, 1], n = ch[arp[s % 8]] + 12 + (s >= 8 ? 12 : 0);
        voice(c, t, midi(n), sp * 0.9, "square", 0.05, { lp: 3200, lpEnd: 1200, send: true });
        if (s === 0) ch.forEach((nn, i) => { voice(c, t, midi(nn), sp * 15, "sawtooth", 0.035, { lp: 1400, a: 0.4, r: 0.8, detune: i * 7 - 7, verb: true }); voice(c, t, midi(nn), sp * 15, "sawtooth", 0.03, { lp: 1200, a: 0.5, r: 0.8, detune: 9 - i * 5 }); });
        if (bar === 3 && s === 14) drum(c, t, "clap");
      } },
    chiptune: { bpm: 140, name: "8-Bit Unaliving (Chiptune)", scale: [0, 3, 5, 7, 10, 12, 15], roots: [45, 41, 43, 40],
      step(c, t, st, sp) {
        const bar = Math.floor(st / 16) % 4, s = st % 16, root = this.roots[bar];
        if (s % 4 === 0) drum(c, t, "kick", 0.7); if (s % 8 === 4) drum(c, t, "snare", 0.8); if (s % 2 === 1) drum(c, t, "hat", 0.6);
        if (s % 2 === 0) voice(c, t, midi(root - 12 + (s % 4 ? 7 : 0)), sp * 1.6, "triangle", 0.22);
        const seed = (st * 7919 + bar * 104729) % 97;
        if (s % 2 === 0 || seed % 3 === 0) { const n = root + 12 + this.scale[(seed + s) % this.scale.length]; voice(c, t, midi(n), sp * 0.8, "square", 0.06, { send: s % 8 === 0 }); }
      } },
    lounge: { bpm: 88, name: "Elevator to the Void (Lounge)", chords: [[50, 53, 57, 60], [55, 59, 62, 65], [48, 52, 55, 59], [57, 60, 64, 67]],
      step(c, t, st, sp) {
        const bar = Math.floor(st / 16) % 4, s = st % 16, ch = this.chords[bar];
        if (s % 4 === 0) drum(c, t, "brush", 1.2); if (s % 4 === 2) drum(c, t, "brush", 0.7); if (s === 8) drum(c, t, "kick", 0.4);
        if (s % 4 === 0) { const walk = [0, 4, 7, 9][s / 4]; voice(c, t, midi(ch[0] - 12 + walk), sp * 3.6, "triangle", 0.2); }
        if (s === 0 || s === 10) ch.forEach((n, i) => { voice(c, t + i * 0.012, midi(n), sp * 5, "sine", 0.05, { a: 0.01, r: 0.6, verb: true }); voice(c, t + i * 0.012, midi(n + 12), sp * 3, "triangle", 0.012, {}); });
        if (s % 3 === 0 && (st * 13) % 5 > 1) voice(c, t, midi(ch[(st + s) % 4] + 24), sp * 1.8, "sine", 0.04, { send: true, verb: true });
      } }
  };
  function tick() {
    const c = S.ctx(); if (!c || !M.on) return;
    const st = STYLES[M.style] || STYLES.synthwave, sp = 60 / st.bpm / 4;
    if (M.next < c.currentTime) M.next = c.currentTime + 0.05;
    while (M.next < c.currentTime + 0.14) { try { st.step(c, M.next, M.step, sp); } catch (e) { } M.step++; M.next += sp; }
  }
  M.styles = Object.keys(STYLES).map(k => ({ id: k, name: STYLES[k].name, bpm: STYLES[k].bpm }));
  M.start = function (style) {
    if (style) M.style = style;
    const c = graph(); if (!c) return false;
    if (c.state === "suspended") c.resume();
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) { }
    const vol = DP.settings ? +DP.settings.musicVol || 0.6 : 0.6;
    M.bus.gain.cancelScheduledValues(c.currentTime); M.bus.gain.setTargetAtTime(0.55 * vol, c.currentTime, 0.4);
    if (!M.on) { M.on = true; M.step = 0; M.next = c.currentTime + 0.08; M.startedAt = performance.now(); clearInterval(M.timer); M.timer = setInterval(tick, 25); tick(); }
    document.dispatchEvent(new CustomEvent("dp-music", { detail: { on: true, style: M.style } }));
    return true;
  };
  M.stop = function () {
    const c = S.ctx(); M.on = false; clearInterval(M.timer); M.timer = 0;
    if (c && M.bus) { M.bus.gain.cancelScheduledValues(c.currentTime); M.bus.gain.setTargetAtTime(0, c.currentTime, 0.12); }
    document.dispatchEvent(new CustomEvent("dp-music", { detail: { on: false } }));
  };
  M.setVol = v => { const c = S.ctx(); if (c && M.bus && M.on) M.bus.gain.setTargetAtTime(0.55 * v, c.currentTime, 0.1); };
  M.stab = function () { const c = graph(); if (!c || !S.isUnlocked() || (DP.settings && !DP.settings.sound && !M.on)) return; if (c.state === "suspended") c.resume(); if (!M.on) M.bus.gain.setTargetAtTime(0.5, c.currentTime, 0.01); const t = c.currentTime + 0.01; [57, 60, 64, 69].forEach((n, i) => voice(c, t, midi(n + 12), 0.5, "sawtooth", 0.07, { lp: 3000, lpEnd: 500, detune: i * 6, send: true, verb: true })); if (!M.on) setTimeout(() => { if (!M.on) M.bus.gain.setTargetAtTime(0, c.currentTime, 0.3); }, 900); };
  M.level = function () { if (!M.an || !M.on) return 0; M.an.getByteFrequencyData(M.fft); let s = 0; for (let i = 0; i < 24; i++) s += M.fft[i]; return s / (24 * 255); };
  M.bars = function (n) { if (!M.an) return new Array(n).fill(0); M.an.getByteFrequencyData(M.fft); const o = []; for (let i = 0; i < n; i++) o.push(M.fft[Math.floor(i * M.fft.length * 0.7 / n)] / 255); return o; };
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && M.on) { M.wasOn = true; M.stop(); } else if (document.visibilityState === "visible" && M.wasOn) { M.wasOn = false; M.start(); } });
  DP.music = M;
})();
