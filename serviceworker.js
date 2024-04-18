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
    // Zum Beispiel könnten Sie einen Button oder ein Modalfenster anzeigen, das den Benutzer zur Installation einlädt
    // Hier ist ein einfaches Beispiel, wie ein Button zum Installations-Popup führen kann
    const installButton = document.createElement('button');
    installButton.textContent = 'Installieren';
    installButton.addEventListener('click', () => {
        // Überprüfen, ob deferredPrompt verfügbar ist
        if (deferredPrompt) {
            // Das Installations-Popup anzeigen
            deferredPrompt.prompt();
            // Warten, bis der Benutzer auf Installieren, Abbrechen oder Ignorieren klickt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Benutzer hat die Installation akzeptiert');
                } else {
                    console.log('Benutzer hat die Installation abgelehnt');
                }
                // Setzen von deferredPrompt auf null, da das Installations-Popup nur einmal angezeigt werden kann
                deferredPrompt = null;
            });
        }
    });
    // Fügen Sie den Button zur Webseite hinzu
    document.body.appendChild(installButton);
}


// Name des Cache
const cacheName = 'post-jump-v1';

// Dateien, die gecacht werden sollen
const filesToCache = [
    '/',
    'index.html',
    'manifest.json',
    'home.png',
    'style.css',
    'script.js',
    // Weitere Ressourcen hinzufügen, die gecacht werden sollen
];

// Installationsereignis
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    );
});

// Fetch-Ereignis, um Ressourcen abzurufen
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Ressource aus dem Cache bedienen, falls vorhanden
                if (response) {
                    return response;
                }
                // Andernfalls von der Netzwerkquelle holen (falls online)
                return fetch(event.request);
            }).catch(() => {
                // Im Falle eines Fehlers (z.B. Netzwerkfehler), den Offline-Fallback anzeigen
                return caches.match('/offline.html');
            })
    );
});

// Optional: Aktualisieren des Service Workers und Bereinigen des Caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});