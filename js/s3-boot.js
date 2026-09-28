/* Deadpool Watch 3S — boot. Runs first. On the very first run (no "dpw3s." data yet) it makes a READ-ONLY COPY of
   Deadpool Watch 2's settings, stats, achievements, eggs and high scores into 3S's own "dpw3s." keys.
   It never writes, moves or deletes any "dpw2." (or v1) key. Alarms, countdowns and running timers are NOT copied. */
window.DP = window.DP || {};
(function () {
  const P3 = "dpw3s.", P2 = "dpw2.";
  const COPY = ["settings", "stats", "best.slice", "best.bullet", "loc", "wx", "sign", "iv", "focus", "bezel", "swiped", "motion"];
  DP.boot = { imported: false, keys: [] };
  try {
    const ls = window.localStorage; if (!ls) return;
    let has3 = false; for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (k && k.indexOf(P3) === 0) { has3 = true; break; } }
    if (has3) return;
    const got = [];
    COPY.forEach(k => { const v = ls.getItem(P2 + k); if (v != null) { try { JSON.parse(v); ls.setItem(P3 + k, v); got.push(k); } catch (e) { } } });
    ls.setItem(P3 + "importChecked", JSON.stringify(Date.now()));
    if (got.length) { ls.setItem(P3 + "imported", JSON.stringify({ at: Date.now(), keys: got, pending: true })); DP.boot.imported = true; DP.boot.keys = got; }
  } catch (e) { /* private mode / storage blocked: start fresh */ }
})();
