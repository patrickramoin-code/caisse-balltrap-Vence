const CACHE_NAME = "caisse-bt-v5";

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        "./",
        "./index.html",
        "./manifest.json"
      ]);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        const responseClone = response.clone();

        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseClone);
        });

        return response;
      })
      .catch(function() {
        return caches.match(event.request);
      })
  );
});
