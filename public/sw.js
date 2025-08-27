const CACHE_NAME = 'alsaleh-holding-v' + Date.now();
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Clear old caches on install
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache));
    })
  );
});

// Take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  // Skip caching for Supabase auth requests and API calls
  if (event.request.url.includes('supabase.co') || 
      event.request.url.includes('/auth/') ||
      event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Return a basic response if fetch fails for cached requests
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
          return new Response('Service Unavailable', { status: 503 });
        });
      })
  );
});