/* Deadpool Watch 3S — NEW faces, part 2 (WebGL): 3D Mask (textured, lit, rotating head) and Liquid Chrome (metaball digits).
   Raw WebGL1, no libraries, contexts are created lazily the first time the face is shown. */
(function () {
  const F = DP.faces, { pol } = F.util, setText = F.setText, { fit, gate, P3 } = F.s3, TAU = Math.PI * 2;

  function mkProg(gl, vs, fs) {
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
    const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error("link: " + gl.getProgramInfoLog(p));
    return p;
  }
  function getGL(cv) {
    const o = { antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: "default", preserveDrawingBuffer: false };
    try { return cv.getContext("webgl", o) || cv.getContext("experimental-webgl", o); } catch (e) { return null; }
  }
  function tex(gl, src) {
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (src) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    return t;
  }
  F.s3.gl = { mkProg, getGL, tex };

  // =====================================================================
  // FACE: 3D MASK
  // =====================================================================
  function maskTexture(squint) {
    const W = 1024, H = 512, c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
    const acc = (DP.settings && DP.settings.tintMask && DP.core && DP.core.ACCENTS && DP.settings.accent !== "red") ? DP.core.ACCENTS[DP.settings.accent] : null;
    const base = acc ? acc[0] : "#c8101a", hi = acc ? acc[1] : "#ff3b44", lo = acc ? acc[2] : "#5e040a";
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, hi); gr.addColorStop(0.35, base); gr.addColorStop(1, lo);
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // fabric weave
    g.globalAlpha = 0.07; for (let y = 0; y < H; y += 3) { g.fillStyle = y % 6 ? "#000" : "#fff"; g.fillRect(0, y, W, 1); }
    for (let x = 0; x < W; x += 4) { g.fillStyle = x % 8 ? "#000" : "#fff"; g.fillRect(x, 0, 1, H); }
    g.globalAlpha = 1;
    const U = lon => (lon / 360 + 0.5) * W, V = lat => (0.5 - lat / 180) * H;
    // eye patches (lon negative = viewer's left)
    const patch = s => {
      g.beginPath();
      g.moveTo(U(s * 5), V(-2));
      g.bezierCurveTo(U(s * 10), V(22), U(s * 40), V(30), U(s * 70), V(24));
      g.lineTo(U(s * 74), V(-14));
      g.bezierCurveTo(U(s * 50), V(-22), U(s * 18), V(-18), U(s * 5), V(-8));
      g.closePath(); g.fillStyle = "#0b0b0c"; g.fill();
    };
    patch(-1); patch(1);
    const eye = s => {
      const k = squint ? 0.35 : 1, mid = 3;
      g.beginPath();
      g.moveTo(U(s * 12), V(mid - 2));
      g.bezierCurveTo(U(s * 22), V(mid + 12 * k), U(s * 44), V(mid + 16 * k), U(s * 60), V(mid + 10 * k));
      g.bezierCurveTo(U(s * 48), V(mid - 8 * k), U(s * 26), V(mid - 10 * k), U(s * 12), V(mid - 2));
      g.closePath();
      const eg = g.createLinearGradient(0, V(mid + 16), 0, V(mid - 10)); eg.addColorStop(0, "#ffffff"); eg.addColorStop(1, "#c9d0da");
      g.fillStyle = eg; g.fill();
    };
    eye(-1); eye(1);
    // seams + stitches
    const seam = x => { g.strokeStyle = "rgba(0,0,0,.55)"; g.lineWidth = 5; g.beginPath(); g.moveTo(x, V(85)); g.lineTo(x, V(-85)); g.stroke(); g.strokeStyle = "rgba(255,255,255,.18)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x + 4, V(85)); g.lineTo(x + 4, V(-85)); g.stroke(); g.setLineDash([6, 7]); g.strokeStyle = "rgba(0,0,0,.4)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x - 7, V(80)); g.lineTo(x - 7, V(-80)); g.moveTo(x + 9, V(80)); g.lineTo(x + 9, V(-80)); g.stroke(); g.setLineDash([]); };
    seam(U(0)); seam(U(180) - 2); seam(2);
    // chin shadow + neck
    const ch = g.createLinearGradient(0, V(-40), 0, V(-90)); ch.addColorStop(0, "rgba(0,0,0,0)"); ch.addColorStop(1, "rgba(0,0,0,.55)"); g.fillStyle = ch; g.fillRect(0, V(-40), W, H);
    return c;
  }
  function sphere(lat = 40, lon = 64) {
    const pos = [], uv = [], idx = [];
    for (let i = 0; i <= lat; i++) {
      const v = i / lat, la = (0.5 - v) * Math.PI;
      for (let j = 0; j <= lon; j++) { const u = j / lon, lo = (u - 0.5) * TAU; pos.push(Math.sin(lo) * Math.cos(la), Math.sin(la), Math.cos(lo) * Math.cos(la)); uv.push(u, v); }
    }
    for (let i = 0; i < lat; i++) for (let j = 0; j < lon; j++) { const a = i * (lon + 1) + j, b = a + lon + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    return { pos: new Float32Array(pos), uv: new Float32Array(uv), idx: new Uint16Array(idx) };
  }
  F.s3.sphere = sphere;
  const VS3 = `attribute vec3 aP;attribute vec2 aU;uniform mat3 uR;uniform vec3 uS;uniform float uAsp;varying vec2 vU;varying vec3 vN;varying vec3 vW;
void main(){vec3 p=aP*uS;vec3 w=uR*p;vN=normalize(uR*(aP/uS));vW=w;vU=aU;float z=3.3-w.z;gl_Position=vec4(w.x*1.95/z,w.y*1.95/z+.1,(z-2.)/3.,1.);}`;
  const FS3 = `precision mediump float;uniform sampler2D uT;uniform vec3 uRim;uniform float uTime;uniform float uHit;varying vec2 vU;varying vec3 vN;varying vec3 vW;
void main(){vec3 n=normalize(vN);vec3 v=normalize(vec3(0.,0.,3.3)-vW);vec3 L1=normalize(vec3(-.55,.6,.75));vec3 L2=normalize(vec3(.8,-.1,.3));
vec4 t=texture2D(uT,vU);float d=max(dot(n,L1),0.);float d2=max(dot(n,L2),0.)*.35;vec3 h=normalize(L1+v);float sp=pow(max(dot(n,h),0.),22.)*.45;
float weave=sin(vU.x*900.)*sin(vU.y*520.)*.04;float rim=pow(1.-max(dot(n,v),0.),2.6);
vec3 c=t.rgb*(.18+d*.95+d2)+sp*(t.r>.6&&t.g>.6?1.2:.55)+uRim*rim*1.1+weave;c+=vec3(1.,.9,.7)*uHit*.25;
gl_FragColor=vec4(c,1.);}`;
  F.register({
    id: "mask3d", name: "3D MASK", s3: true, art: ["#200306", "#ff3b44", "\u25C9"],
    make() {
      let tk = ""; for (let i = 0; i < 60; i++) { const [x1, y1] = pol(i % 5 ? 184 : 176, i * 6), [x2, y2] = pol(192, i * 6); tk += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" data-tk="${i}"/>`; }
      let nums = ""; [12, 3, 6, 9].forEach((n, i) => { const [x, y] = pol(160, i * 90); nums += `<text x="${x.toFixed(1)}" y="${(y + 8).toFixed(1)}" class="m3-num">${n}</text>`; });
      return `<div class="f3 m3"><div class="m3-rays"></div><canvas class="f3-cv"></canvas>
      <svg viewBox="0 0 400 400" class="face-svg m3-svg"><g class="m3-tk" data-tks>${tk}</g>${nums}<circle cx="200" cy="200" r="170" class="m3-orbit"/><g data-orb><circle cx="200" cy="30" r="6" class="m3-dot"/></g>
      <path d="M 130 332 L 270 332" stroke="none"/></svg>
      <div class="m3-time"><b data-t>10:42</b><small data-s>PM</small></div><div class="m3-tag">3D &#8226; FULLY RENDERED &#8226; STILL UGLY</div></div>`;
    },
    init(E, r) {
      E.cv = r.querySelector("canvas"); E.t = r.querySelector("[data-t]"); E.s = r.querySelector("[data-s]"); E.orb = r.querySelector("[data-orb]"); E.tks = [...r.querySelectorAll("[data-tk]")];
      E.spin = 0; E.spinV = 0; E.hit = 0; E.spins = 0; E.ready = false; E.failed = false;
    },
    setup(E) {
      const gl = E.gl = getGL(E.cv); if (!gl) { E.failed = true; E.root.classList.add("nogl"); return; }
      try { E.prog = mkProg(gl, VS3, FS3); } catch (e) { console.warn(e); E.failed = true; E.root.classList.add("nogl"); return; }
      const m = sphere(); E.n = m.idx.length;
      const buf = (data, tgt = gl.ARRAY_BUFFER) => { const b = gl.createBuffer(); gl.bindBuffer(tgt, b); gl.bufferData(tgt, data, gl.STATIC_DRAW); return b; };
      E.bP = buf(m.pos); E.bU = buf(m.uv); E.bI = buf(m.idx, gl.ELEMENT_ARRAY_BUFFER);
      E.texOpen = tex(gl, maskTexture(false)); E.texSq = tex(gl, maskTexture(true));
      E.loc = {}; ["uR", "uS", "uAsp", "uT", "uRim", "uTime", "uHit"].forEach(k => E.loc[k] = gl.getUniformLocation(E.prog, k));
      E.aP = gl.getAttribLocation(E.prog, "aP"); E.aU = gl.getAttribLocation(E.prog, "aU");
      E.cv.addEventListener("webglcontextlost", ev => { ev.preventDefault(); E.ready = false; E.failed = true; E.root.classList.add("nogl"); });
      E.ready = true;
    },
    retexture(E) { if (!E.ready) return; const gl = E.gl; gl.deleteTexture(E.texOpen); gl.deleteTexture(E.texSq); E.texOpen = tex(gl, maskTexture(false)); E.texSq = tex(gl, maskTexture(true)); },
    tap(E) { E.spinV += 11; E.hit = 1; E.squintUntil = performance.now() + 700; E.spins++; if (E.spins >= 3 && DP.core.egg("headspin")) setTimeout(() => DP.say("Wheee! Do it again and I'll puke 3D chimichangas."), 900); DP.sound.swish(); return "mask3d"; },
    render(E, c) {
      setText(E.t, "m3T", `${c.t.hh}:${c.t.mm}`); setText(E.s, "m3S", (c.t.ampm ? c.t.ampm + " \u2022 " : "") + c.t.ss);
      E.orb.setAttribute("transform", `rotate(${(c.s * 6).toFixed(2)} 200 200)`);
      const si = Math.floor(c.s); if (E.si !== si) { E.si = si; E.tks.forEach((el, i) => el.classList.toggle("on", i <= si)); }
      if (E.failed || !gate(E, c.now)) return;
      if (!E.ready) this.setup(E); if (!E.ready) return;
      fit(E, 1);
      const gl = E.gl, t = c.now / 1000, dt = E.dt || 0.016;
      E.spinV *= Math.pow(0.12, dt); E.spin += E.spinV * dt; E.hit = Math.max(0, E.hit - dt * 2.5);
      const red = P3.reduced() ? 0.25 : 1;
      const yaw = Math.sin(t * 0.55) * 0.55 * red + F.look.x * 0.45 + E.spin, pitch = -0.08 + F.look.y * 0.22 + Math.sin(t * 0.41) * 0.07 * red, roll = Math.sin(t * 0.3) * 0.04 * red;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), cr = Math.cos(roll), sr = Math.sin(roll);
      // R = Rz * Rx * Ry (column-major for GLSL)
      const Ry = [cy, 0, -sy, 0, 1, 0, sy, 0, cy], Rx = [1, 0, 0, 0, cp, sp, 0, -sp, cp], Rz = [cr, sr, 0, -sr, cr, 0, 0, 0, 1];
      const mul = (A, B) => { const o = []; for (let col = 0; col < 3; col++) for (let row = 0; row < 3; row++) { let s = 0; for (let k = 0; k < 3; k++) s += A[k * 3 + row] * B[col * 3 + k]; o[col * 3 + row] = s; } return o; };
      const R = mul(Rz, mul(Rx, Ry));
      gl.viewport(0, 0, E.cv.width, E.cv.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LESS);
      gl.useProgram(E.prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, E.bP); gl.enableVertexAttribArray(E.aP); gl.vertexAttribPointer(E.aP, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, E.bU); gl.enableVertexAttribArray(E.aU); gl.vertexAttribPointer(E.aU, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, E.bI);
      gl.uniformMatrix3fv(E.loc.uR, false, new Float32Array(R)); gl.uniform3f(E.loc.uS, 0.86, 1.0, 0.92);
      const acc = F.s3.acc("hi");
      if (E.accStr !== acc) { E.accStr = acc; const h = acc.replace("#", ""); E.rim = h.length === 6 ? [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255) : [1, .23, .27]; }
      gl.uniform3fv(E.loc.uRim, E.rim); gl.uniform1f(E.loc.uTime, t); gl.uniform1f(E.loc.uHit, E.hit);
      gl.activeTexture(gl.TEXTURE0); const squint = (E.squintUntil && c.now < E.squintUntil) || ((c.now % 4200) < 140);
      gl.bindTexture(gl.TEXTURE_2D, squint ? E.texSq : E.texOpen); gl.uniform1i(E.loc.uT, 0);
      gl.drawElements(gl.TRIANGLES, E.n, gl.UNSIGNED_SHORT, 0);
    }
  });
  document.addEventListener("dp-theme", () => { const E = F.els.mask3d; if (E && E.ready) F.list.find(f => f.id === "mask3d").retexture(E); });

  // =====================================================================
  // FACE: LIQUID CHROME (metaball time)
  // =====================================================================
  const VSQ = "attribute vec2 a;varying vec2 vP;void main(){vP=a*.5+.5;gl_Position=vec4(a,0.,1.);}";
  const FSL = `precision highp float;varying vec2 vP;uniform sampler2D uA;uniform sampler2D uB;uniform float uMix;uniform float uT;uniform vec3 uBall[9];uniform vec3 uAcc;uniform vec2 uRes;
float fld(vec2 p){vec2 q=p;float w=sin(p.y*14.+uT*2.)*.004*uMix*(1.-uMix)*4.;q.x+=w;
float a=texture2D(uA,vec2(q.x,1.-q.y)).r,b=texture2D(uB,vec2(q.x,1.-q.y)).r;float f=mix(a,b,smoothstep(0.,1.,uMix))*1.25;
for(int i=0;i<9;i++){vec2 d=p-uBall[i].xy;f+=uBall[i].z*uBall[i].z/(dot(d,d)+.0004);}return f;}
vec3 env(vec3 r){float y=r.y;vec3 sky=mix(vec3(.02,.02,.05),vec3(.55,.62,.75),smoothstep(-.1,.9,y));vec3 hz=vec3(1.)*exp(-pow((y-.08)*9.,2.))*1.3;vec3 fl=uAcc*smoothstep(.1,-.8,y)*1.1;
float st=smoothstep(.97,1.,sin(r.x*9.+1.)*.5+.5)*.6;return sky+hz+fl+st*vec3(1.,.9,.8);}
void main(){vec2 p=vP;float e=1.2/uRes.x;float f=fld(p);
vec2 cc=p-.5;float rr=length(cc);vec3 bg=mix(vec3(.05,.05,.06),vec3(.01),smoothstep(.1,.5,rr));bg+=uAcc*.18*exp(-rr*rr*9.);bg+=uAcc*.35*smoothstep(.3,.9,f)*(1.-step(.9,f));
if(f<.9){gl_FragColor=vec4(bg,1.);return;}
float fx=fld(p+vec2(e*2.,0.))-fld(p-vec2(e*2.,0.)),fy=fld(p+vec2(0.,e*2.))-fld(p-vec2(0.,e*2.));
vec3 n=normalize(vec3(-fx*1.8,-fy*1.8,1.));vec3 v=vec3(0.,0.,1.);vec3 r=reflect(-v,n);vec3 c=env(vec3(r.x,r.y*-1.+.15,r.z));
float fr=pow(1.-n.z,2.);c=mix(c*.95,c*1.25+uAcc*.2,fr);float edge=smoothstep(.9,1.05,f);c*=mix(.4,1.,edge);
gl_FragColor=vec4(c,1.);}`;
  function fieldCanvas() { const c = document.createElement("canvas"); c.width = c.height = 256; return c; }
  function drawField(c, txt, sub) {
    const g = c.getContext("2d"); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#000"; g.fillRect(0, 0, 256, 256);
    const size = txt.length > 4 ? 84 : 96;
    g.font = `${size}px Bebas, "Bebas Neue", Oswald, Impact, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
    // blurred copy via shadow trick (draw off-canvas, shadow lands on-canvas)
    g.shadowColor = "#fff"; g.shadowBlur = 14; g.shadowOffsetX = 1000; g.fillStyle = "#fff";
    g.fillText(txt, 128 - 1000, 122); g.fillText(txt, 128 - 1000, 122);
    g.shadowBlur = 0; g.shadowOffsetX = 0; g.globalAlpha = 0.55; g.fillText(txt, 128, 122); g.globalAlpha = 1;
    if (sub) { g.font = `26px Bebas, Oswald, sans-serif`; g.shadowColor = "#fff"; g.shadowBlur = 6; g.shadowOffsetX = 1000; g.fillText(sub, 128 - 1000, 186); g.shadowBlur = 0; g.shadowOffsetX = 0; g.globalAlpha = 0.5; g.fillText(sub, 128, 186); g.globalAlpha = 1; }
  }
  F.register({
    id: "liquid", name: "LIQUID CHROME", s3: true, art: ["#1a1a1f", "#dfe6ef", "\u2248"],
    make() { return `<div class="f3 liquid"><canvas class="f3-cv"></canvas><div class="lq-cap">T-1000 WHO? &#8226; LIQUID METAL EDITION</div><div class="lq-sec" data-s>07</div></div>`; },
    init(E, r) { E.cv = r.querySelector("canvas"); E.s = r.querySelector("[data-s]"); E.ready = false; E.failed = false; E.mix = 1; E.txt = ""; E.surge = 0; E.balls = Array.from({ length: 9 }, (_, i) => ({ a: i / 9 * TAU, r: 0.28 + (i % 3) * 0.05, sp: 0.25 + i * 0.05, sz: 0.018 + (i % 4) * 0.004 })); },
    setup(E) {
      const gl = E.gl = getGL(E.cv); if (!gl) { E.failed = true; E.root.classList.add("nogl"); return; }
      try { E.prog = mkProg(gl, VSQ, FSL); } catch (e) { try { E.prog = mkProg(gl, VSQ, FSL.replace("precision highp float", "precision mediump float")); } catch (e2) { console.warn(e2); E.failed = true; E.root.classList.add("nogl"); return; } }
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      E.qb = b; E.aa = gl.getAttribLocation(E.prog, "a");
      E.cA = fieldCanvas(); E.cB = fieldCanvas(); E.tA = tex(gl); E.tB = tex(gl);
      E.loc = {}; ["uA", "uB", "uMix", "uT", "uBall", "uAcc", "uRes"].forEach(k => E.loc[k] = gl.getUniformLocation(E.prog, k));
      E.cv.addEventListener("webglcontextlost", ev => { ev.preventDefault(); E.ready = false; E.failed = true; E.root.classList.add("nogl"); });
      E.ready = true;
    },
    upload(E, which, canvas) { const gl = E.gl; gl.bindTexture(gl.TEXTURE_2D, which); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas); },
    tap(E) { E.surge = 1; E.mix = 0; DP.sound.bloop ? DP.sound.bloop() : DP.sound.pop(); return "liquid"; },
    render(E, c) {
      setText(E.s, "lqS", c.t.ss);
      if (E.failed || !gate(E, c.now)) return;
      if (!E.ready) this.setup(E); if (!E.ready) return;
      fit(E, 0.8);
      const gl = E.gl, t = c.now / 1000, dt = E.dt || 0.016, txt = `${c.t.hh}:${c.t.mm}`;
      if (txt !== E.txt) {
        const first = !E.txt; E.txt = txt;
        [E.cA, E.cB] = [E.cB, E.cA]; [E.tA, E.tB] = [E.tB, E.tA];
        drawField(E.cB, txt, c.t.ampm || (DP.faces.DAYS[c.d.getDay()].slice(0, 3)));
        this.upload(E, E.tB, E.cB); if (first) { drawField(E.cA, txt, c.t.ampm); this.upload(E, E.tA, E.cA); }
        E.mix = first ? 1 : 0; if (!first) E.surge = 1;
      }
      E.mix = Math.min(1, E.mix + dt / 1.4); E.surge = Math.max(0, E.surge - dt * 0.6);
      const red = P3.reduced() ? 0.2 : 1, arr = [];
      E.balls.forEach((b, i) => {
        let x, y, s = b.sz;
        if (i === 0) { const a = c.s / 60 * TAU - Math.PI / 2; x = 0.5 + Math.cos(a) * 0.43; y = 0.5 - Math.sin(a) * 0.43; s = 0.03; }
        else { b.a += b.sp * dt * red * (1 + E.surge * 3); const rr = b.r + Math.sin(t * 0.7 + i) * 0.06 - E.surge * 0.12; x = 0.5 + Math.cos(b.a) * rr; y = 0.5 + Math.sin(b.a * 1.3) * rr * 0.75; }
        arr.push(x, y, s * (1 + E.surge * 0.6));
      });
      gl.viewport(0, 0, E.cv.width, E.cv.height); gl.useProgram(E.prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, E.qb); gl.enableVertexAttribArray(E.aa); gl.vertexAttribPointer(E.aa, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, E.tA); gl.uniform1i(E.loc.uA, 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, E.tB); gl.uniform1i(E.loc.uB, 1);
      gl.uniform1f(E.loc.uMix, E.mix); gl.uniform1f(E.loc.uT, t); gl.uniform3fv(E.loc.uBall, new Float32Array(arr)); gl.uniform2f(E.loc.uRes, E.cv.width, E.cv.height);
      const acc = F.s3.acc("base");
      if (E.accStr !== acc) { E.accStr = acc; const h = acc.replace("#", ""); E.acc = h.length === 6 ? [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255) : [.82, .07, .11]; }
      gl.uniform3fv(E.loc.uAcc, E.acc);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  });
})();
