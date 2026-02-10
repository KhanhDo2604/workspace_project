import mongoose from "mongoose";

const Schema = mongoose.Schema;

const meetingSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  title: { type: String, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  host: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Meeting", meetingSchema, "Meeting");
