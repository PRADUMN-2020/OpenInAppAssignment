const express = require("express");
const router = express.Router();
const {
  createSubTask,
  getAllUserSubTasks,
  updateSubTask,
  deleteSubTask,
} = require("../controllers/subTaskController");
const authMiddleware = require("../middlewares/authMiddleware");

// Middleware to authenticate JWT token
router.use(authMiddleware);

// Routes for subtask operations
router.post("/tasks/:taskId/subtasks", createSubTask);
router.get("/tasks/:taskId/subtasks", getAllUserSubTasks);
router.patch("/subtasks/:subTaskId", updateSubTask);
router.delete("/subtasks/:subTaskId", deleteSubTask);

module.exports = router;
