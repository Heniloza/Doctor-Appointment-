import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url:
          process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      }),
    });
    console.log(" Firebase Admin initialized successfully");
  } catch (error) {
    console.error(" Firebase Admin initialization error:", error.message);
  }
}

export const sendPushNotification = async (
  token,
  title,
  message,
  data = {},
) => {
  try {
    if (!token) {
      console.log(" No FCM token provided, skipping push notification");
      return null;
    }

    const messagePayload = {
      notification: {
        title,
        body: message,
      },
      data: {
        ...data,
        timestamp: new Date().toISOString(),
      },
      token,
    };

    const response = await admin.messaging().send(messagePayload);
    console.log(" Push notification sent successfully:", title);
    return response;
  } catch (error) {
    console.error(" Error sending push notification:", error.message);
    if (
      error.code === "messaging/invalid-registration-token" ||
      error.code === "messaging/registration-token-not-registered"
    ) {
      console.log(
        " Invalid or expired FCM token - should be removed from database",
      );
    }

    return null;
  }
};

export const sendMulticastNotification = async (
  tokens,
  title,
  message,
  data = {},
) => {
  try {
    if (!tokens || tokens.length === 0) {
      console.log("⚠️No FCM tokens provided for multicast");
      return null;
    }

    const validTokens = tokens.filter(
      (t) => t && typeof t === "string" && t.trim().length > 0,
    );

    if (validTokens.length === 0) {
      console.log(" No valid FCM tokens after filtering");
      return null;
    }

    const messagePayload = {
      notification: {
        title,
        body: message,
      },
      data: {
        ...data,
        timestamp: new Date().toISOString(),
      },
      tokens: validTokens,
    };

    const response = await admin.messaging().sendMulticast(messagePayload);

    console.log(
      `Multicast sent: ${response.successCount}/${validTokens.length} successful`,
    );

    if (response.failureCount > 0) {
      console.log(` ${response.failureCount} notifications failed`);
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(` Failed token ${idx}:`, resp.error?.message);
        }
      });
    }

    return response;
  } catch (error) {
    console.error(" Error sending multicast notification:", error.message);
    return null;
  }
};

