"""Curated screenshots of Deadpool Watch 3S (iPhone 15 Pro Max 1290x2796, WebKit, full-screen PWA insets).
usage: python3 tools/shots.py [URL]"""
import sys, os
from playwright.sync_api import sync_playwright
URL = sys.argv[1] if len(sys.argv) > 1 else "https://mandeerinfinity.github.io/deadpool-watch-3s/"
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "screenshots") + "/"
os.makedirs(out, exist_ok=True)
INIT = """try{if(!localStorage.getItem('dpw3s.shotsInit')){localStorage.setItem('dpw3s.shotsInit','1');localStorage.setItem('dpw3s.greeted','true');
localStorage.setItem('dpw3s.settings',JSON.stringify({intro:'never',autoQuips:false,splatter:false,perf:'max'}));}}catch(e){}
document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=':root{--sat:59px!important;--sab:34px!important}';document.head.appendChild(s)})"""
with sync_playwright() as p:
    dev = dict(p.devices["iPhone 15 Pro Max"]); dev.pop("default_browser_type", None)
    dev["viewport"] = {"width": 430, "height": 932}
    b = p.webkit.launch(); ctx = b.new_context(**dev); pg = ctx.new_page()
    pg.add_init_script(INIT)
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
    pg.goto(URL, wait_until="networkidle"); pg.wait_for_timeout(2500)
    # screenshot session only: pre-mark achievements so unlock pop-ups/confetti don't photobomb the shots
    pg.evaluate("DP.ACHIEVEMENTS.forEach(a => { DP.core.stats.ach[a.id] = DP.core.stats.ach[a.id] || Date.now(); })"); pg.wait_for_timeout(3000)
    def clean(): pg.evaluate("DP.phys && DP.phys.clear(); document.querySelectorAll('.bubble').forEach(e=>e.remove()); const t=document.querySelector('#toast'); t && t.classList.remove('show'); const a=document.querySelector('#achPop'); if (a) a.hidden=true")
    def scene(s): pg.evaluate(f"DP.gl.setScene && DP.gl.setScene('{s}')")
    def face(fid, sc, name, tap=False, wait=4500):
        scene(sc); pg.evaluate(f"DP.app.setFace(DP.faces.list.findIndex(f=>f.id==='{fid}'))"); pg.wait_for_timeout(wait)
        if tap:
            bx = pg.locator("#facesVp").bounding_box(); pg.mouse.click(bx["x"] + bx["width"]/2, bx["y"] + bx["height"]/2); pg.wait_for_timeout(700)
        clean(); pg.wait_for_timeout(250); pg.screenshot(path=out + name)
    # 1 intro title card
    pg.evaluate("DP.intro.play(true)"); pg.wait_for_timeout(3600); pg.screenshot(path=out + "01-cinematic-intro-title-card.png")
    pg.mouse.click(215, 500); pg.wait_for_timeout(1500)
    face("mask3d", "void", "02-3d-mask-face-void-scene.png")
    face("storm", "void", "03-void-storm-face.png", tap=True, wait=3500)
    face("neon", "city", "04-synthwave-face-neon-city.png")
    # 5 hub
    pg.click('.dock button[data-g="hub"]'); pg.wait_for_timeout(2500); clean(); pg.screenshot(path=out + "05-hub-sections.png")
    # 6 duel game
    pg.evaluate("DP.games.start('duel')"); pg.wait_for_timeout(900)
    g = pg.locator("#gMsg [data-b='g3go']")
    if g.count(): g.click()
    # a tiny autopilot plays perfectly so the shot shows notes, PERFECT! judgements and a combo
    pg.evaluate("""(()=>{const D=DP.games.reg.duel; window.__duelBot=setInterval(()=>{ if(D.st!=='play')return; const now=performance.now(), L=D.lanes(); for(const n of D.notes){ if(!n.done && Math.abs(n.t-now)<22){ D.tap(0, L[n.lane]); } } },8);})()""")
    pg.wait_for_timeout(11000)
    pg.screenshot(path=out + "06-claws-vs-katana-rhythm-duel.png")
    pg.evaluate("clearInterval(window.__duelBot)"); pg.click("#gQuit"); pg.wait_for_timeout(900)
    # 7 globe flown to a daylight city
    pg.evaluate("DP.core.go('scr-globe')"); pg.wait_for_timeout(1500)
    pg.evaluate("""(()=>{const bs=[...document.querySelectorAll('#globeCities button')]; const day=bs.find(b=>/\\u2600|\\u2600\\uFE0F/.test(b.textContent))||bs.find(b=>/Tokyo/.test(b.textContent)); day && day.click();})()""")
    pg.wait_for_timeout(3000); clean(); pg.screenshot(path=out + "07-3d-globe-day-night.png")
    # 8 roulette
    pg.evaluate("DP.core.go('scr-roulette')"); pg.wait_for_timeout(1200); pg.click("#rouSpin"); pg.wait_for_timeout(6000); clean(); pg.wait_for_timeout(300)
    pg.screenshot(path=out + "08-multiverse-roulette.png")
    print("errors:", errs); b.close()
