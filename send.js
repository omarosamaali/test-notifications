const admin = require("firebase-admin");
const serviceAccount = require("./firebase-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const message = {
  notification: {
    title: 'تنبيه عام من خراريف! 🎮',
    body: 'يا مغامرين، فيه تحديث جديد نزل دلوقتي، جربوه!'
  },
  topic: 'all' // هنا بنبعت لكل المشتركين في قناة all
};

admin.messaging().send(message)
  .then((response) => {
    console.log('✅ تم إرسال الإشعار للجميع بنجاح:', response);
  })
  .catch((error) => {
    console.log('❌ خطأ في الإرسال الجماعي:', error);
  });