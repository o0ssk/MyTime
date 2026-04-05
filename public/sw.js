/**
 * MyTime Celestial Chronograph - Service Worker
 * Version: 2.1.0
 */

const VERSION = 'v2.1.0';
const CACHE_NAME = `mytime-cache-${VERSION}`;

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// 1. INSTALL EVENT: Pre-cache core assets and force immediate activation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// 2. ACTIVATE EVENT: Clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // If the cache name doesn't match the current CACHE_NAME, delete it
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensure the new service worker takes control of all pages immediately 
  return self.clients.claim();
});

// 3. FETCH EVENT: Network-first for initial navigation, Cache-first for static assets
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Strategy: Network-First for the document (HTML) to ensure latest updates
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Strategy: Cache-First for static assets (icons, manifest, etc.)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
        // Cache new static assets on the fly if needed
        if (url.origin === self.location.origin && networkResponse.status === 200) {
           const clonedResponse = networkResponse.clone();
           caches.open(CACHE_NAME).then((cache) => {
             cache.put(event.request, clonedResponse);
           });
        }
        return networkResponse;
      });
    })
  );
});
