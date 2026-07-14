const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

// Configure with: firebase functions:config:set gmail.email="you@gmail.com" gmail.app_password="xxxx xxxx xxxx xxxx"
// (use a Gmail App Password, not your normal password)
const GMAIL_EMAIL = functions.config().gmail?.email;
const GMAIL_APP_PASSWORD = functions.config().gmail?.app_password;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: GMAIL_EMAIL, pass: GMAIL_APP_PASSWORD },
});

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function brandedEmail({ title, bodyHtml }) {
  return `
  <div style="font-family:Arial,sans-serif;background:#0E2529;padding:32px;">
    <div style="max-width:480px;margin:0 auto;background:#FBF8F0;border-radius:14px;overflow:hidden;">
      <div style="background:#0E2529;padding:20px 24px;">
        <span style="color:#E3C687;font-size:18px;font-weight:700;">Mehmaan <i style="color:#C79A4B;">Easy</i></span>
      </div>
      <div style="padding:24px;color:#0E2529;">
        <h2 style="margin:0 0 12px;">${title}</h2>
        ${bodyHtml}
      </div>
    </div>
  </div>`;
}

/**
 * Callable: sendOtp({ email })
 * Generates a 6-digit code, stores a SHA-256 hash of it in Firestore with a
 * 10-minute expiry, and emails the plaintext code to the user.
 */
exports.sendOtp = functions.https.onCall(async (data) => {
  const email = (data.email || "").trim().toLowerCase();
  if (!email) throw new functions.https.HttpsError("invalid-argument", "Email is required.");

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + 10 * 60 * 1000;

  await db.collection("otps").doc(email).set({
    codeHash: hashCode(code),
    expiresAt,
    attempts: 0,
  });

  await transporter.sendMail({
    from: `Mehmaan Easy <${GMAIL_EMAIL}>`,
    to: email,
    subject: "Your Mehmaan Easy verification code",
    html: brandedEmail({
      title: "Verify your email",
      bodyHtml: `
        <p>Your boarding code is:</p>
        <p style="font-size:32px;letter-spacing:8px;font-weight:700;color:#0E2529;">${code}</p>
        <p style="color:#5a5a5a;font-size:13px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
      `,
    }),
  });

  return { sent: true };
});

/**
 * Callable: verifyOtp({ email, code })
 * Validates the code against the stored hash + expiry, then flips
 * users/{uid}.verified to true for the matching account.
 */
exports.verifyOtp = functions.https.onCall(async (data) => {
  const email = (data.email || "").trim().toLowerCase();
  const code = (data.code || "").trim();
  if (!email || !code) throw new functions.https.HttpsError("invalid-argument", "Email and code are required.");

  const ref = db.collection("otps").doc(email);
  const snap = await ref.get();
  if (!snap.exists) throw new functions.https.HttpsError("not-found", "No code found — request a new one.");

  const otp = snap.data();
  if (otp.attempts >= 5) {
    throw new functions.https.HttpsError("resource-exhausted", "Too many attempts. Request a new code.");
  }
  if (Date.now() > otp.expiresAt) {
    throw new functions.https.HttpsError("deadline-exceeded", "Code expired — request a new one.");
  }
  if (hashCode(code) !== otp.codeHash) {
    await ref.update({ attempts: admin.firestore.FieldValue.increment(1) });
    throw new functions.https.HttpsError("invalid-argument", "Incorrect code.");
  }

  const usersSnap = await db.collection("users").where("email", "==", email).limit(1).get();
  if (usersSnap.empty) throw new functions.https.HttpsError("not-found", "No account found for this email.");

  await usersSnap.docs[0].ref.update({ verified: true });
  await ref.delete();

  return { verified: true };
});

/**
 * Firestore trigger: fires whenever a buyer submits the enquiry form
 * (EnquiryModal writes to enquiries/{id}). Emails the seller with the
 * buyer's details, and a confirmation email to the buyer.
 */
exports.onEnquiryCreated = functions.firestore
  .document("enquiries/{enquiryId}")
  .onCreate(async (snap) => {
    const e = snap.data();

    await transporter.sendMail({
      from: `Mehmaan Easy <${GMAIL_EMAIL}>`,
      to: e.sellerEmail,
      subject: `New enquiry: ${e.buyerName} is interested in your listing`,
      html: brandedEmail({
        title: "You've got a new enquiry",
        bodyHtml: `
          <p><strong>${e.buyerName}</strong> sent an enquiry about your property.</p>
          <p>Email: ${e.buyerEmail}<br/>Phone: ${e.buyerPhone}</p>
          <p style="background:#EAE2CC;padding:12px;border-radius:8px;">${e.message}</p>
          <p><a href="${e.propertyLink}" style="color:#9C7A34;">View the listing</a></p>
        `,
      }),
    });

    await transporter.sendMail({
      from: `Mehmaan Easy <${GMAIL_EMAIL}>`,
      to: e.buyerEmail,
      subject: "We've sent your enquiry to the seller",
      html: brandedEmail({
        title: "Enquiry confirmed",
        bodyHtml: `
          <p>Hi ${e.buyerName}, your enquiry has been sent to the seller. They'll be in touch with you directly at ${e.buyerEmail} or ${e.buyerPhone}.</p>
          <p><a href="${e.propertyLink}" style="color:#9C7A34;">View the listing again</a></p>
        `,
      }),
    });
  });
