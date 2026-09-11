/* Jobsite Logger — service worker
 *
 * Two jobs:
 *   1. Keep a copy of the app so it opens with no signal
 *   2. Never cache data, so nobody ever sees a stale job
 *
 * Bump CACHE when you upload a new index.html. Old caches are cleared on
 * activate, so a version bump is what forces every phone to take the update.
 */

const CACHE = 'jobsite-logger-v11';

const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // One missing file should not fail the whole install.
      Promise.all(SHELL.map((url) => cache.add(url).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((n) => n !== CACHE).map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Supabase and any other API: straight to the network, never cached.
  // A cached job list would be worse than no job list.
  if (url.hostname.endsWith('supabase.co') || url.pathname.startsWith('/rest/')) {
    return;
  }

  // The page itself: fresh when online, cached copy when not. This is what
  // makes updates appear without stranding people offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then((hit) => hit || caches.match('./')))
    );
    return;
  }

  // Everything else — icons, fonts, the CDN libraries: cached copy first for
  // speed, then quietly refreshed in the background.
  event.respondWith(
    caches.match(req).then((hit) => {
      const fetching = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || fetching;
    })
  );
});
