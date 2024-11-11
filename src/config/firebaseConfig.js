import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH),
});

const db = admin.firestore();

export { db };