import mongoose from "mongoose";

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  projectName: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  color: { type: String, default: "" },
});

export default mongoose.model("Project", projectSchema, "Project");
