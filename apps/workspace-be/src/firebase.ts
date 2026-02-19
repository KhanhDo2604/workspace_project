import admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
import serviceAccount from "../serviceAccountKey.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
});

const bucket = getStorage().bucket() as ReturnType<
  typeof getStorage
>["bucket"] extends (...args: any[]) => infer R
  ? R
  : never;

export default bucket;
