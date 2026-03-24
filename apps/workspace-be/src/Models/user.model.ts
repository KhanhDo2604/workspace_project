import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  avatar: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  keycloakId: { type: String, required: true, unique: true },
  personalSetting: { type: mongoose.Schema.Types.ObjectId, ref: "Setting" },
});

export default mongoose.model("User", userSchema, "User");
