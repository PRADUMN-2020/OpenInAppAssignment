const SubTask = require("../models/subTaskModel"); 

// Controller for creating a sub task
const createSubTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    // console.log("request params", taskId);
    const user_id = req.userID;

    const subTask = new SubTask({ task_id: taskId, user_id });
    await subTask.save();

    res.json({ subTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller for getting all user sub tasks
const getAllUserSubTasks = async (req, res) => {
  try {
    const { taskId } = req.params;
    const user_id = req.userID;
    console.log("user id", user_id);
    console.log("request query", taskId);
    const subTasks = await SubTask.find({
      user_id,
      task_id: taskId,
      deleted_at: null,
    });

    res.json({ subTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller for updating a sub task
const updateSubTask = async (req, res) => {
  try {
    const { status } = req.body;
    const { subTaskId } = req.params;
    const user_id = req.userID;

    const subTask = await SubTask.findOneAndUpdate(
      { _id: subTaskId, user_id },
      { $set: { status } },
      { new: true }
    );

    res.json({ subTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller for deleting a sub task (soft deletion)
const deleteSubTask = async (req, res) => {
  try {
    const { subTaskId } = req.params;
    const user_id = req.userID;

    const subTask = await SubTask.findOneAndUpdate(
      { _id: subTaskId, user_id },
      { $set: { deleted_at: new Date() } },
      { new: true }
    );

    res.json({ subTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createSubTask,
  getAllUserSubTasks,
  updateSubTask,
  deleteSubTask,
};
