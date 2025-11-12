const CACHE_NAME = "bolzenschweiss-rechner-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/css/styles.css",
  "./assets/js/app.js",
  "./assets/js/includes.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET"){
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached){
        return cached;
      }
      return fetch(req).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return resp;
      }).catch(() => cached);
    })
  );
});
