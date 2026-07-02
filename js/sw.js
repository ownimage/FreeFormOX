const CACHE = "ffox-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.open(CACHE).then((cache) => {
      return fetch(e.request).then((res) => {
        if (e.request.method === "GET") cache.put(e.request, res.clone());
        return res;
      }).catch(() => cache.match(e.request));
    })
  );
});
