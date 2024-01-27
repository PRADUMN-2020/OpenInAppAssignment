const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllUserTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");

// Middleware to authenticate JWT token
router.use(authMiddleware);

// Routes for task operations
router.post("/tasks", createTask);
router.get("/tasks", getAllUserTasks);
router.patch("/tasks/:taskId", updateTask);
router.delete("/tasks/:taskId", deleteTask);

module.exports = router;
