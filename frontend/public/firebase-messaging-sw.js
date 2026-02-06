importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');


const firebaseConfig = {
  apiKey: "AIzaSyA4_LxSn8c-52ZpjJ2nOHXnm0SbgLsHZrM",
  authDomain: "doctrek---doctor-appointment.firebaseapp.com",
  projectId: "doctrek---doctor-appointment",
  storageBucket: "doctrek---doctor-appointment.firebasestorage.app",
  messagingSenderId: "149508306728",
  appId: "1:149508306728:web:928c151738030b5502c21d",
  measurementId: "G-G70KCPLY9N",
};

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/logo192.png', 
    badge: '/badge.png', 
    data: payload.data || {},
    tag: payload.data?.notificationId || 'notification',
    requireInteraction: false,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  
  event.notification.close();

  const link = event.notification.data?.link || '/';
  const fullUrl = self.location.origin + link;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === fullUrl && 'focus' in client) {
            return client.focus();
          }
        }
        
        if (clients.openWindow) {
          return clients.openWindow(fullUrl);
        }
      })
  );
});