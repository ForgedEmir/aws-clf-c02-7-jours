/* Cache hors ligne. Change VERSION à chaque mise à jour du contenu pour forcer le rafraîchissement. */
const VERSION = "clf-c02-v3";
const FILES = ["./", "index.html", "manifest.webmanifest", "assets/style.css", "assets/app.js", "assets/viz.js", "assets/viz.css", "assets/icon.svg", "assets/icon-180.png", "data/days.js", "data/questions.js", "data/cards.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Réseau d'abord, cache local en secours hors ligne.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const mine = url.origin === location.origin;
  if (!mine) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
