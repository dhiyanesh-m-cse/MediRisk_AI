/* MediRisk PWA shell cache. Private account APIs and health-file routes are never cached. */
const CACHE = "medirisk-public-shell-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(["/", "/manifest.webmanifest"])).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  const isPrivateRoute = url.pathname.startsWith("/api/") || url.pathname.startsWith("/manus-storage/");
  if (request.method !== "GET" || url.origin !== self.location.origin || isPrivateRoute) return;
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok && response.type === "basic") caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
    return response;
  }).catch(() => request.mode === "navigate" ? caches.match("/") : Response.error())));
});
