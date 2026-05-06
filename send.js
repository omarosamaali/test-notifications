const admin = require("firebase-admin");
const serviceAccount = require("./firebase-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://omdachina25-default-rtdb.firebaseio.com"
});

async function sendToAll(title, body) {
  // اقرأ كل الـ tokens من Firebase Database
  const db     = admin.database();
  const snap   = await db.ref('fcm_tokens').once('value');
  const data   = snap.val();

  if (!data) {
    console.log('⚠️ مفيش tokens محفوظة');
    return;
  }

  const tokens = Object.values(data).map(d => d.token).filter(Boolean);
  console.log(`📢 هيبعت لـ ${tokens.length} مستخدم`);

  // بعت على كل token
  const results = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body }
  });

  console.log(`✅ نجح: ${results.successCount} | ❌ فشل: ${results.failureCount}`);

  // امسح الـ tokens الفاشلة تلقائياً
  results.responses.forEach((res, i) => {
    if (!res.success) {
      const badKey = tokens[i].replace(/[.#$[\]]/g, '_');
      db.ref('fcm_tokens/' + badKey).remove();
      console.log('🗑️ تم مسح token منتهي:', tokens[i].slice(0, 20) + '...');
    }
  });

  process.exit(0);
}

sendToAll(
  'تنبيه عام من خراريف! 🎮',
  'يا مغامرين، فيه تحديث جديد نزل دلوقتي، جربوه!'
);
