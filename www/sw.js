/* HPM service worker — caches the single-file app shell so it works offline
   and survives a refresh after install. */
const CACHE = "hpm-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest",
               "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  // Stale-while-revalidate for same-origin
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    const network = fetch(req).then(res => {
      if (res && res.ok && new URL(req.url).origin === self.location.origin) {
        cache.put(req, res.clone()).catch(() => {});
      }
      return res;
    }).catch(() => cached);
    return cached || network;
  })());
});
