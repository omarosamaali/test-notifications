importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyBQCPTwnybdtLNUwNCzDDA23TLt3pD5zP4",
  authDomain:        "omdachina25.firebaseapp.com",
  databaseURL:       "https://omdachina25-default-rtdb.firebaseio.com",
  projectId:         "omdachina25",
  storageBucket:     "omdachina25.firebasestorage.app",
  messagingSenderId: "1031143486488",
  appId:             "1:1031143486488:web:0a662055d970826268bf6d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || 'إشعار جديد';
  const body  = payload.notification?.body  || '';
  const icon  = payload.notification?.icon  || '/images/icon-192.png';
  const url   = payload.data?.url || '/';

  self.registration.showNotification(title, {
    body, icon,
    badge: '/images/icon-192.png',
    tag: 'kararif-notif',
    renotify: true,
    data: { url }
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(wcs => {
      const found = wcs.find(c => c.url.includes(url));
      if (found) return found.focus();
      return clients.openWindow(url);
    })
  );
});

// ← ده هو الإصلاح — يمنع الـ error
self.addEventListener('fetch', event => {
  // مش بنعمل حاجة، بس لازم الـ listener موجود
});

self.addEventListener('message', event => {
  // رد فوري على أي message عشان نمنع الـ channel error
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});