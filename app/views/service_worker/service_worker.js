importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
  );
  
  function onInstall(event) {
    console.log("[Serviceworker]", "Installing!", event);
  }
  
  function onActivate(event) {
    console.log("[Serviceworker]", "Activating!", event);
  }
  
  function onFetch(event) {
    console.log("[Serviceworker]", "Fetching!", event);
  }
  
  self.addEventListener("install", onInstall);
  self.addEventListener("activate", onActivate);
  self.addEventListener("fetch", onFetch);
  
  // Workbox configuration begins here
  const { CacheFirst, NetworkFirst } = workbox.strategies;
  const { registerRoute } = workbox.routing;
  
  // Cache the task index page
  registerRoute(
    ({ url }) => url.pathname === "/" || url.pathname.startsWith("/users"),
    new CacheFirst({
      cacheName: "users",
    })
  );
  
  registerRoute(
    ({ request, url }) =>
      request.destination === "document" ||
      (request.destination === "" &&
        // we fetch this image to check the network status, so we exclude it from cache
        !url.pathname.includes("/1pixel.png")),
    new NetworkFirst({ cacheName: "documents" })
  );
  
  // For assets (scripts and images), we use the cache first
  registerRoute(
    ({ request }) =>
      request.destination === "script" || request.destination === "style",
    new CacheFirst({
      cacheName: "assets-styles-and-scripts",
    })
  );
  
  registerRoute(
    ({ request }) => request.destination === "image",
    new CacheFirst({
      cacheName: "assets-images",
    })
  );
  