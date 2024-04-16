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

// Aktualisierter Code für die Installation und Abfrage von Ressourcen aus dem Cache im Offline-Modus
const cacheName = 'pwa-cache-v1';
const filesToCache = [
    '/',
    'index.html',
    'manifest.json',
    'home.png',
    'style.css',
    'script.js',
    // Weitere Ressourcen, die gecacht werden sollen, hinzufügen
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
                // Wenn die Ressource im Cache gefunden wird, geben Sie sie zurück
                if (response) {
                    return response;
                }
                // Andernfalls versuchen Sie, die Ressource vom Netzwerk abzurufen
                return fetch(event.request)
                    .then(response => {
                        // Wenn die Ressource erfolgreich vom Netzwerk abgerufen wurde, fügen Sie sie dem Cache hinzu
                        return caches.open(cacheName)
                            .then(cache => {
                                cache.put(event.request.url, response.clone());
                                return response;
                            });
                    })
                    .catch(() => {
                        // Wenn der Abruf fehlschlägt und die Ressource nicht im Cache vorhanden ist, geben Sie eine Offline-Seite zurück
                        return caches.match('/offline.html');
                    });
            })
    );
});
