// Definieren einer globalen Variable, um das beforeinstallprompt-Ereignis zu speichern
let deferredPrompt;

// Hinzufügen des beforeinstallprompt-Event-Handlers
self.addEventListener('beforeinstallprompt', (event) => {
    // Verhindern des Standardverhaltens, um das Installations-Popup anzuzeigen
    event.preventDefault();
    // Speichern des Ereignisses für die spätere Verwendung
    deferredPrompt = event;
    // Rufen Sie Ihre benutzerdefinierte Funktion auf, um das Installations-Popup anzuzeigen
    showInstallPrompt();
});


function showInstallPrompt() {
    // Hier können Sie Ihren eigenen Code hinzufügen, um das Installations-Popup anzuzeigen
}

// Der restliche Code Ihres Service Worker-Skripts bleibt unverändert
const cacheName = 'pwa-cache-v1';
const filesToCache = [
    '/',
    'index.html',
    'manifest.json',
    'home.png',
	'style.css',
	'script.js',

    // Fügen Sie hier weitere Ressourcen hinzu, die gecacht werden sollen
];
 
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    );
});
 
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
