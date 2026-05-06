const express = require('express');
const admin   = require('firebase-admin');
const path    = require('path');
const serviceAccount = require('./firebase-credentials.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));   // يخدم الـ HTML files

// ── اشتراك token في topic 'all' ──────────────────────────────
app.post('/subscribe', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'token مطلوب' });
  try {
    await admin.messaging().subscribeToTopic(token, 'all');
    console.log('✅ تم الاشتراك:', token.slice(0, 20) + '...');
    res.json({ success: true });
  } catch (e) {
    console.error('❌ خطأ:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── إرسال إشعار للكل ─────────────────────────────────────────
app.post('/send-all', async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title و body مطلوبين' });
  try {
    const result = await admin.messaging().send({
      notification: { title, body },
      topic: 'all'
    });
    console.log('📢 تم الإرسال للكل:', result);
    res.json({ success: true, result });
  } catch (e) {
    console.error('❌ خطأ في الإرسال:', e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 السيرفر شغال على http://localhost:${PORT}`);
  console.log(`📄 افتح index.html على http://localhost:${PORT}/index.html`);
});
