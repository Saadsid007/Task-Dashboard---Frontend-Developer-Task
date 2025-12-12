import mongoose, { Model, Schema } from "mongoose";

export interface ITask {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },
  },
  { timestamps: true }
);

export const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
