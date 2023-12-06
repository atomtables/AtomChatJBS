self.addEventListener('notificationclick', function (event) {
    event.notification.close(); // Close the notification

    // Use clients.matchAll to find all open windows or tabs under your control
    event.waitUntil(
        clients.matchAll({
            type: 'window',
        })
        .then(function (clientList) {
            // Iterate over the clients and focus on the first one
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if ('focus' in client) {
                    return client.focus();
                }
            }

            // If no clients are open, open a new one
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});