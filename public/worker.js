self.addEventListener('push', function(e) {
    if (!e.data) return;
    let data;
    try {
        data = e.data.json();
    } catch (err) {
        console.error('Push: error al parsear datos', err);
        return;
    }

    const opciones = {
        body: data.message || '',
        icon: '/favicon.ico',
        vibrate: [100, 50, 100],
        data: { url: data.url || '/' }
    };

    e.waitUntil(
        self.registration.showNotification(data.title || 'Notificación', opciones)
    );
});

self.addEventListener('notificationclick', function(e) {
    e.notification.close();
    const url = e.notification.data?.url || '/';
    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            if (clientList.length) clientList[0].focus();
            if (clients.openWindow) return clients.openWindow(url);
        })
    );
});