const Task = require("../models/taskModel");
const SubTask = require("../models/subTaskModel");

// Function to calculate task priority based on due date
function calculatePriority(dueDate) {
  const today = new Date();
  const dueDateObj = new Date(dueDate);

  let priority = 3; // Default priority

  const timeDifference = Math.max(dueDateObj.getTime() - today.getTime(), 0);
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

  if (daysDifference === 0) {
    priority = 0; // Due date is today
  } else if (daysDifference >= 1 && daysDifference <= 2) {
    priority = 1; // Due date is between tomorrow and day after tomorrow
  } else if (daysDifference >= 3 && daysDifference <= 4) {
    priority = 2; // 3-4 days until due date
  } else if (daysDifference >= 5) {
    priority = 3; // 5 or more days until due date
  }

  return priority;
}

// Controller for creating a task
const createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    const user_id = req.userID;
    const priority = calculatePriority(due_date);
    // Create and save task with calculated priority
    const task = new Task({ title, description, due_date, user_id, priority });
    await task.save();

    res.json({ task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller for getting all user tasks
const getAllUserTasks = async (req, res) => {
  try {
    const { priority, due_date, page, limit } = req.body;
    const user_id = req.userID;
    const tasks = await Task.find({
      user_id,
      priority,
      due_date,
      deleted_at: null,
    })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller for updating a task
const updateTask = async (req, res) => {
  try {
    const { due_date, status } = req.body;
    const { taskId } = req.params;
    const user_id = req.userID;
    if (due_date) {
      const priority = calculatePriority(due_date);
      const task = await Task.findOneAndUpdate(
        { _id: taskId, user_id },
        { $set: { due_date, status, priority } },
        { new: true }
      );
      res.json({ task });
    } else {
      const task = await Task.findOneAndUpdate(
        { _id: taskId, user_id },
        { $set: { status } },
        { new: true }
      );
      res.json({ task });
    }

    if (status === "DONE") {
      await SubTask.updateMany({ task_id: taskId }, { $set: { status: 1 } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller for deleting a task (soft deletion)
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const user_id = req.userID;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user_id },
      { $set: { deleted_at: new Date() } },
      { new: true }
    );

    // Update the deleted_at field of corresponding subtasks
    await SubTask.updateMany(
      { task_id: taskId },
      { $set: { deleted_at: new Date() } }
    );

    res.json({ task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createTask, getAllUserTasks, updateTask, deleteTask };
