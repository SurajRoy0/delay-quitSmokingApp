const CACHE_NAME = "delay-pwa-cache-v1";
const OFFLINE_URL = "/offline";

const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Install: pre-cache application shell and core fallback pages
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Pre-caching core app shell and offline resources");
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up outdated cache storage
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Cleaning up obsolete cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Message: listen for instruction to bypass wait stage and activate immediately
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("[Service Worker] Skipping wait phase and activating new worker");
    self.skipWaiting();
  }
});

// Fetch: network-first for document views, stale-while-revalidate for assets
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Avoid intercepting Webpack HMR, Next.js internal data requests, chrome extension queries, and server APIs
  if (
    url.pathname.includes("webpack-hmr") ||
    url.pathname.startsWith("/_next/data") ||
    url.pathname.startsWith("/api") ||
    !url.protocol.startsWith("http")
  ) {
    return;
  }

  // Navigation requests (page loads)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful page navigations for offline recovery
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network failed, look in cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If cache failed, serve the designated offline fallback page
            return caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // Stale-While-Revalidate caching strategy for local static resources (JS, CSS, images)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch((err) => {
            console.warn(`[Service Worker] Fetch failed for ${request.url}:`, err);
            // Return cached response if offline fetch failed
            return cachedResponse;
          });

        return cachedResponse || fetchPromise;
      })
    );
  }
});
