import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  theme: { type: String, default: "light" },
  language: { type: String, default: "en" },
  notifications: { type: Boolean, default: true },
});

export default mongoose.model("Setting", settingSchema, "Setting");
