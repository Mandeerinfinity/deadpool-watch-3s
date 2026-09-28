/* Deadpool Watch 3S service worker: offline app shell.
   Own cache namespace ("dpw3s-"): on activate it deletes ONLY older "dpw3s-" caches, never v1's or v2's.
   All three apps share the github.io origin, and v1's worker may delete other caches on its own activate, so every
   lookup here tolerates a missing cache, falls back to the network and repopulates (self-heals). */
const PREFIX = "dpw3s-";
const VERSION = PREFIX + "v3.0.0";
const ASSETS = [
  "./", "./index.html", "./manifest.json", "./css/style.css", "./css/v2.css", "./css/s3.css",
  "./js/s3-boot.js", "./js/quips.js", "./js/quips2.js", "./js/quips3.js", "./js/sound.js", "./js/sound3.js", "./js/fx.js", "./js/fx3.js",
  "./js/gl.js", "./js/faces.js", "./js/faces2.js", "./js/faces3.js", "./js/faces3gl.js", "./js/faces3b.js",
  "./js/complications.js", "./js/app.js", "./js/tools2.js", "./js/games.js", "./js/games3.js", "./js/world3.js", "./js/booth3.js", "./js/features3.js",
  "./img/land.png",
  "./fonts/Bangers-Regular.woff2", "./fonts/Oswald.woff2", "./fonts/ShareTechMono-Regular.woff2", "./fonts/LuckiestGuy-Regular.woff2",
  "./fonts/PermanentMarker-Regular.woff2", "./fonts/GochiHand-Regular.woff2", "./fonts/GreatVibes-Regular.woff2", "./fonts/BebasNeue-Regular.woff2",
  "./fonts/Orbitron.woff2", "./fonts/Cinzel.woff2",
  "./icons/icon.svg", "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png",
  "./icons/icon-maskable-512.png", "./icons/favicon-64.png", "./icons/icon-167.png", "./icons/icon-152.png", "./icons/icon-120.png",
  "./icons/splash-1290x2796.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
const put = (req, res) => caches.open(VERSION).then(c => c.put(req, res)).catch(() => { });
const match = (req) => caches.open(VERSION).then(c => c.match(req, { ignoreSearch: true })).catch(() => undefined);
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { put("./index.html", r.clone()); return r; })
      .catch(() => match("./index.html").then(hit => hit || new Response("Offline and the cache got unalived. Reconnect once and I'll heal.", { status: 503, headers: { "Content-Type": "text/plain" } }))));
    return;
  }
  e.respondWith(match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) put(req, r.clone()); return r; })));
});
