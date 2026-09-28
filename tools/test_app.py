"""Deadpool Watch 3S end-to-end test: iPhone 15 Pro Max profile (WebKit + Chrome).
usage: python3 tools/test_app.py URL [shots] [webkit|chrome|both]
Exercises every face (v2 + 3S), all 6 games, every screen, transitions, music, physics, globe, level,
booth (fallback backdrop when no camera), roulette, daily, widgets, ask, sandbox, visuals; checks overflow and console errors."""
import sys, json, os
from playwright.sync_api import sync_playwright
URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8843/"
SHOTS = len(sys.argv) > 2 and sys.argv[2] == "shots"
ENG = sys.argv[3] if len(sys.argv) > 3 else "both"
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "dpw3-notes", "raw") + "/"
os.makedirs(out, exist_ok=True)
OVERFLOW_JS = """() => { const W = innerWidth, bad = [];
  if (document.documentElement.scrollWidth > W + 1) bad.push('doc scrollWidth ' + document.documentElement.scrollWidth);
  const scr = document.querySelector('.screen.active');
  (scr ? scr.querySelectorAll('*') : []).forEach(el => { const r = el.getBoundingClientRect(); if (!r.width || getComputedStyle(el).position === 'fixed') return;
    if (r.right > W + 1.5 || r.left < -1.5) { if (el.closest('.face,.faces-track,#facesTrack,.bezel,.case,.flipper,svg,.tl-grid,.rou-wrap,.globe-wrap')) return; for (let a = el.parentElement; a && a !== scr; a = a.parentElement) { const ox = getComputedStyle(a).overflowX; if (ox === 'auto' || ox === 'scroll' || ox === 'hidden' || ox === 'clip') { const ar = a.getBoundingClientRect(); if (ar.right <= W + 1.5 && ar.left >= -1.5) return; } } bad.push((el.id || el.className || el.tagName).toString().slice(0, 40) + ' ' + Math.round(r.left) + '..' + Math.round(r.right)); } });
  return bad.slice(0, 8); }"""
def run(p, engine):
    dev = dict(p.devices["iPhone 15 Pro Max"]); dev.pop("default_browser_type", None)
    if engine == "chrome":
        b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--autoplay-policy=no-user-gesture-required"])
    else:
        b = p.webkit.launch()
    dev["viewport"] = {"width": 430, "height": 932}
    ctx = b.new_context(**dev, geolocation={"latitude": 41.88, "longitude": -87.63}, permissions=["geolocation"] if engine == "chrome" else [])
    pg = ctx.new_page()
    errs, R, over = [], {"engine": engine}, {}
    LAST.clear(); LAST.update(R=R, errs=errs)
    pg.on("console", lambda m: errs.append(f"console.{m.type}: {m.text}") if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append(f"pageerror: {e} @ {(e.stack or '')[:400]} @step {R.get('_step')}"))
    pg.on("requestfailed", lambda r: errs.append(f"requestfailed: {r.url} {r.failure}") if "open-meteo" not in r.url else None)
    def shot(name):
        if SHOTS: pg.wait_for_timeout(350); pg.screenshot(path=out + f"{name}-{engine}.png")
    def chk(name):
        o = pg.evaluate(OVERFLOW_JS)
        if o: over[name] = o
    def go(sid, wait=900):
        pg.evaluate(f"DP.core.go('{sid}')"); pg.wait_for_timeout(wait); chk(sid)
    pg.goto(URL, wait_until="networkidle"); pg.wait_for_timeout(1200)
    R["introShown"] = pg.evaluate("!!document.querySelector('#intro3')")
    shot("00-intro")
    if R["introShown"]:
        pg.mouse.click(215, 500); pg.wait_for_timeout(1200)
    R["introGone"] = pg.evaluate("!document.querySelector('#intro3')")
    R["title"] = pg.title()
    R["nFaces"] = pg.evaluate("document.querySelectorAll('#facesTrack .face').length")
    R["gl"] = pg.evaluate("!!(DP.gl && DP.gl.ok)")
    R["prefixKeys"] = pg.evaluate("Object.keys(localStorage).filter(k=>!k.startsWith('dpw3s.'))")
    chk("watch")
    box = pg.locator("#facesVp").bounding_box(); cx, cy = box["x"] + box["width"]/2, box["y"] + box["height"]/2
    def swipe(dx):
        pg.mouse.move(cx, cy); pg.mouse.down()
        for i in range(1, 9): pg.mouse.move(cx + dx*i/8, cy); pg.wait_for_timeout(12)
        pg.mouse.up(); pg.wait_for_timeout(800)
    swipe(-220); R["afterSwipe"] = pg.evaluate("DP.app.faceIdx")
    names = []
    for i in range(R["nFaces"]):
        pg.evaluate(f"DP.app.setFace({i})"); pg.wait_for_timeout(1100)
        nm = pg.evaluate("document.querySelector('#faceName').textContent.trim()"); names.append(nm)
        pg.mouse.click(cx, cy); pg.wait_for_timeout(500)
        if i >= 13: shot(f"face{i:02d}")
        pg.mouse.click(cx + 30, cy - 30); pg.wait_for_timeout(300)
    R["faceNames"] = names
    R["seen3s"] = pg.evaluate("DP.faces.list.filter(f=>f.s3).length")
    R["bubble"] = pg.evaluate("(document.querySelector('.bubble')||{}).textContent||null")
    pg.evaluate("DP.app.setFace(5)"); pg.wait_for_timeout(700); pg.mouse.click(cx, cy); pg.wait_for_timeout(1300)
    R["chronoRunning"] = pg.evaluate("DP.sw.running()"); pg.evaluate("DP.sw.running() && DP.sw.toggle()")
    pg.evaluate("DP.app.setFace(0)"); pg.wait_for_timeout(600)
    pg.click("#faceName"); pg.wait_for_timeout(700); R["picker"] = pg.evaluate("!document.querySelector('#facePicker').hidden && document.querySelectorAll('#fpGrid > *').length"); shot("02-picker")
    pg.evaluate("document.querySelector('#facePicker').hidden=true"); pg.wait_for_timeout(300)
    for _ in range(5): pg.click("#crown", force=True); pg.wait_for_timeout(90)
    pg.wait_for_timeout(1200); R["flipped"] = pg.evaluate("document.querySelector('#flipper').className")
    pg.click("#crown", force=True); pg.wait_for_timeout(900)
    pg.click("#btnWall"); pg.wait_for_timeout(3000)
    pg.click("#btnRoulette"); pg.wait_for_timeout(1500); R["quickRoulette"] = pg.evaluate("document.querySelector('#faceName').textContent.trim()")
    pg.click("#btnMusic"); pg.wait_for_timeout(1500); R["musicOn"] = pg.evaluate("DP.music && DP.music.on"); pg.click("#btnMusic"); pg.wait_for_timeout(400)
    # tap splatter + physics
    R['_step'] = 'tap splatter + physics'
    pg.mouse.click(215, 800); pg.wait_for_timeout(200); R["physAlive"] = pg.evaluate("DP.phys ? DP.phys.list.length : -1")
    # transitions
    R['_step'] = 'transitions'
    tr = {}
    for v in ["katana", "page", "shatter", "glitch", "claws", "portal", "fade", "random"]:
        pg.evaluate(f"document.querySelector('#segTrans button[data-v=\"{v}\"]').click()")
        pg.click('.dock button[data-g="games"]'); pg.wait_for_timeout(1100)
        pg.click('.dock button[data-g="watch"]'); pg.wait_for_timeout(1100)
        tr[v] = pg.evaluate("(document.querySelector('.screen.active')||{id:'NONE'}).id")
    R["transitions"] = tr
    pg.evaluate("document.querySelector('#segTrans button[data-v=\"katana\"]').click()")
    # v2 timers
    R['_step'] = 'v2 timers'
    pg.click('.dock button[data-g="timers"]'); pg.wait_for_timeout(900); chk("timer")
    R['_step'] = 'go("scr-stopwatch"); go("scr-alarms")'
    go("scr-stopwatch"); go("scr-alarms")
    R['_step'] = 'go("scr-focus"); pg.click("#focusGo"); p'
    go("scr-focus"); pg.click("#focusGo"); pg.wait_for_timeout(1500); R["focusTime"] = pg.inner_text("#focusTime"); pg.click("#focusReset")
    R['_step'] = 'go("scr-interval"); pg.click("#ivGo"); p'
    go("scr-interval"); pg.click("#ivGo"); pg.wait_for_timeout(1600); R["ivPhase"] = pg.inner_text("#ivPhase") + " " + pg.inner_text("#ivTime"); pg.click("#ivReset")
    R['_step'] = 'go("scr-countdown"); q = pg.locator("#cd'
    go("scr-countdown"); q = pg.locator("#cdQuick button").first
    if q.count(): q.click(); pg.wait_for_timeout(600)
    R["countdowns"] = pg.evaluate("document.querySelectorAll('#cdList > *').length")
    # games
    R['_step'] = 'games'
    pg.click('.dock button[data-g="games"]'); pg.wait_for_timeout(900); chk("games"); shot("07-arcade")
    gr = {}
    for g in ["slice", "bullet", "flappy", "duel", "whack", "snake"]:
        R['_step'] = 'pg.evaluate(f"DP.games.start(\'{g}\')"); p'
        pg.evaluate(f"DP.games.start('{g}')"); pg.wait_for_timeout(900)
        goBtn = pg.locator("#gMsg [data-b='g3go']")
        if goBtn.count(): goBtn.click(); pg.wait_for_timeout(600)
        gb = pg.locator("#gameCanvas").bounding_box()
        if g == "slice":
            for k in range(6):
                y = gb["y"] + gb["height"]*(0.3 + 0.08*k); pg.mouse.move(gb["x"]+20, y); pg.mouse.down()
                for i in range(1, 12): pg.mouse.move(gb["x"]+20 + (gb["width"]-40)*i/11, y - 60*i/11); pg.wait_for_timeout(10)
                pg.mouse.up(); pg.wait_for_timeout(250)
        elif g == "snake":
            for key in ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"]: pg.keyboard.press(key); pg.wait_for_timeout(500)
        else:
            for k in range(14):
                pg.mouse.click(gb["x"] + gb["width"]*(0.25 + 0.5*(k % 2)), gb["y"] + gb["height"]*(0.35 + 0.3*((k//2) % 2))); pg.wait_for_timeout(220)
        pg.wait_for_timeout(700); shot(f"08-game-{g}")
        gr[g] = [pg.inner_text("#gScore"), pg.evaluate("DP.games.active")]
        pg.click("#gQuit"); pg.wait_for_timeout(700)
    R["games"] = gr; R["gamingOff"] = pg.evaluate("!document.documentElement.classList.contains('gaming')")
    # world
    R['_step'] = 'world'
    pg.click('.dock button[data-g="world"]'); pg.wait_for_timeout(1000); chk("multi")
    pg.click("#wxRefresh"); pg.wait_for_timeout(3500)
    R["weather"] = pg.evaluate("[wxTemp.textContent, wxDesc.textContent, wxLoc.textContent, wxMoon.textContent].join(' | ')")
    R['_step'] = 'go("scr-globe", 1800); gbx = pg.locator('
    go("scr-globe", 1800); gbx = pg.locator("#globeCv").bounding_box()
    pg.mouse.move(gbx["x"] + 100, gbx["y"] + 150); pg.mouse.down()
    for i in range(1, 10): pg.mouse.move(gbx["x"] + 100 + i * 20, gbx["y"] + 150); pg.wait_for_timeout(16)
    pg.mouse.up(); pg.wait_for_timeout(700)
    c1 = pg.locator("#globeCities button").nth(2)
    if c1.count(): c1.click(); pg.wait_for_timeout(1500)
    R["globeCities"] = pg.evaluate("document.querySelectorAll('#globeCities button').length"); shot("10-globe")
    R['_step'] = 'go("scr-level"); pg.click("#lvEnable"); '
    go("scr-level"); pg.click("#lvEnable"); pg.wait_for_timeout(1200); R["level"] = pg.inner_text("#lvNote")[:90] + " | " + pg.inner_text("#lvRead"); shot("11-level")
    # hub
    R['_step'] = 'hub'
    pg.click('.dock button[data-g="hub"]'); pg.wait_for_timeout(900); chk("hub"); shot("12-hub")
    R["hubTiles"] = pg.evaluate("document.querySelectorAll('#hubGrid .hub-tile').length")
    R["hubSecs"] = pg.evaluate("[...document.querySelectorAll('#hubGrid .hub-sec')].map(e=>e.textContent.trim())")
    pg.click('.hub-tile[data-hub="scr-horo"]'); pg.wait_for_timeout(900); chk("horo")
    pg.locator("#signGrid button").nth(4).click(); pg.wait_for_timeout(700); R["horo"] = pg.inner_text("#horoCard")[:80]
    R['_step'] = 'go("scr-mood"); pg.locator("#moodRow but'
    go("scr-mood"); pg.locator("#moodRow button").nth(1).click(); pg.wait_for_timeout(600); R["mood"] = pg.inner_text("#moodReply")[:80]
    R['_step'] = 'go("scr-custom"); pg.locator("#swatches '
    go("scr-custom"); pg.locator("#swatches button").nth(2).click(); pg.wait_for_timeout(600); pg.locator("#swatches button").nth(0).click()
    R['_step'] = 'go("scr-ach"); R["ach"] = pg.inner_text('
    go("scr-ach"); R["ach"] = pg.inner_text("#achCount")
    R['_step'] = 'go("scr-vitals"); R["eggs"] = pg.inner_t'
    go("scr-vitals"); R["eggs"] = pg.inner_text("#eggCount")
    R['_step'] = 'go("scr-settings"); shot("17-settings")'
    go("scr-settings"); shot("17-settings")
    pg.evaluate("DP.tools.light(true)"); pg.wait_for_timeout(800); R["light"] = pg.evaluate("!document.querySelector('#lightLayer').hidden"); pg.click("#lightClose"); pg.wait_for_timeout(500)
    # --- 3S screens ---
    R['_step'] = '--- 3S screens ---'
    R['_step'] = 'go("scr-ask"); pg.fill("#askIn", "Will I'
    go("scr-ask"); pg.fill("#askIn", "Will I get tacos tonight?"); pg.press("#askIn", "Enter"); pg.wait_for_timeout(1500)
    pg.locator("#askQuick button").nth(2).click(); pg.wait_for_timeout(1500); pg.click("#askBall"); pg.wait_for_timeout(1600)
    R["askLog"] = pg.evaluate("document.querySelectorAll('#askLog li').length"); R["askLast"] = pg.evaluate("(document.querySelector('#askLog li')||{}).textContent||''")[:100]; shot("20-ask")
    R['_step'] = 'go("scr-roulette"); pg.click("#rouSpin")'
    go("scr-roulette"); pg.click("#rouSpin"); pg.wait_for_timeout(5500); R["roulette"] = pg.inner_text("#rouResult")[:120]; shot("21-roulette")
    pg.click("#rouGo"); pg.wait_for_timeout(1200); R["afterRouGo"] = pg.evaluate("(document.querySelector('.screen.active')||{id:'NONE'}).id")
    R['_step'] = 'go("scr-booth"); pg.click("#boothStart")'
    go("scr-booth"); pg.click("#boothStart"); pg.wait_for_timeout(2500)
    pg.locator("#boothMasks button").nth(2).click(); pg.locator("#boothFilters button").nth(1).click()
    st = pg.locator("#boothStickers button")
    for k in range(min(3, st.count())): st.nth(k).click(); pg.wait_for_timeout(150)
    pg.click("#boothSnap"); pg.wait_for_timeout(2500)
    R["booth"] = [pg.evaluate("document.querySelectorAll('#boothItems > *').length"), pg.evaluate("document.querySelectorAll('#boothShots img, #boothShots a').length"), pg.evaluate("!document.querySelector('#boothSave').disabled")]; shot("22-booth")
    pg.click("#boothClear")
    R['_step'] = 'go("scr-daily"); R["daily"] = pg.evaluat'
    go("scr-daily"); R["daily"] = pg.evaluate("[...document.querySelectorAll('#dailyList li')].map(l=>l.textContent.trim().slice(0,50))"); shot("23-daily")
    R['_step'] = 'go("scr-widgets", 1500); pg.click("#wgFe'
    go("scr-widgets", 1500); pg.click("#wgFeed"); pg.wait_for_timeout(600); R["widgets"] = pg.evaluate("document.querySelectorAll('#wgGrid > *').length"); shot("24-widgets")
    R['_step'] = 'go("scr-sandbox"); sb = pg.locator("#san'
    go("scr-sandbox"); sb = pg.locator("#sandStage").bounding_box()
    for k, t in enumerate(["blood", "pistol", "shotgun", "confetti", "chimis"]):
        pg.click(f"#sandTools button[data-t='{t}']")
        for j in range(3): pg.mouse.click(sb["x"] + 60 + j * 100, sb["y"] + 60 + k * 30); pg.wait_for_timeout(120)
    for gv in ["down", "zero", "up", "tilt"]: pg.click(f"#sandGrav button[data-g='{gv}']"); pg.wait_for_timeout(200)
    pg.click("#sandFling"); pg.wait_for_timeout(600); R["sandCount"] = pg.evaluate("DP.phys.list.length + ' decals ' + DP.phys.decals.length"); shot("25-sandbox"); pg.click("#sandClear")
    R['_step'] = 'go("scr-sound"); pg.click("#musPlay"); p'
    go("scr-sound"); pg.click("#musPlay"); pg.wait_for_timeout(1200)
    sty = pg.locator("#musStyles button")
    for k in range(sty.count()): sty.nth(k).click(); pg.wait_for_timeout(900)
    sbb = pg.locator("#sbGrid button")
    for k in range(sbb.count()): sbb.nth(k).click(); pg.wait_for_timeout(120)
    R["music"] = [pg.evaluate("DP.music.on"), pg.inner_text("#musName"), sbb.count()]; shot("26-sound")
    pg.click("#musPlay"); pg.wait_for_timeout(300)
    R['_step'] = 'go("scr-visuals"); scenes = pg.locator("'
    go("scr-visuals"); scenes = pg.locator("#sceneGrid button")
    R["scenes"] = scenes.count()
    for k in range(scenes.count()): scenes.nth(k).click(); pg.wait_for_timeout(900)
    R["glStats"] = pg.evaluate("DP.gl.stats ? JSON.stringify(DP.gl.stats()) : ''")
    for v in ["saver", "max", "auto"]: pg.click(f"#segPerf button[data-v='{v}']"); pg.wait_for_timeout(300)
    shot("27-visuals")
    pg.click("#visIntro"); pg.wait_for_timeout(2500); shot("28-intro-panels"); R["introReplay"] = pg.evaluate("!!document.querySelector('#intro3')"); pg.mouse.click(215, 500); pg.wait_for_timeout(1200)
    # reduce motion round-trip
    R['_step'] = 'reduce motion round-trip'
    pg.evaluate("const i=document.querySelector('[data-set=reduceMotion]'); i.checked=true; i.dispatchEvent(new Event('change'))"); pg.wait_for_timeout(300)
    pg.click('.dock button[data-g="watch"]'); pg.wait_for_timeout(900)
    pg.evaluate("const i=document.querySelector('[data-set=reduceMotion]'); i.checked=false; i.dispatchEvent(new Event('change'))")
    # final state
    R['_step'] = 'final state'
    pg.evaluate("DP.core.go('scr-watch')"); pg.wait_for_timeout(600); pg.evaluate("DP.app.setFace(DP.faces.list.findIndex(f=>f.id==='peggy'))"); pg.wait_for_timeout(900); shot("30-peggy")
    R["sw"] = pg.evaluate("navigator.serviceWorker ? navigator.serviceWorker.getRegistration().then(r => !!r) : 'n/a'")
    R["manifest"] = pg.evaluate("fetch('manifest.json').then(r=>r.json()).then(m=>[m.name,m.short_name,m.id,m.start_url].join(' / '))")
    pg.wait_for_timeout(1500)
    R["cacheKeys"] = pg.evaluate("self.caches ? caches.keys() : 'n/a'")
    R["lsForeign"] = pg.evaluate("Object.keys(localStorage).filter(k=>!k.startsWith('dpw3s.'))")
    R["achUnlocked"] = pg.evaluate("Object.keys(DP.core.stats.ach).length"); R["eggsFound"] = pg.evaluate("Object.keys(DP.core.stats.eggs)")
    R["overflow"] = over
    R["errors"] = errs
    b.close(); return R
LAST = {}
with sync_playwright() as p:
    for e in (["webkit", "chrome"] if ENG == "both" else [ENG]):
        try: print(json.dumps(run(p, e), indent=1))
        except Exception as ex: print(e, "FAILED:", repr(ex)[:1200], "\nstep:", LAST.get("R", {}).get("_step"), "\nerrors:", LAST.get("errs"))
