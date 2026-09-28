/* Deadpool Watch 3S — World tab additions: a WebGL 3D globe (Natural Earth land, live day/night terminator, city markers,
   drag-to-spin with inertia) and a bubble level + katana compass driven by device orientation (permission on tap). */
(function () {
  "use strict";
  const K = DP.core, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const { say, pick, ach, egg, toast, onEnter, onFrame, LS } = K;
  const TAU = Math.PI * 2, D2R = Math.PI / 180;
  // world subnav on Multiverse / Globe / Level
  const WORLD = [["scr-multi", "Clock"], ["scr-globe", "Globe"], ["scr-level", "Level"]];
  $$('.subnav[data-sub="world"]').forEach(n => { n.innerHTML = WORLD.map(([id, l]) => `<button data-go="${id}" class="${id === "scr-multi" ? "on" : ""}">${l}</button>`).join(""); });

  // ======================= GLOBE =======================
  const CITIES = [
    { id: "nick", name: "Nick", lat: 41.88, lon: -87.63, tz: null, q: "Home base. Population: you, me, and a concerning number of snacks." },
    { id: "ny", name: "New York", lat: 40.71, lon: -74.0, tz: "America/New_York", q: "Earth-616's favourite city. Hero density: dangerously high." },
    { id: "la", name: "Los Angeles", lat: 34.05, lon: -118.24, tz: "America/Los_Angeles", q: "Where they turn my life into movies. Allegedly." },
    { id: "van", name: "Vancouver", lat: 49.28, lon: -123.12, tz: "America/Vancouver", q: "Rain, mountains, and every superhero shoot ever." },
    { id: "mex", name: "Mexico City", lat: 19.43, lon: -99.13, tz: "America/Mexico_City", q: "Chimichanga pilgrimage site. Bring stretchy pants." },
    { id: "lon", name: "London", lat: 51.51, lon: -0.13, tz: "Europe/London", q: "Tea, rain, and very polite villains." },
    { id: "tok", name: "Tokyo", lat: 35.68, lon: 139.69, tz: "Asia/Tokyo", q: "Already living in tomorrow. Show-offs." },
    { id: "syd", name: "Sydney", lat: -33.87, lon: 151.21, tz: "Australia/Sydney", q: "Everything there wants to kill you. My kind of place." }
  ];
  try { if (DP.cx && DP.cx.loc) { CITIES[0].lat = DP.cx.loc.lat; CITIES[0].lon = DP.cx.loc.lon; } } catch (e) { }
  const gv = $("#globeCv"), ov = $("#globeOv"), ox = ov ? ov.getContext("2d") : null;
  const GL = { init: false, ok: false, yaw: 0, pitch: 0.35, vy: 0.12, vp: 0, drag: null, lastInput: 0, target: null, spins: 0 };
  function cityXYZ(c) { const la = c.lat * D2R, lo = c.lon * D2R; return [Math.sin(lo) * Math.cos(la), Math.sin(la), Math.cos(lo) * Math.cos(la)]; }
  function rotM(yaw, pitch) { const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch); // R = Rx(pitch) * Ry(yaw) (column-major for GL)
    return [cy, sp * sy, -cp * sy, 0, cp, sp, sy, -sp * cy, cp * cy]; }
  function apply(m, v) { return [m[0] * v[0] + m[3] * v[1] + m[6] * v[2], m[1] * v[0] + m[4] * v[1] + m[7] * v[2], m[2] * v[0] + m[5] * v[1] + m[8] * v[2]]; }
  function sunVec(d) { const start = Date.UTC(d.getUTCFullYear(), 0, 0), doy = (d - start) / 864e5, dec = -23.44 * Math.cos(TAU / 365 * (doy + 10)) * D2R; const hrs = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600, lon = -(hrs - 12) * 15 * D2R; return [Math.sin(lon) * Math.cos(dec), Math.sin(dec), Math.cos(lon) * Math.cos(dec)]; }
  const VS = `attribute vec3 aP;attribute vec2 aU;uniform mat3 uR;varying vec2 vU;varying vec3 vO;varying vec3 vW;
void main(){vO=aP;vec3 w=uR*aP;vW=w;vU=aU;gl_Position=vec4(w.x*.86,w.y*.86,-w.z*.5,1.);}`;
  const FS = `precision mediump float;uniform sampler2D uT;uniform vec3 uSun;uniform vec3 uAcc;uniform float uTime;varying vec2 vU;varying vec3 vO;varying vec3 vW;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){float land=texture2D(uT,vU).r;float sd=dot(normalize(vO),uSun);float day=smoothstep(-.12,.18,sd);
vec3 oD=vec3(.04,.1,.24),oN=vec3(.008,.015,.04);vec3 lD=mix(uAcc,vec3(.95,.35,.25),.25),lN=uAcc*.12;
vec2 g=vU*vec2(420.,210.);float dots=smoothstep(.55,.2,length(fract(g)-.5));lD*=.82+.25*dots;
vec3 c=mix(mix(oN,oD,day),mix(lN,lD,day),land);
float city=step(.93,h(floor(vU*vec2(700.,350.))))*land*(1.-day)*(.6+.4*sin(uTime*2.+h(floor(vU*vec2(700.,350.)))*30.));c+=vec3(1.,.8,.4)*city*.9;
float lat=abs(fract(vU.y*6.)-.5),lon=abs(fract(vU.x*12.)-.5);c+=vec3(1.)*.05*(smoothstep(.02,0.,lat)+smoothstep(.02,0.,lon));
c+=vec3(1.,.55,.2)*smoothstep(.08,0.,abs(sd))*.35;
vec3 n=normalize(vW);vec3 hv=normalize(normalize(uSun*0.+vec3(-.4,.5,.8))+vec3(0.,0.,1.));float spec=pow(max(dot(n,hv),0.),40.)*(1.-land)*day*.6;c+=vec3(.8,.9,1.)*spec;
float rim=pow(1.-max(n.z,0.),2.5);c+=mix(vec3(.3,.5,1.),uAcc,.4)*rim*.8;
gl_FragColor=vec4(c,1.);}`;
  function initGlobe() {
    if (GL.init) return; GL.init = true;
    const T = DP.faces && DP.faces.s3 && DP.faces.s3.gl; if (!gv || !T) return fail();
    const gl = T.getGL(gv); if (!gl) return fail();
    try {
      GL.gl = gl; GL.p = T.mkProg(gl, VS, FS); const m = DP.faces.s3.sphere(48, 96); GL.n = m.idx.length;
      const b = (d, t = gl.ARRAY_BUFFER) => { const o = gl.createBuffer(); gl.bindBuffer(t, o); gl.bufferData(t, d, gl.STATIC_DRAW); return o; };
      GL.bp = b(m.pos); GL.bu = b(m.uv); GL.bi = b(m.idx, gl.ELEMENT_ARRAY_BUFFER);
      GL.t = T.tex(gl, null); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
      const img = new Image(); img.onload = () => { gl.bindTexture(gl.TEXTURE_2D, GL.t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); }; img.src = "img/land.png";
      ["uR", "uT", "uSun", "uAcc", "uTime"].forEach(k => GL[k] = gl.getUniformLocation(GL.p, k)); GL.aP = gl.getAttribLocation(GL.p, "aP"); GL.aU = gl.getAttribLocation(GL.p, "aU");
      gv.addEventListener("webglcontextlost", e => { e.preventDefault(); GL.ok = false; });
      GL.ok = true;
      const home = CITIES[0]; GL.yaw = -home.lon * D2R; GL.pitch = Math.max(-1, Math.min(1, home.lat * D2R * 0.8));
    } catch (e) { console.warn("[globe]", e.message); fail(); }
  }
  function fail() { const f = $("#globeFail"); if (f) f.hidden = false; }
  function sizeGlobe() { if (!gv) return; const r = gv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1), w = Math.round(r.width * dpr); if (gv.width !== w) { gv.width = gv.height = w; ov.width = ov.height = w; } }
  function accent() { const a = getComputedStyle(document.getElementById("app")).getPropertyValue("--accent").trim() || "#d4121c"; const m = a.match(/^#([0-9a-f]{6})$/i); return m ? [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16) / 255) : [0.83, 0.07, 0.11]; }
  let accCache = null; document.addEventListener("dp-theme", () => { accCache = null; });
  function drawGlobe(now, dt) {
    if (!GL.ok) return; sizeGlobe(); const gl = GL.gl;
    if (GL.target != null) { let d = ((GL.target.yaw - GL.yaw + Math.PI) % TAU + TAU) % TAU - Math.PI; GL.yaw += d * Math.min(1, dt * 4); GL.pitch += (GL.target.pitch - GL.pitch) * Math.min(1, dt * 4); if (Math.abs(d) < 0.002) GL.target = null; GL.vy = 0; }
    else if (!GL.drag) { const idle = now - GL.lastInput > 2500; GL.vy += ((idle ? 0.12 : 0) - GL.vy) * Math.min(1, dt * (idle ? 0.5 : 1.2)); GL.yaw += GL.vy * dt; GL.pitch += GL.vp * dt; GL.vp *= Math.pow(0.05, dt); GL.pitch = Math.max(-1.3, Math.min(1.3, GL.pitch)); }
    const R = rotM(GL.yaw, GL.pitch), sun = sunVec(new Date());
    gl.viewport(0, 0, gv.width, gv.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.enable(gl.DEPTH_TEST);
    gl.useProgram(GL.p); gl.uniformMatrix3fv(GL.uR, false, R); gl.uniform3fv(GL.uSun, sun); gl.uniform3fv(GL.uAcc, accCache || (accCache = accent())); gl.uniform1f(GL.uTime, now / 1000);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, GL.t); gl.uniform1i(GL.uT, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, GL.bp); gl.enableVertexAttribArray(GL.aP); gl.vertexAttribPointer(GL.aP, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, GL.bu); gl.enableVertexAttribArray(GL.aU); gl.vertexAttribPointer(GL.aU, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, GL.bi); gl.drawElements(gl.TRIANGLES, GL.n, gl.UNSIGNED_SHORT, 0);
    // overlay: city markers + labels
    const W = ov.width, s = W / 2 * 0.86, c0 = W / 2, k = W / 380; ox.clearRect(0, 0, W, W);
    ox.font = `${Math.round(12 * k)}px Oswald, sans-serif`; ox.textAlign = "left"; ox.textBaseline = "middle";
    CITIES.forEach(c => { const p = apply(R, cityXYZ(c)); if (p[2] < 0.05) return; const x = c0 + p[0] * s, y = c0 - p[1] * s, a = Math.min(1, p[2] * 3), pulse = 1 + 0.35 * Math.sin(now / 300 + c.lat);
      ox.globalAlpha = a; ox.fillStyle = c.id === "nick" ? "#ffd54a" : "#fff"; ox.beginPath(); ox.arc(x, y, 3.2 * k, 0, TAU); ox.fill(); ox.strokeStyle = ox.fillStyle; ox.lineWidth = 1.4 * k; ox.beginPath(); ox.arc(x, y, 7 * k * pulse, 0, TAU); ox.stroke();
      ox.lineWidth = 3 * k; ox.strokeStyle = "rgba(0,0,0,.8)"; ox.strokeText(c.name, x + 10 * k, y); ox.fillText(c.name, x + 10 * k, y); });
    ox.globalAlpha = 1;
  }
  function cityTimes() { const el = $("#globeCities"); if (!el) return; const h24 = DP.settings.h24; el.innerHTML = CITIES.map(c => { let t = ""; try { t = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: !h24, timeZone: c.tz || undefined }); } catch (e) { t = "--"; } const day = apply([1, 0, 0, 0, 1, 0, 0, 0, 1], cityXYZ(c)), sun = sunVec(new Date()), lit = day[0] * sun[0] + day[1] * sun[1] + day[2] * sun[2] > 0; return `<button data-city="${c.id}"><i>${lit ? "\u2600\uFE0F" : "\uD83C\uDF19"}</i><b>${c.name}</b><span>${t}</span></button>`; }).join(""); }
  if (gv) {
    gv.addEventListener("pointerdown", e => { GL.drag = { x: e.clientX, y: e.clientY, t: performance.now() }; GL.target = null; GL.vy = 0; GL.vp = 0; try { gv.setPointerCapture(e.pointerId); } catch (_) { } ach("globe"); });
    gv.addEventListener("pointermove", e => { if (!GL.drag) return; const now = performance.now(), dx = e.clientX - GL.drag.x, dy = e.clientY - GL.drag.y, dtm = Math.max(8, now - GL.drag.t) / 1000; GL.yaw += dx * 0.009; GL.pitch = Math.max(-1.3, Math.min(1.3, GL.pitch + dy * 0.009)); GL.vy = GL.vy * 0.5 + (dx * 0.009 / dtm) * 0.5; GL.vp = GL.vp * 0.5 + (dy * 0.009 / dtm) * 0.5; GL.drag = { x: e.clientX, y: e.clientY, t: now }; GL.lastInput = now; });
    const up = () => { if (!GL.drag) return; GL.drag = null; GL.lastInput = performance.now(); if (Math.abs(GL.vy) > 14) { if (egg("globe_spin")) say("Whoa! You spun the planet so hard I saw last Tuesday."); else say(pick("globe")); DP.sound.whoosh && DP.sound.whoosh(); } };
    gv.addEventListener("pointerup", up); gv.addEventListener("pointercancel", up);
    $("#globeCities").addEventListener("click", e => { const b = e.target.closest("[data-city]"); if (!b) return; const c = CITIES.find(x => x.id === b.dataset.city); GL.target = { yaw: -c.lon * D2R, pitch: Math.max(-1.1, Math.min(1.1, c.lat * D2R)) }; GL.lastInput = performance.now() + 4000; say(c.q); DP.sound.click && DP.sound.click(); ach("globe"); });
    onEnter("scr-globe", () => { initGlobe(); cityTimes(); });
    onFrame("scr-globe", drawGlobe);
    setInterval(() => { if (K.current === "scr-globe") cityTimes(); }, 20000);
  }
  DP.globe = GL;

  // ======================= LEVEL + COMPASS =======================
  const LV = { on: false, beta: 0, gamma: 0, heading: null, sb: 0, sg: 0, sh: 0, got: false, demo: false, levelSince: 0, last: 0 };
  function onOri(e) {
    if (e.beta == null) return; LV.got = true; LV.last = performance.now(); LV.beta = e.beta; LV.gamma = e.gamma || 0;
    if (typeof e.webkitCompassHeading === "number" && !isNaN(e.webkitCompassHeading)) LV.heading = e.webkitCompassHeading;
    else if (e.absolute && e.alpha != null) LV.heading = (360 - e.alpha) % 360;
    else if (e.alpha != null && LV.heading == null) LV.relHeading = (360 - e.alpha) % 360;
  }
  async function enable() {
    try {
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        const r = await DeviceOrientationEvent.requestPermission(); if (r !== "granted") { toast("Orientation denied. Settings > Safari > Motion & Orientation Access."); return; }
        try { if (typeof DeviceMotionEvent !== "undefined" && DeviceMotionEvent.requestPermission) await DeviceMotionEvent.requestPermission(); } catch (_) { }
        if (K.startMotion) K.startMotion();
      }
    } catch (err) { toast("Sensor permission failed: " + (err && err.message || err)); return; }
    if (!LV.on) { LV.on = true; addEventListener("deviceorientation", onOri); addEventListener("deviceorientationabsolute", onOri); }
    $("#lvEnable").textContent = "SENSORS ON \u2713"; $("#lvEnable").classList.add("done"); ach("compass");
    setTimeout(() => { if (!LV.got) { LV.demo = true; $("#lvNote").textContent = "No orientation sensor detected (desktop?). Demo mode: drag on the level to fake a tilt."; } else $("#lvNote").textContent = "Lay the phone flat for the bubble. Hold it up for the compass. Keep away from magnets and grumpy mutants."; }, 1500);
  }
  const tk = $("#cmpTicks"); if (tk) tk.innerHTML = Array.from({ length: 72 }, (_, i) => { const a = i * 5 * D2R, r1 = i % 6 ? 90 : 84; return `<line x1="${(100 + Math.sin(a) * r1).toFixed(1)}" y1="${(100 - Math.cos(a) * r1).toFixed(1)}" x2="${(100 + Math.sin(a) * 96).toFixed(1)}" y2="${(100 - Math.cos(a) * 96).toFixed(1)}" stroke="${i === 0 ? "#ff3b44" : "rgba(255,255,255,.55)"}" stroke-width="${i % 6 ? 1 : 2.5}"/>`; }).join("");
  if ($("#lvEnable")) {
    $("#lvEnable").addEventListener("click", enable);
    const lvl = $("#lvBubbleWrap"); let dd = null;
    lvl.addEventListener("pointerdown", e => { if (!LV.demo && LV.got) return; LV.demo = true; dd = lvl.getBoundingClientRect(); move(e); try { lvl.setPointerCapture(e.pointerId); } catch (_) { } });
    const move = e => { if (!dd) return; LV.gamma = ((e.clientX - dd.left) / dd.width - 0.5) * 60; LV.beta = ((e.clientY - dd.top) / dd.height - 0.5) * 60; LV.relHeading = ((LV.relHeading || 0) + 3) % 360; };
    lvl.addEventListener("pointermove", move); lvl.addEventListener("pointerup", () => { dd = null; });
    onFrame("scr-level", (now, dt) => {
      if (LV.demo && !LV.got && !dd) { LV.gamma *= 0.95; LV.beta *= 0.95; LV.relHeading = ((LV.relHeading || 0) + dt * 12) % 360; }
      const k = Math.min(1, dt * 10); LV.sb += (LV.beta - LV.sb) * k; LV.sg += (LV.gamma - LV.sg) * k;
      const flat = Math.abs(LV.sb) < 50, R = 108;
      let bx = Math.max(-1, Math.min(1, -LV.sg / 30)), by = Math.max(-1, Math.min(1, -LV.sb / 30)); const m = Math.hypot(bx, by); if (m > 1) { bx /= m; by /= m; }
      $("#lvBubble").style.transform = `translate(${(bx * R).toFixed(1)}px,${(by * R).toFixed(1)}px)`;
      const tube = Math.max(-1, Math.min(1, -LV.sg / 25)); $("#lvTubeBubble").style.transform = `translateX(${(tube * 120).toFixed(1)}px)`;
      const lv = Math.abs(LV.sb) < 1 && Math.abs(LV.sg) < 1;
      $("#lvBubbleWrap").classList.toggle("level", lv); $("#lvRead").textContent = `X ${LV.sg.toFixed(1)}\u00B0  \u2022  Y ${LV.sb.toFixed(1)}\u00B0` + (flat ? "" : "  \u2022  UPRIGHT");
      if (lv && LV.got && !LV.demo) { if (!LV.levelSince) LV.levelSince = now; else if (now - LV.levelSince > 3000) { if (egg("level")) say(pick("level")); LV.levelSince = now + 1e9; } } else if (!lv) LV.levelSince = 0;
      const hd = LV.heading != null ? LV.heading : LV.relHeading; if (hd != null) { let d = ((hd - LV.sh + 540) % 360) - 180; LV.sh = (LV.sh + d * k + 360) % 360; $("#cmpRose").style.transform = `rotate(${(-LV.sh).toFixed(1)}deg)`; const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]; $("#cmpRead").textContent = `${Math.round(LV.sh)}\u00B0 ${dirs[Math.round(LV.sh / 45) % 8]}${LV.heading == null ? " (relative)" : ""}`; }
    });
  }
  DP.level = LV;
})();
