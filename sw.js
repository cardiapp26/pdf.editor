const CACHE = 'pdf-annotator-v16';
const LOCAL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(LOCAL).catch(() => {}))
  );
  // Activate immediately so new deploys roll out to all open tabs
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Allow manual skip waiting via postMessage if needed
self.addEventListener('message', e => {
  if (e.data && (e.data.type === 'SKIP_WAITING' || e.data === 'skipWaiting')) {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // version.json is the update probe: always fetch fresh from network
  if (url.pathname.endsWith('/version.json')) {
    e.respondWith(
      fetch(req, { cache: 'no-store' }).catch(() => new Response('', { status: 504 }))
    );
    return;
  }

  // Force cache bypass on hard reload (?_v= or ?_r=)
  if (url.searchParams.has('_v') || url.searchParams.has('_r')) {
    e.respondWith(fetch(req));
    return;
  }

  // Network-first for navigation and HTML: ensures tabs always get latest app shell
  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(req, clone));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          const shell = await caches.match('./index.html');
          if (shell) return shell;
          return new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  /* local files (icons, assets): cache-first */
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then(hit =>
        hit || fetch(req).then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
          return res;
        })
      )
    );
    return;
  }

  /* CDN resources: stale-while-revalidate */
  e.respondWith(
    caches.open(CACHE).then(async c => {
      const cached = await c.match(req);
      const network = fetch(req).then(res => {
        c.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
