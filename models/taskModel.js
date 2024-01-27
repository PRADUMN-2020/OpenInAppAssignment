const mongoose = require("mongoose");

// Task schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  due_date: { type: Date, required: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  priority: { type: Number, required: true },
  status: {
    type: String,
    enum: ["TODO", "IN_PROGRESS", "DONE"],
    default: "TODO",
  },
  deleted_at: { type: Date },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
