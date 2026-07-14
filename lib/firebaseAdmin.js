import admin from "firebase-admin";
import path from "path";


if (!admin.apps.length) {
  try {
    // 1. Check if credential details are in environment variables
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    } else {
      // 2. Fallback to reading sa.json from local file
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "./sa.json";
      const fs = require("fs");
      const path = require("path");
      const resolvedPath = path.resolve(process.cwd(), serviceAccountPath);
      
      if (fs.existsSync(resolvedPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else {
        // 3. Fallback to default credentials
        admin.initializeApp();
      }
    }
  } catch (e) {
    console.error("Firebase admin init failed: ", e.message);
    try {
      admin.initializeApp();
    } catch (_) {}
  }
}


export const adminAuth = admin.auth();
export default admin;
