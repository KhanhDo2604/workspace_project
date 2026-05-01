import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
// import serviceAccount from "../serviceAccountKey.json" with { type: "json" };

const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")!,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
});

const bucket = getStorage().bucket() as ReturnType<
  typeof getStorage
>["bucket"] extends (...args: any[]) => infer R
  ? R
  : never;

export default bucket;
