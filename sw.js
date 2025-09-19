
const CACHE = 'llewie-httpd-v1';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([
    '/', '/index.html', '/manifest.json',
    '/icon-192.png', '/icon-512.png'
  ])));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => self.clients.claim());
self.addEventListener('fetch', (e) => {
  const {request} = e;
  if (request.method !== 'GET') return;
  e.respondWith(
    caches.match(request).then(res => res || fetch(request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(request, copy));
      return r;
    }).catch(() => caches.match('/index.html')))
  );
});
