/* Deadpool Watch 3S — multi-scene WebGL background.
   Scenes: "plasma" (the v2 shader, unchanged look), "void" (storm vortex over a wasteland), "city" (neon synthwave city),
   "galaxy" (chimichanga galaxy), "tva" (retro time-bureaucracy office). Same API as v2 (ok, setTheme, light, boom, frame,
   setVisible, mode) plus setScene/scene/scenes/perf and tilt parallax. Shaders compile lazily, one at a time. */
(function () {
  const G = { ok: false, pulse: 0, mode: 0, lx: 0.5, ly: 0.84, tlx: 0.5, tly: 0.84, scene: "plasma", px: 0, py: 0, fps: 60 };
  const cv = document.getElementById("fxGl");
  let gl = null;
  try { gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power", preserveDrawingBuffer: false }); } catch (e) { }
  const col = { c1: [0.82, 0.07, 0.11], c2: [1.0, 0.45, 0.12], t1: [0.82, 0.07, 0.11], t2: [1.0, 0.45, 0.12] };
  G.setTheme = function (hex1, hex2) { const h = x => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16) / 255); col.t1 = h(hex1); col.t2 = h(hex2); };
  G.light = function (x, y) { G.tlx = x; G.tly = y; };
  G.boom = function (s = 1) { G.pulse = Math.max(G.pulse, s); };
  G.scenes = [
    { id: "plasma", name: "Plasma Rays", glyph: "✺", note: "The v2 classic. Smoky, moody, red." },
    { id: "void", name: "The Void", glyph: "🌪", note: "Storm-wall wasteland. Bring snacks." },
    { id: "city", name: "Neon City", glyph: "🌆", note: "Synthwave skyline. Very 1986." },
    { id: "galaxy", name: "Chimichanga Galaxy", glyph: "🌯", note: "A spiral of deep-fried stars." },
    { id: "tva", name: "Time Office", glyph: "⏳", note: "Beige bureaucracy. Timelines everywhere." }
  ];
  G.frame = () => { }; G.setVisible = () => { }; G.setScene = id => { G.scene = id; };
  if (!gl) { cv.style.display = "none"; DP.gl = G; return; }
  const vs = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
  const HEAD = `precision mediump float;
uniform vec2 R;uniform float T;uniform vec3 C1;uniform vec3 C2;uniform vec2 L;uniform float P;uniform float M;uniform vec2 PX;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
vec3 finish(vec3 c,vec2 p){
 if(M>0.){vec3 rb=.5+.5*cos(6.2832*(vec3(0.,.33,.67)+T*.25+p.x*.6+p.y*.3));c=mix(c,(c.r+c.g+c.b+.12)*rb*1.4,M);}
 c+=(h(gl_FragCoord.xy+fract(T))-.5)*.03;return c;}
`;
  const SRC = {
    // v2 plasma, verbatim maths (PX is 0 unless parallax is on)
    plasma: `void main(){
 vec2 p=(gl_FragCoord.xy-.5*R)/R.y+PX*.06;float t=T*.06;
 vec2 q=vec2(fbm(p*1.5+vec2(t,-t)),fbm(p*1.5+vec2(-t,t)+3.1));
 float s=fbm(p*2.1+q*1.9+vec2(0.,-T*.05));
 vec3 c=mix(vec3(.018,.012,.016),C1*.5,smoothstep(.38,.98,s));
 c=mix(c,C2*.32,smoothstep(.62,1.,fbm(p*3.2+q+T*.035))*.7);
 vec2 lp=(L-.5)*vec2(R.x/R.y,1.);vec2 d=p-lp;float r=length(d);float an=atan(d.y,d.x);
 float ry=pow(n(vec2(an*5.,T*.18))*.6+n(vec2(an*12.,-T*.12))*.4,3.);
 c+=C1*ry*exp(-r*1.5)*1.1*(.6+.4*s);
 c+=C1*.55*exp(-r*r*12.)+vec3(1.,.9,.85)*.22*exp(-r*r*110.);
 vec2 fd=-lp;for(int i=1;i<4;i++){float fi=float(i);vec2 gp=lp+fd*fi*.6;float g=exp(-pow(length(p-gp)*(7.+fi*4.),2.));c+=mix(C2,C1,fi/3.)*g*.2;}
 c+=C1*P*smoothstep(.05,0.,abs(r-(1.-P)*1.3))*.9+C1*P*.12;
 c*=smoothstep(1.3,.2,length(p*vec2(.9,1.)));
 gl_FragColor=vec4(finish(c,p),1.);}`,
    void: `void main(){
 vec2 p=(gl_FragCoord.xy-.5*R)/R.y;vec2 pp=p+PX*.05;
 vec2 v=pp-vec2(0.,.62);float r=length(v),a=atan(v.y,v.x);
 float sw=a+T*.12+1.6/(r+.35);
 float cl=fbm(vec2(cos(sw),sin(sw))*r*2.2+vec2(T*.03,0.))*.8+fbm(pp*3.+vec2(-T*.05,T*.02))*.35;
 vec3 sky=mix(vec3(.05,.015,.05),vec3(.32,.07,.16),smoothstep(-.2,.7,pp.y));
 sky=mix(sky,mix(vec3(.55,.18,.1),C1*.9,.4),smoothstep(.45,1.05,cl)*smoothstep(-.3,.5,pp.y));
 sky+=vec3(1.,.55,.3)*exp(-r*3.)*.35;
 float fl=step(.985,n(vec2(floor(T*3.),2.)));float bolt=smoothstep(.02,0.,abs(pp.x-.25+sin(pp.y*20.+floor(T*3.))*.03))*step(.0,pp.y)*fl;
 sky+=vec3(.8,.7,1.)*(fl*.25+bolt*.8);
 float hz=-.18+(PX.x*.02)+.04*n(vec2(pp.x*3.,0.))+.02*n(vec2(pp.x*11.,1.));
 float ground=smoothstep(hz+.004,hz-.004,p.y);
 float deb=step(.72,n(vec2(floor(p.x*9.+PX.x*.4),5.)))*smoothstep(hz+.06*n(vec2(floor(p.x*9.),7.))+.004,hz+.06*n(vec2(floor(p.x*9.),7.))-.004,p.y);
 vec3 g=mix(vec3(.12,.05,.04),vec3(.3,.13,.07),fbm(p*vec2(3.,14.)+vec2(T*.02,0.)))*(.4+.6*smoothstep(-.6,hz,p.y));
 vec3 c=mix(sky,g,max(ground,deb*.9));
 float dust=fbm(p*vec2(4.,8.)+vec2(T*.25,0.));c+=vec3(.5,.25,.15)*smoothstep(.55,.9,dust)*.25*smoothstep(-.5,hz+.1,p.y);
 c+=C1*P*.3*exp(-r*1.5);
 c*=smoothstep(1.4,.3,length(p*vec2(.9,1.)));
 gl_FragColor=vec4(finish(c,p),1.);}`,
    city: `float bld(float x,float s){float i=floor(x*s);return .08+.3*h(vec2(i,s));}
void main(){
 vec2 p=(gl_FragCoord.xy-.5*R)/R.y;vec2 pp=p+PX*.04;float hz=-.05;
 vec3 c=mix(vec3(.02,.0,.06),vec3(.35,.02,.25),smoothstep(.9,hz,pp.y));
 c+=vec3(1.)*step(.997,h(floor(gl_FragCoord.xy/2.)))*smoothstep(.1,.6,pp.y)*(.5+.5*sin(T*2.+h(floor(gl_FragCoord.xy))*20.));
 vec2 sp=pp-vec2(PX.x*.03,.2);float sr=length(sp);
 float sun=smoothstep(.3,.295,sr)*step(0.,sin((sp.y+T*.02)*80.)+ (sp.y+.05)*14.);
 c=mix(c,mix(vec3(1.,.85,.2),C1*1.1+vec3(.3,0.,.3),smoothstep(.25,-.25,sp.y)),sun);
 c+=C1*exp(-sr*4.)*.35;
 float x1=pp.x+PX.x*.03,x2=pp.x+PX.x*.07;
 float b1=hz+bld(x1,7.)*.9;float in1=step(p.y,b1)*step(hz,p.y);
 c=mix(c,vec3(.06,.02,.1),in1);
 float b2=hz+bld(x2+.13,12.)*.6;float in2=step(p.y,b2)*step(hz,p.y);
 vec2 w=fract(vec2(x2*60.,p.y*55.));float lit=step(.62,h(floor(vec2(x2*60.,p.y*55.))+floor(T*.2)))*step(.3,w.x)*step(.35,w.y);
 c=mix(c,vec3(.02,.0,.04)+lit*mix(vec3(1.,.3,.8),C2,.4)*.8,in2);
 c+=vec3(1.,.2,.7)*smoothstep(.006,0.,abs(p.y-b2))*in2*.0+vec3(.9,.2,.9)*smoothstep(.01,0.,abs(p.y-hz))*.8;
 if(p.y<hz){float d=hz-p.y;vec2 g=vec2((pp.x)/(d+.02),1./(d+.02)+T*1.2);vec2 gf=abs(fract(g*vec2(1.,.5))-.5);
  float line=smoothstep(.06*(1./(d*6.+.2)),0.,min(gf.x,gf.y*1.2)) ;c=mix(vec3(.03,0.,.06),mix(vec3(.9,.1,.8),C1,.5),line*smoothstep(0.,.08,d)*1.2+.0);
  c+=vec3(.5,.05,.4)*exp(-d*9.)*.6;}
 c+=C1*P*.25;
 c*=smoothstep(1.4,.3,length(p*vec2(.9,1.)));
 gl_FragColor=vec4(finish(c,p),1.);}`,
    galaxy: `float sdc(vec2 p,float l,float r){p.x=abs(p.x)-l;p.x=max(p.x,0.);return length(p)-r;}
void main(){
 vec2 p=(gl_FragCoord.xy-.5*R)/R.y;vec2 pp=p+PX*.05;
 float r=length(pp),a=atan(pp.y,pp.x);
 vec3 c=vec3(.01,.005,.02);
 float arm=sin(a*2.-log(r+.001)*5.+T*.15)*.5+.5;
 float gal=pow(arm,3.)*exp(-r*2.2)*(0.6+0.8*fbm(pp*6.+T*.02));
 c+=mix(C2,vec3(1.,.8,.5),.5)*gal*1.1+vec3(1.,.85,.6)*exp(-r*r*40.)*.6;
 c+=mix(C1,vec3(.4,.1,.6),.5)*fbm(pp*2.-T*.01)*.18;
 for(int i=0;i<3;i++){float fi=float(i);vec2 g=floor((p+PX*(.02+fi*.03))*(60.+fi*40.));float s=h(g+fi*7.);c+=vec3(1.)*step(.994,s)*(.4+.6*sin(T*(1.+s*4.)+s*50.));}
 for(int i=0;i<7;i++){float fi=float(i);float ang=T*(.08+fi*.013)+fi*.9;float rad=.18+fi*.075;
  vec2 cp=vec2(cos(ang),sin(ang)*.62)*rad-PX*(.03+fi*.01);vec2 q=pp-cp;float ro=T*.4+fi;q=mat2(cos(ro),-sin(ro),sin(ro),cos(ro))*q;
  float sz=.022+.006*fi*.3;float d=sdc(q,sz*1.3,sz*.65);
  float crisp=fbm(q*120.);vec3 cc=mix(vec3(.55,.28,.07),vec3(.95,.66,.26),crisp)*(1.-smoothstep(-.02,0.,d)*.0);
  cc*=.7+.6*smoothstep(sz*.6,-sz*.6,q.y);
  c=mix(c,cc,smoothstep(.003,-.002,d));c+=vec3(1.,.6,.2)*exp(-max(d,0.)*60.)*.12;}
 c+=C1*P*.2*exp(-r);
 c*=smoothstep(1.5,.3,length(p*vec2(.9,1.)));
 gl_FragColor=vec4(finish(c,p),1.);}`,
    tva: `void main(){
 vec2 p=(gl_FragCoord.xy-.5*R)/R.y;vec2 pp=p+PX*.04;
 vec3 c=mix(vec3(.14,.08,.04),vec3(.36,.22,.1),smoothstep(-.9,.9,pp.y));
 vec2 wp=pp*vec2(6.,6.);vec2 cell=floor(wp),f=fract(wp)-.5;float ring=abs(length(f)-.3);
 c=mix(c,c*1.25+vec3(.03,.02,0.),smoothstep(.04,.0,ring)*.6);
 if(pp.y>.35){float d=pp.y-.35;float z=1./(d+.05);vec2 g=vec2(pp.x*z,z+T*.3);vec2 gf=fract(g*vec2(.9,.5));
  float lamp=smoothstep(.12,.0,length((gf-.5)*vec2(1.,2.)));c=mix(c,vec3(.1,.06,.03),.6);c+=vec3(1.,.8,.45)*lamp*smoothstep(0.,.3,d)*.9;}
 float y0=-.05+PX.y*.02;float tl=0.;
 for(int i=0;i<6;i++){float fi=float(i);float br=sin(pp.x*(2.+fi*.7)+T*(.4+fi*.1)+fi*2.)*(.02+fi*.03)*smoothstep(-.9+fi*.25,.6,pp.x);
  float d=abs(pp.y-y0-br);tl+=exp(-d*(i==0?160.:260.))*(i==0?1.:.55)*step(-.9+fi*.3,pp.x);}
 vec3 glow=mix(vec3(1.,.6,.15),C2,.25);c+=glow*tl*.9;c+=glow*exp(-abs(pp.y-y0)*9.)*.15;
 float sp=fract(T*.12);c+=vec3(1.,.9,.6)*exp(-length(pp-vec2(-1.+sp*2.2,y0+sin((-1.+sp*2.2)*2.+T*.4)*.02))*30.)*.9;
 c*=.92+.08*sin(gl_FragCoord.y*3.1416*.5);
 c*=1.-.25*step(.97,n(vec2(T*8.,0.)));
 c+=C1*P*.2;
 c*=smoothstep(1.4,.25,length(p*vec2(.85,1.)));
 gl_FragColor=vec4(finish(c,p),1.);}`
  };
  function sh(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { const e = gl.getShaderInfoLog(s); gl.deleteShader(s); throw new Error(e); } return s; }
  const progs = {}; let cur = null, vsh = null;
  function build(id) {
    if (progs[id] !== undefined) return progs[id];
    try {
      if (!vsh) vsh = sh(gl.VERTEX_SHADER, vs);
      const pr = gl.createProgram(); gl.attachShader(pr, vsh); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, HEAD + SRC[id])); gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error("link " + id);
      const U = {}; ["R", "T", "C1", "C2", "L", "P", "M", "PX"].forEach(k => U[k] = gl.getUniformLocation(pr, k));
      progs[id] = { pr, U, a: gl.getAttribLocation(pr, "a") };
    } catch (e) { progs[id] = null; if (window.console) console.warn("[gl] scene " + id + " failed; falling back", e.message); }
    return progs[id];
  }
  try {
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    if (!build("plasma")) throw new Error("plasma");
    G.ok = true;
  } catch (e) { cv.style.display = "none"; DP.gl = G; return; }
  function use(id) {
    let p = SRC[id] ? build(id) : null; if (!p) { id = "plasma"; p = build("plasma"); }
    if (cur !== p) { gl.useProgram(p.pr); gl.enableVertexAttribArray(p.a); gl.vertexAttribPointer(p.a, 2, gl.FLOAT, false, 0, 0); cur = p; }
    return p;
  }
  // ---- performance: "auto" adapts resolution + frame cap to measured frame times; "saver" = low res @30fps; "max" = sharper @60fps
  const PERF = { saver: [0.28, 32], auto: [0.42, 14], max: [0.6, 14] };
  let scale = 0.42, cap = 14, slow = 0, fast = 0;
  function perfMode() { return (DP.settings && DP.settings.perf) || "auto"; }
  function resize() { const w = Math.max(64, Math.round(innerWidth * scale)), hh = Math.max(64, Math.round(innerHeight * scale)); if (cv.width !== w || cv.height !== hh) { cv.width = w; cv.height = hh; gl.viewport(0, 0, w, hh); } }
  G.applyPerf = function () { const m = PERF[perfMode()] || PERF.auto; scale = m[0]; cap = m[1]; slow = fast = 0; resize(); };
  G.applyPerf(); addEventListener("resize", resize);
  cv.addEventListener("webglcontextlost", e => { e.preventDefault(); G.ok = false; cv.style.display = "none"; });
  cv.addEventListener("webglcontextrestored", () => { for (const k in progs) delete progs[k]; vsh = null; cur = null; try { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); G.ok = !!build("plasma"); G.setVisible(DP.settings ? DP.settings.shader !== false : true); } catch (e) { } });
  let lastT = 0, lastDraw = 0;
  G.frame = function (now) {
    if (!G.ok || !DP.settings || DP.settings.shader === false) return;
    if (now - lastT < cap) return;
    const gap = now - lastT; lastT = now;
    const s = DP.settings;
    const k = 0.05;
    for (let i = 0; i < 3; i++) { col.c1[i] += (col.t1[i] - col.c1[i]) * k; col.c2[i] += (col.t2[i] - col.c2[i]) * k; }
    G.lx += (G.tlx - G.lx) * 0.06; G.ly += (G.tly - G.ly) * 0.06;
    const tl = DP.core && DP.core.tilt, par = s.parallax !== false && tl;
    G.px += ((par ? (tl.x - 0.5) * 2 : 0) - G.px) * 0.08; G.py += ((par ? (tl.y - 0.3) * 2 : 0) - G.py) * 0.08;
    G.pulse *= 0.955;
    const t0 = performance.now();
    const p = use(s.scene || G.scene), U = p.U;
    const t = s.reduceMotion ? now / 3000 : now / 1000;
    gl.uniform2f(U.R, cv.width, cv.height); gl.uniform1f(U.T, t);
    gl.uniform3fv(U.C1, col.c1); gl.uniform3fv(U.C2, col.c2); gl.uniform2f(U.L, G.lx, G.ly);
    gl.uniform1f(U.P, G.pulse); gl.uniform1f(U.M, G.mode); gl.uniform2f(U.PX, G.px, G.py);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    // adaptive quality (auto only): long gaps between our frames => drop resolution; consistently smooth => restore
    if (perfMode() === "auto" && gap < 200) {
      G.fps = G.fps * 0.95 + (1000 / gap) * 0.05;
      if (gap > 40) { if (++slow > 45 && scale > 0.26) { scale = Math.max(0.26, scale - 0.06); slow = 0; resize(); } } else slow = Math.max(0, slow - 1);
      if (gap < 20) { if (++fast > 600 && scale < 0.42) { scale = Math.min(0.42, scale + 0.04); fast = 0; resize(); } } else fast = 0;
    }
    lastDraw = performance.now() - t0;
  };
  G.setScene = function (id) { if (!SRC[id]) id = "plasma"; G.scene = id; if (DP.settings) DP.settings.scene = id; build(id); };
  G.setVisible = on => { cv.style.display = on && G.ok ? "block" : "none"; };
  G.stats = () => ({ scale, cap, fps: Math.round(G.fps), scene: (DP.settings && DP.settings.scene) || G.scene });
  DP.gl = G;
})();
