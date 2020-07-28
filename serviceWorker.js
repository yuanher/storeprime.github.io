const staticCacheName = "gs-static-v1";
const dynamicCacheName = "gs-dynamic-v1";
const assets = [
  "/",
  "/index.html",
  "/fallback.html",
  "/css/gs.css",
  "/js/gs_db.js",
  "/js/gs_fb.js",
  "/js/gs_map.js",
  "/js/gs_pn.js",
  "/js/gs_sc.js",
  "/images/1.png",
  "/images/2.png",
  "/images/3.png",
  "/images/4.png",
  "/images/5.png",
  "/images/6.png",
  "/images/7.png",
  "/images/banner5.jpg",
  "/images/cheese.jpg",
  "/images/drinks.jpg",
  "/images/fruits_vegetables.jpg",
  "/images/logo.png",
  "/images/seafoods.jpg",
  "/images/supermarket.jpg",
  "/fonts/cac_champagne.ttf",
  "/fonts/cac_champagne.woff",
  "/fonts/OdibeeSans-Regular.ttf",
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener("install", (evt) => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener("activate", (evt) => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then((keys) => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener("fetch", (evt) => {
  if (!(evt.request.url.indexOf("http") === 0)) return; // skip the request. if request is not made with http protocol
  if (!(evt.request.url.indexOf("https") === 0)) return; // skip the request. if request is not made with http protocol
  if (evt.request.url.indexOf("firestore.googleapis.com") === -1) {
    evt.respondWith(
      caches
        .match(evt.request)
        .then((cacheRes) => {
          return (
            cacheRes ||
            fetch(evt.request).then((fetchRes) => {
              return caches.open(dynamicCacheName).then((cache) => {
                cache.put(evt.request.url, fetchRes.clone());
                // check cached items size
                limitCacheSize(dynamicCacheName, 15);
                return fetchRes;
              });
            })
          );
        })
        .catch(() => {
          if (evt.request.url.indexOf(".html") > -1) {
            return caches.match("/fallback.html");
          }
        })
    );
  }
});

self.addEventListener("push", function (event) {
  self.registration.pushManager.getSubscription().then(function (subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log("[Service Worker] Push Received.");
      console.log(
        `[Service Worker] Push had this data: "${event.data.text()}"`
      );

      const title = "Grocery Store";
      const options = {
        body: event.data.text(),
        icon: "images/icons/icon-96x96.png",
        badge: "images/badge.png",
      };

      self.registration.showNotification(title, options);
    }
  });
});

self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] Notification click Received.");

  event.notification.close();

  event.waitUntil(clients.openWindow("https://developers.google.com/web/"));
});
