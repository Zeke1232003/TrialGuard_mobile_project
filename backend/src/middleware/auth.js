const { admin, db } = require('../config/firebaseAdmin');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Missing Authorization Bearer token' });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    try {
      await db
        .collection('users')
        .doc(decoded.uid)
        .set(
          {
            uid: decoded.uid,
            email: decoded.email || null,
            lastSeenAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
    } catch (metadataError) {
      console.error('Failed to upsert user metadata document:', metadataError);
    }

    req.user = { uid: decoded.uid, email: decoded.email || null };
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };
