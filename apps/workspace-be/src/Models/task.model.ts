import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subTaskModel = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
  },
  types: [String],
  startDay: Number,
  dueDay: Number,
  userId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  createdTime: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

const taskModel = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
  },
  types: [String],
  startDay: {
    type: Number,
    required: true,
  },
  dueDay: {
    type: Number,
    required: true,
  },
  userIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  createdTime: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  subTasks: [subTaskModel],
});

// Indexes for optimizing query performance
taskModel.index({ project: 1, status: 1 });
taskModel.index({ userIds: 1, dueDay: 1 });
taskModel.index({ project: 1, dueDay: 1 });
taskModel.index({ types: 1 });

export default mongoose.model("Task", taskModel, "Task");
