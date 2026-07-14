import admin from "firebase-admin";
import path from "path";


if (!admin.apps.length) {
  // If the developer placed sa.json or set FIREBASE_SERVICE_ACCOUNT_JSON, we use it.
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "./sa.json";
  try {
    const fs = require("fs");
    const resolvedPath = path.resolve(process.cwd(), serviceAccountPath);
    if (fs.existsSync(resolvedPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      admin.initializeApp();
    }
  } catch (e) {
    console.error("Firebase admin init failed: ", e.message);
    admin.initializeApp();
  }

}

export const adminAuth = admin.auth();
export default admin;
