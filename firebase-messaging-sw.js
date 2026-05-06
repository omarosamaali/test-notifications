// firebase-messaging-sw.js
// ضع هذا الملف في المجلد الجذر (public/) من موقعك

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyBQCPTwnybdtLNUwNCzDDA23TLt3pD5zP4",
  authDomain:        "omdachina25.firebaseapp.com",
  databaseURL:       "https://omdachina25-default-rtdb.firebaseio.com",
  projectId:         "omdachina25",
  storageBucket:     "omdachina25.firebasestorage.app",
  messagingSenderId: "1031143486488",
  appId:             "1:1031143486488:web:0a662055d970826268bf6d",
  measurementId:     "G-G9TLSKJ92H"
});

const messaging = firebase.messaging();

// إشعار في الخلفية (التطبيق مغلق أو مخفي)
messaging.onBackgroundMessage(payload => {
  console.log('📩 Background Message:', payload);
  const title = payload.notification?.title || 'إشعار جديد';
  const body  = payload.notification?.body  || '';
  const icon  = payload.notification?.icon  || '/images/icon-192.png';
  const url   = payload.data?.url || '/';

  self.registration.showNotification(title, {
    body,
    icon,
    badge: '/images/icon-192.png',
    tag:   'kararif-notif',
    renotify: true,
    data: { url }
  });
});

// لما المستخدم يضغط على الإشعار
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
