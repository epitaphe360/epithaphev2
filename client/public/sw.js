/* ─── Epitaphe360 Service Worker ─────────────────────────────────────────────
   Stratégie :
   - Static assets (JS/CSS/fonts/images) → Cache-First (CacheStorage)
   - API calls (/api/*) → Network-First avec fallback cache
   - Navigation (HTML) → Network-First
──────────────────────────────────────────────────────────────────────────── */

const CACHE_NAME = "epitaphe360-v1";
const API_CACHE  = "epitaphe360-api-v1";

const STATIC_ASSETS = [
  "/",
  "/manifest.json",
];

/* ── Install : précache assets statiques ─────────────────── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

/* ── Activate : suppression anciens caches ───────────────── */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== API_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ── Fetch : stratégies par type ─────────────────────────── */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET et cross-origin
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // Stratégie API : Network-First
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Stratégie assets statiques (JS, CSS, images) : Cache-First
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(cacheFirst(request, CACHE_NAME));
    return;
  }

  // Stratégie navigation HTML : Network-First
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, CACHE_NAME));
    return;
  }
});

/* ── Helpers ─────────────────────────────────────────────── */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Ressource non disponible hors ligne", { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Fallback navigation → page d'accueil
    if (request.mode === "navigate") {
      const fallback = await caches.match("/");
      if (fallback) return fallback;
    }
    return new Response("Hors ligne — veuillez vérifier votre connexion.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}

/* ── Push Notifications ──────────────────────────────────── */
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Epitaphe360", body: event.data.text(), url: "/" };
  }

  const options = {
    body: payload.body ?? "",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-96x96.png",
    image: payload.image ?? undefined,
    data: { url: payload.url ?? "/" },
    vibrate: [200, 100, 200],
    tag: payload.tag ?? "e360-notification",
    renotify: true,
    actions: payload.actions ?? [
      { action: "open", title: "Ouvrir" },
      { action: "dismiss", title: "Ignorer" },
    ],
  };

  event.waitUntil(self.registration.showNotification(payload.title ?? "Epitaphe360", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "dismiss") return;

  const targetUrl = event.notification.data?.url ?? "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Réutiliser onglet existant si possible
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
