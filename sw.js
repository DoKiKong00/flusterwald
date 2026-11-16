/* Service Worker: hält alle Dateien vor, damit Flüsterwald auch ohne Internet startet.
 * Bei jeder Änderung an den Dateien VERSION hochzählen. */
const VERSION = 'v2';
const CACHE = 'fluesterwald-' + VERSION;
const FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './scenes/_kit.js',
  './scenes/wald.js',
  './scenes/bauernhof.js',
  './scenes/meer.js',
  './scenes/nacht.js',
  './scenes/savanne.js',
  './scenes/schnee.js',
  './scenes/teich.js',
  './scenes/garten.js',
  './scenes/dschungel.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('fluesterwald-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Erst aus dem Speicher liefern (schnell, offline), im Hintergrund aktualisieren.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const fresh = fetch(req)
        .then((res) => { if (res.ok) cache.put(req, res.clone()); return res; })
        .catch(() => cached);
      return cached || fresh;
    }),
  );
});
