/* Deadpool Watch 3S — Merc Booth: camera selfie booth (getUserMedia only after a tap), draggable/pinchable mask overlay,
   comic/Void/Bub/Noir/Thermal filters (CSS for the live preview, pixel maths for the saved photo so it works in Safari),
   stickers, and save via the share sheet or a download. Photos never leave the phone. */
(function () {
  "use strict";
  const K = DP.core, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const { say, pick, ach, toast, onEnter } = K;
  const stage = $("#boothStage"); if (!stage) return;
  const vid = $("#boothVid"), off = $("#boothOff"), shots = $("#boothShots");
  const B = { stream: null, facing: "user", filter: "comic", mask: "full", items: [], sel: null };
  // mask artwork: the same path data renders as SVG (live) and Path2D (saved photo)
  const MASKS = {
    full: { w: 1, parts: [["M50 4 C80 4 94 30 94 54 C94 82 76 98 50 98 C24 98 6 82 6 54 C6 30 20 4 50 4 Z", "#d4121c", "#000", 2.5], ["M50 5 C48 30 48 70 50 97", null, "rgba(0,0,0,.6)", 1.5], ["M14 44 C20 30 38 30 46 46 C44 58 26 62 16 56 Z", "#0b0b0c"], ["M86 44 C80 30 62 30 54 46 C56 58 74 62 84 56 Z", "#0b0b0c"], ["M22 47 C27 41 36 41 41 48 C35 53 27 53 22 47 Z", "#fff"], ["M78 47 C73 41 64 41 59 48 C65 53 73 53 78 47 Z", "#fff"], ["M36 70 C42 74 58 74 64 70 C62 80 38 80 36 70 Z", "rgba(0,0,0,.001)"]], hole: "M30 66 C40 76 60 76 70 66 C68 88 32 88 30 66 Z" },
    eyes: { w: 1, parts: [["M8 46 C16 26 40 26 48 46 C46 60 22 64 10 58 Z", "#0b0b0c", "#000", 2], ["M92 46 C84 26 60 26 52 46 C54 60 78 64 90 58 Z", "#0b0b0c", "#000", 2], ["M44 44 C47 40 53 40 56 44 L56 50 C53 48 47 48 44 50 Z", "#d4121c"], ["M18 47 C24 39 36 39 42 48 C35 54 25 54 18 47 Z", "#fff"], ["M82 47 C76 39 64 39 58 48 C65 54 75 54 82 47 Z", "#fff"]] },
    cowl: { w: 1, parts: [["M50 10 C70 10 84 24 88 40 L98 4 L92 60 C90 84 72 98 50 98 C28 98 10 84 8 60 L2 4 L12 40 C16 24 30 10 50 10 Z", "#ffc814", "#000", 2.5], ["M14 42 C22 30 40 34 46 48 C40 58 22 60 14 52 Z", "#111"], ["M86 42 C78 30 60 34 54 48 C60 58 78 60 86 52 Z", "#111"], ["M22 46 C28 41 36 42 40 48 C34 52 26 52 22 46 Z", "#fff"], ["M78 46 C72 41 64 42 60 48 C66 52 74 52 78 46 Z", "#fff"]], hole: "M28 64 C38 78 62 78 72 64 C70 92 30 92 28 64 Z" }
  };
  function maskSVG(id) { const m = MASKS[id]; return `<svg viewBox="0 0 100 100">${m.hole ? `<defs><mask id="bmh-${id}"><rect width="100" height="100" fill="#fff"/><path d="${m.hole}" fill="#000"/></mask></defs>` : ""}<g ${m.hole ? `mask="url(#bmh-${id})"` : ""}>${m.parts.map(([d, f, s, w]) => `<path d="${d}" fill="${f || "none"}" ${s ? `stroke="${s}" stroke-width="${w || 1}"` : ""}/>`).join("")}</g></svg>`; }
  function paintMask(g, id) { const m = MASKS[id]; g.save(); if (m.hole) { g.beginPath(); g.rect(0, 0, 100, 100); const h = new Path2D(m.hole); const p = new Path2D(); p.rect(0, 0, 100, 100); p.addPath(h); g.clip(p, "evenodd"); } m.parts.forEach(([d, f, s, w]) => { const p = new Path2D(d); if (f) { g.fillStyle = f; g.fill(p); } if (s) { g.strokeStyle = s; g.lineWidth = w || 1; g.stroke(p); } }); g.restore(); }
  const STICKERS = ["\uD83D\uDDE1\uFE0F", "\uD83C\uDF2F", "\uD83D\uDCA5", "\uD83E\uDD84", "\uD83D\uDC36", "\u2764\uFE0F", "\uD83D\uDD2B", "\uD83C\uDF2E", "BOOM!", "SNIKT!", "MAXIMUM EFFORT", "CHIMICHANGA!"];
  $("#boothStickers").innerHTML = STICKERS.map((s, i) => `<button data-st="${i}">${s.length > 3 ? `<small>${s}</small>` : s}</button>`).join("");
  const layer = $("#boothItems");
  function addItem(kind, val, x = 0.5, y = 0.42, sc = 1) {
    const el = document.createElement("div"); el.className = "booth-item " + kind; el.innerHTML = kind === "mask" ? maskSVG(val) : `<span>${val}</span>`;
    const it = { el, kind, val, x, y, s: sc, r: kind === "sticker" ? (Math.random() - 0.5) * 0.5 : 0 }; B.items.push(it); layer.appendChild(el); place(it); select(it); return it;
  }
  function place(it) { const r = stage.getBoundingClientRect(), base = it.kind === "mask" ? r.width * 0.46 : it.val.length > 3 ? r.width * 0.5 : r.width * 0.18; it.el.style.width = base + "px"; it.el.style.fontSize = (it.val.length > 3 ? base * 0.14 : base * 0.8) + "px"; it.el.style.transform = `translate(${(it.x * r.width - base / 2).toFixed(1)}px,${(it.y * r.height - base / 2).toFixed(1)}px) rotate(${it.r}rad) scale(${it.s})`; }
  function select(it) { B.sel = it; B.items.forEach(i => i.el.classList.toggle("sel", i === it)); }
  // gestures: 1 finger drag, 2 fingers pinch/rotate the selected item
  const pts = new Map(); let g0 = null;
  layer.addEventListener("pointerdown", e => { const el = e.target.closest(".booth-item"); if (el) select(B.items.find(i => i.el === el)); if (!B.sel) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); try { layer.setPointerCapture(e.pointerId); } catch (_) { } g0 = snap(); e.preventDefault(); });
  layer.addEventListener("pointermove", e => { if (!pts.has(e.pointerId) || !B.sel) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); const r = stage.getBoundingClientRect(), g = snap(); if (!g0 || g.n !== g0.n) { g0 = g; return; } const it = B.sel; it.x += (g.cx - g0.cx) / r.width; it.y += (g.cy - g0.cy) / r.height; if (g.n === 2) { it.s = Math.max(0.3, Math.min(4, it.s * g.d / g0.d)); it.r += g.a - g0.a; } it.x = Math.max(0, Math.min(1, it.x)); it.y = Math.max(0, Math.min(1, it.y)); g0 = g; place(it); });
  const endP = e => { pts.delete(e.pointerId); g0 = snap(); };
  layer.addEventListener("pointerup", endP); layer.addEventListener("pointercancel", endP);
  function snap() { const a = [...pts.values()]; if (!a.length) return null; if (a.length === 1) return { n: 1, cx: a[0].x, cy: a[0].y }; const [p, q] = a; return { n: 2, cx: (p.x + q.x) / 2, cy: (p.y + q.y) / 2, d: Math.hypot(q.x - p.x, q.y - p.y) || 1, a: Math.atan2(q.y - p.y, q.x - p.x) }; }
  $("#boothSize").addEventListener("input", e => { if (B.sel) { B.sel.s = +e.target.value; place(B.sel); } });
  // filters
  const CSSF = { none: "none", comic: "contrast(1.55) saturate(1.9) brightness(1.05)", void: "sepia(.55) hue-rotate(-35deg) saturate(2.2) contrast(1.25) brightness(.9)", bub: "sepia(.6) saturate(2.6) hue-rotate(5deg) brightness(1.08)", noir: "grayscale(1) contrast(1.6) brightness(.95)", thermal: "invert(1) hue-rotate(180deg) saturate(3) contrast(1.3)" };
  function setFilter(f) { B.filter = f; vid.style.filter = CSSF[f]; stage.dataset.filter = f; $$("#boothFilters button").forEach(b => b.classList.toggle("on", b.dataset.bf === f)); const fb = $("#boothFallback"); if (fb) fb.style.filter = CSSF[f]; }
  $("#boothFilters").addEventListener("click", e => { const b = e.target.closest("[data-bf]"); if (b) { setFilter(b.dataset.bf); DP.sound.tick(); } });
  $("#boothMasks").addEventListener("click", e => { const b = e.target.closest("[data-m]"); if (!b) return; const ex = B.items.find(i => i.kind === "mask"); if (b.dataset.m === "off") { if (ex) { ex.el.remove(); B.items.splice(B.items.indexOf(ex), 1); B.sel = null; } } else if (ex) { ex.val = b.dataset.m; ex.el.innerHTML = maskSVG(ex.val); select(ex); } else addItem("mask", b.dataset.m, 0.5, 0.4); $$("#boothMasks button").forEach(x => x.classList.toggle("on", x === b)); DP.sound.tick(); });
  $("#boothStickers").addEventListener("click", e => { const b = e.target.closest("[data-st]"); if (!b) return; addItem("sticker", STICKERS[+b.dataset.st], 0.3 + Math.random() * 0.4, 0.25 + Math.random() * 0.5); DP.sound.pop ? DP.sound.pop() : DP.sound.tick(); });
  $("#boothClear").addEventListener("click", () => { B.items.filter(i => i.kind === "sticker").forEach(i => i.el.remove()); B.items = B.items.filter(i => i.kind !== "sticker"); B.sel = B.items[0] || null; });
  // camera
  async function startCam() {
    stopCam();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { useFallback("No camera API here. Using a stunt double backdrop."); return; }
    try {
      B.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: B.facing, width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
      vid.srcObject = B.stream; vid.muted = true; vid.setAttribute("playsinline", ""); await vid.play().catch(() => { });
      stage.classList.add("live"); stage.classList.remove("fallback"); off.hidden = true; vid.classList.toggle("mirror", B.facing === "user");
      if (!B.items.some(i => i.kind === "mask")) addItem("mask", "full", 0.5, 0.4);
      say(pick("booth"));
    } catch (err) { useFallback(err && err.name === "NotAllowedError" ? "Camera permission denied. Using a stunt double backdrop. (Settings > Safari > Camera to allow.)" : "Camera unavailable (" + (err && err.name || "error") + "). Using a stunt double backdrop."); }
  }
  function useFallback(msg) { stage.classList.add("fallback"); stage.classList.remove("live"); off.hidden = true; toast(msg); if (!B.items.some(i => i.kind === "mask")) addItem("mask", "full", 0.5, 0.4); }
  function stopCam() { if (B.stream) { B.stream.getTracks().forEach(t => t.stop()); B.stream = null; } vid.srcObject = null; stage.classList.remove("live"); }
  $("#boothStart").addEventListener("click", startCam);
  $("#boothFlip").addEventListener("click", () => { B.facing = B.facing === "user" ? "environment" : "user"; if (B.stream) startCam(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopCam(); });
  let prev = K.current; setInterval(() => { if (prev === "scr-booth" && K.current !== "scr-booth") { stopCam(); if (!stage.classList.contains("fallback")) off.hidden = false; } prev = K.current; }, 400);
  // pixel filters for the saved photo (canvas ctx.filter isn't supported in Safari, so do the maths ourselves)
  function pixelFilter(g, w, h, f) {
    if (f === "none") return; const im = g.getImageData(0, 0, w, h), d = im.data;
    const con = (v, c) => (v - 128) * c + 128;
    for (let i = 0; i < d.length; i += 4) {
      let r = d[i], gg = d[i + 1], b = d[i + 2]; const l = 0.299 * r + 0.587 * gg + 0.114 * b;
      if (f === "comic") { const s = 1.9; r = l + (r - l) * s; gg = l + (gg - l) * s; b = l + (b - l) * s; r = con(r, 1.5); gg = con(gg, 1.5); b = con(b, 1.5); r = Math.round(r / 64) * 64; gg = Math.round(gg / 64) * 64; b = Math.round(b / 64) * 64; }
      else if (f === "void") { r = con(l * 1.1 + 40, 1.25); gg = con(l * 0.55, 1.25); b = con(l * 0.8 + 20, 1.25); }
      else if (f === "bub") { r = con(l * 1.15 + 30, 1.2); gg = con(l * 0.95 + 20, 1.2); b = con(l * 0.35, 1.2); }
      else if (f === "noir") { const v = con(l, 1.6); r = gg = b = v; }
      else if (f === "thermal") { const t = l / 255; r = 255 * Math.min(1, Math.max(0, 1.5 - Math.abs(t - 0.85) * 4)); gg = 255 * Math.min(1, Math.max(0, 1.5 - Math.abs(t - 0.55) * 4)); b = 255 * Math.min(1, Math.max(0, 1.5 - Math.abs(t - 0.2) * 4)); }
      d[i] = r < 0 ? 0 : r > 255 ? 255 : r; d[i + 1] = gg < 0 ? 0 : gg > 255 ? 255 : gg; d[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
    }
    g.putImageData(im, 0, 0);
    if (f === "comic") { g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = "rgba(0,0,0,.22)"; const st = Math.max(6, Math.round(w / 90)); for (let y = 0; y < h; y += st) for (let x = (y / st) % 2 ? st / 2 : 0; x < w; x += st) { g.beginPath(); g.arc(x, y, st * 0.22, 0, 7); g.fill(); } g.restore(); }
  }
  function fallbackArt(g, w, h) { const gr = g.createRadialGradient(w / 2, h * 0.4, 10, w / 2, h / 2, w * 0.8); gr.addColorStop(0, "#ff5a1f"); gr.addColorStop(0.5, "#8a0010"); gr.addColorStop(1, "#150004"); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.save(); g.translate(w / 2, h / 2); for (let i = 0; i < 24; i++) { g.rotate(Math.PI / 12); g.fillStyle = i % 2 ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)"; g.beginPath(); g.moveTo(0, 0); g.lineTo(-w * 0.12, -h); g.lineTo(w * 0.12, -h); g.fill(); } g.restore(); g.fillStyle = "#2a0a0e"; g.beginPath(); g.ellipse(w / 2, h * 1.05, w * 0.42, h * 0.3, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(w / 2, h * 0.42, w * 0.22, h * 0.26, 0, 0, 7); g.fill(); }
  $("#boothSnap").addEventListener("click", async () => {
    const r = stage.getBoundingClientRect(), W = 1080, H = Math.round(W * r.height / r.width), c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
    if (B.stream && vid.videoWidth) { const vw = vid.videoWidth, vh = vid.videoHeight, s = Math.max(W / vw, H / vh); g.save(); if (vid.classList.contains("mirror")) { g.translate(W, 0); g.scale(-1, 1); } g.drawImage(vid, (W - vw * s) / 2, (H - vh * s) / 2, vw * s, vh * s); g.restore(); }
    else fallbackArt(g, W, H);
    pixelFilter(g, W, H, B.filter);
    const k = W / r.width;
    B.items.forEach(it => { const base = parseFloat(it.el.style.width); g.save(); g.translate(it.x * W, it.y * H); g.rotate(it.r); g.scale(it.s, it.s);
      if (it.kind === "mask") { const sz = base * k; g.translate(-sz / 2, -sz / 2); g.scale(sz / 100, sz / 100); paintMask(g, it.val); }
      else { const fs = parseFloat(it.el.style.fontSize) * k; g.font = `${fs}px ${it.val.length > 3 ? "Bangers, Impact" : "system-ui"}, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle"; if (it.val.length > 3) { g.lineWidth = fs / 5; g.strokeStyle = "#000"; g.lineJoin = "round"; g.strokeText(it.val, 0, 0); g.fillStyle = "#ffd54a"; } g.fillText(it.val, 0, 0); }
      g.restore(); });
    // comic frame + caption
    g.lineWidth = 18; g.strokeStyle = "#000"; g.strokeRect(9, 9, W - 18, H - 18); g.fillStyle = "#ffd54a"; g.fillRect(28, H - 110, 520, 78); g.strokeStyle = "#000"; g.lineWidth = 6; g.strokeRect(28, H - 110, 520, 78); g.fillStyle = "#000"; g.font = "44px Bangers, Impact, sans-serif"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("DEADPOOL WATCH 3S \u2022 " + new Date().toLocaleDateString([], { month: "short", day: "numeric" }), 46, H - 70);
    stage.classList.remove("flash"); void stage.offsetWidth; stage.classList.add("flash"); DP.sound.shutter ? DP.sound.shutter() : DP.sound.bang(); if (DP.haptic) DP.haptic("medium");
    const url = c.toDataURL("image/jpeg", 0.9); B.last = { c, url };
    const im = document.createElement("img"); im.src = url; im.alt = "Booth photo"; shots.prepend(im); while (shots.children.length > 6) shots.lastChild.remove();
    ach("booth_1"); say(pick("booth"));
    $("#boothSave").disabled = false;
  });
  $("#boothSave").addEventListener("click", async () => {
    if (!B.last) return; const name = "deadpool-watch-3s-" + Date.now() + ".jpg";
    try {
      const blob = await new Promise(res => B.last.c.toBlob(res, "image/jpeg", 0.92));
      const file = new File([blob], name, { type: "image/jpeg" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "Deadpool Watch 3S" }); return; }
    } catch (err) { if (err && err.name === "AbortError") return; }
    const a = document.createElement("a"); a.href = B.last.url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); toast("Saved! (Long-press the photo below to Add to Photos on iPhone.)");
  });
  addEventListener("resize", () => B.items.forEach(place));
  onEnter("scr-booth", () => { setFilter(B.filter); B.items.forEach(place); });
  setFilter("comic");
  DP.booth = B;
})();
