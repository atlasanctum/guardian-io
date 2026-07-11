# Firebase Cloud Messaging Setup Guide

## Overview

This guide walks through setting up Firebase Cloud Messaging (FCM) for Guardian-IO push notifications.

## Prerequisites

- Firebase account (free tier available at https://firebase.google.com)
- Node.js and npm installed
- Guardian-IO backend running

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `guardian-io-prod`
4. Accept terms and click "Create project"
5. Wait for project creation to complete

## Step 2: Enable Cloud Messaging

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Navigate to **Cloud Messaging** tab
3. Copy your **Server API Key** (you'll need this later)
4. Note the **Sender ID** (also needed for client setup)

## Step 3: Generate Service Account Credentials

1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click **Generate New Private Key**
3. A JSON file will download automatically
4. Rename it to `firebase-service-account.json`
5. Move it to your project root: `cp firebase-service-account.json /home/ubuntu/guardian-io/`

### Service Account JSON Structure

```json
{
  "type": "service_account",
  "project_id": "guardian-io-prod",
  "private_key_id": "key_id_here",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@guardian-io-prod.iam.gserviceaccount.com",
  "client_id": "1234567890",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40guardian-io-prod.iam.gserviceaccount.com"
}
```

## Step 4: Configure Environment Variables

Create `.env.production` with Firebase credentials:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=guardian-io-prod
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@guardian-io-prod.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=1234567890
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40guardian-io-prod.iam.gserviceaccount.com

# FCM Configuration
FCM_SERVER_API_KEY=your_server_api_key_here
FCM_SENDER_ID=your_sender_id_here
```

## Step 5: Initialize Firebase Admin SDK

The backend already includes Firebase Admin SDK initialization. Verify in `server/fcm-service.ts`:

```typescript
import * as admin from "firebase-admin";

async initialize(serviceAccountPath?: string) {
  if (this.initialized) return;
  
  try {
    if (!admin.apps.length) {
      if (serviceAccountPath) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else {
        admin.initializeApp();
      }
    }
    this.initialized = true;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    throw error;
  }
}
```

## Step 6: Test FCM Integration

Create a test script to verify FCM is working:

```typescript
// test-fcm.ts
import { initializeFCM, NotificationTemplates } from "./server/fcm-service";

async function testFCM() {
  const fcm = initializeFCM();
  await fcm.initialize("./firebase-service-account.json");

  // Test notification
  const payload = NotificationTemplates.achievementUnlocked("First Reporter", 10);
  
  try {
    const result = await fcm.sendNotification({
      tokens: ["test_device_token_here"],
      payload,
    });
    console.log("✅ Notification sent successfully:", result);
  } catch (error) {
    console.error("❌ Failed to send notification:", error);
  }
}

testFCM();
```

Run the test:

```bash
npx ts-node test-fcm.ts
```

## Step 7: Client-Side Setup (Expo App)

### Install Expo Notifications

```bash
cd /home/ubuntu/guardian-io
pnpm add expo-notifications
```

### Get Device Token

Create a hook to get the device token:

```typescript
// hooks/use-fcm-token.ts
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";

export function useFCMToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function getToken() {
      try {
        const { data } = await Notifications.getPermissionsAsync();
        if (data.granted) {
          const expoPushToken = await Notifications.getExpoPushTokenAsync({
            projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
          });
          setToken(expoPushToken.data);
          console.log("FCM Token:", expoPushToken.data);
        }
      } catch (error) {
        console.error("Failed to get FCM token:", error);
      }
    }

    getToken();
  }, []);

  return token;
}
```

### Request Notification Permissions

```typescript
// app/_layout.tsx
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permissions
await Notifications.requestPermissionsAsync();
```

## Step 8: Send Test Notification from Backend

Use the FCM service to send notifications:

```typescript
import { getFCM, NotificationTemplates } from "@/server/fcm-service";

const fcm = getFCM();
await fcm.initialize();

// Send to specific device
await fcm.sendNotification({
  tokens: ["device_token_from_user"],
  payload: NotificationTemplates.reportEscalated("report_123", "NGO"),
});

// Send to topic (all subscribers)
await fcm.sendToTopic("worker-updates", NotificationTemplates.weeklyDigest({
  contributions: "5",
  impact: "150",
}));
```

## Step 9: Monitor FCM Metrics

In Firebase Console:

1. Go to **Cloud Messaging** → **Metrics**
2. View delivery rates, errors, and performance
3. Check **Logs** for debugging

## Troubleshooting

### Issue: "createPermissionHook is not a function"

**Solution**: Update `expo-notifications` package:
```bash
pnpm add expo-notifications@latest
```

### Issue: Firebase credentials not found

**Solution**: Verify environment variables:
```bash
echo $FIREBASE_PROJECT_ID
echo $FIREBASE_PRIVATE_KEY
```

### Issue: Notifications not received on device

**Solution**: 
1. Verify device token is correct
2. Check notification permissions are granted
3. Verify device is connected to internet
4. Check Firebase Console logs for errors

### Issue: "Invalid service account"

**Solution**: 
1. Regenerate service account credentials
2. Ensure JSON file is properly formatted
3. Check private key has correct newlines

## Production Deployment

### Docker Environment Variables

Add to `docker-compose.yml`:

```yaml
environment:
  - FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
  - FIREBASE_PRIVATE_KEY=${FIREBASE_PRIVATE_KEY}
  - FIREBASE_CLIENT_EMAIL=${FIREBASE_CLIENT_EMAIL}
  - FCM_SERVER_API_KEY=${FCM_SERVER_API_KEY}
```

### Kubernetes Secrets

```bash
kubectl create secret generic firebase-credentials \
  --from-file=firebase-service-account.json
```

### GitHub Actions CI/CD

```yaml
- name: Deploy with Firebase
  env:
    FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
    FIREBASE_PRIVATE_KEY: ${{ secrets.FIREBASE_PRIVATE_KEY }}
    FIREBASE_CLIENT_EMAIL: ${{ secrets.FIREBASE_CLIENT_EMAIL }}
  run: npm run deploy
```

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for sensitive data
3. **Rotate service account keys** regularly
4. **Restrict API key** to specific services
5. **Enable Cloud Audit Logs** for Firebase
6. **Monitor suspicious activity** in Firebase Console
7. **Use separate projects** for dev/staging/production

## Support

For Firebase support, visit: https://firebase.google.com/support

For Guardian-IO support, contact: admin-support@guardian-io.com
