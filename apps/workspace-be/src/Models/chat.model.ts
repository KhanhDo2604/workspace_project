import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  message: String,
  avatar: String,
  name: String,
  createdAt: Number,
});

export default mongoose.model("Chat", chatSchema, "Chat");
