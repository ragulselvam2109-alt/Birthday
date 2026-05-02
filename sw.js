// Birthday Website Service Worker
const CACHE_NAME = 'birthday-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/main-fixed.js'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Cache opened');
            return cache.addAll(urlsToCache).catch(err => {
                console.log('Cache addAll error:', err);
                return Promise.resolve();
            });
        })
        .catch(err => {
            console.log('Cache open error:', err);
            return Promise.resolve();
        })
    );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch Event - Network First Strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
        .then((response) => {
            // Clone the response
            const clonedResponse = response.clone();

            // Try to cache it
            caches.open(CACHE_NAME)
                .then((cache) => {
                    cache.put(event.request, clonedResponse);
                });

            return response;
        })
        .catch(() => {
            // Fallback to cache if network fails
            return caches.match(event.request)
                .then((response) => {
                    return response || new Response('Offline - Content not available', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
        })
    );
});