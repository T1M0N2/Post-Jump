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
