const CACHE = 'pdf-annotator-v7';
const LOCAL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(LOCAL).catch(() => {})));
  // Do not unconditionally skipWaiting here so the update prompt can display
  // and activate only when confirmed by the user.
});

// The page requests immediate activation when the user clicks 'Update'
self.addEventListener('message', e => {
  if (e.data && (e.data.type === 'SKIP_WAITING' || e.data === 'skipWaiting')) {
    self.skipWaiting();
  }
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // version.json is the update probe: always fetch fresh from network
  if (url.pathname.endsWith('/version.json')) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).catch(() => new Response('', { status: 504 }))
    );
    return;
  }

  // Force cache bypass on hard reload
  if (url.searchParams.has('_v') || url.searchParams.has('_r')) {
    e.respondWith(fetch(e.request));
    return;
  }

  /* local files: cache-first */
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(hit =>
        hit || fetch(e.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
      )
    );
    return;
  }

  /* CDN resources: stale-while-revalidate */
  e.respondWith(
    caches.open(CACHE).then(async c => {
      const cached = await c.match(e.request);
      const network = fetch(e.request).then(res => {
        c.put(e.request, res.clone());
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
