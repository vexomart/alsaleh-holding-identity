// NOTE:
// This app is built with Vite, where JS/CSS asset filenames are hashed.
// A cache-first SW can easily serve a stale index.html -> stale assets -> "old UI".
// Therefore we use **network-first** for navigations (HTML documents) to guarantee
// users see the latest deploy, and a conservative cache strategy for other GET requests.

// Bump this when adjusting SW behavior.
const SW_VERSION = 'v3.0.0-2026-02-02';
const CACHE_NAME = `alsaleh-holding-${SW_VERSION}`;

// Keep the precache list minimal to reduce stale-deploy risk.
const urlsToCache = ['/', '/manifest.json'];

// Install: precache minimal shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate: remove old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle same-origin GET requests.
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Skip caching for backend/auth endpoints
  if (event.request.url.includes('supabase.co') || event.request.url.includes('/auth/')) return;

  const isNavigation = event.request.mode === 'navigate' || event.request.destination === 'document';

  // Network-first for navigations to avoid stale HTML/JS.
  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || (await caches.match('/')) || new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  // Cache-first for other assets/APIs (non-auth), with network fallback.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => new Response('Service Unavailable', { status: 503 }));
    })
  );
});