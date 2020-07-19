const staticGroceryStore = "GroceryStore-v1";
const assets = [
  "/",
  "/manifest.json",
  "/index.html",
  "/about.html",
  "/contact.html",
  "/shoppingcart.html",
  "/css/gs.css",
  "/serviceWorker.js",
  "/js/gs_db.js",
  "/js/gs_fb.js",
  "/js/gs_map.js",
  "/js/gs_pn.js",
  "/js/gs_sc.js",
  "/js/jquery-3.2.1.min.js",
  "/js/jquery.min.js",
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
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticGroceryStore).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  if (!(fetchEvent.request.url.indexOf("http") === 0)) return; // skip the request. if request is not made with http protocol
  fetchEvent.respondWith(
    caches.open(staticGroceryStore).then(function (cache) {
      return cache.match(fetchEvent.request).then((res) => {
        return (
          res ||
          fetch(fetchEvent.request).then(function (res) {
            cache.put(fetchEvent.request, res.clone());
            return res;
          })
        );
      });
    })
  );
});
