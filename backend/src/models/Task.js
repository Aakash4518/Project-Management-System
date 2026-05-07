import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const attachmentSchema = new mongoose.Schema(
  {
    filename: String,
    url: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["backlog", "todo", "in-progress", "review", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    dueDate: Date,
    completedAt: Date,
    comments: [commentSchema],
    attachments: [attachmentSchema],
    activity: [
      {
        actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        action: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

taskSchema.pre("validate", function syncAssigneeFields(next) {
  if ((!this.assignees || this.assignees.length === 0) && this.assignee) {
    this.assignees = [this.assignee];
  }

  if (this.assignees?.length) {
    this.assignee = this.assignees[0];
  }

  next();
});

export const Task = mongoose.model("Task", taskSchema);
