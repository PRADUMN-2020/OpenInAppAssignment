require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const twilio = require("twilio");
const taskRoutes = require("./routes/taskRoutes");
const subTaskRoutes = require("./routes/subTaskRoutes");
const userRoutes = require("./routes/userRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.json());

// Middleware to authenticate JWT token
app.use("/api", authMiddleware);

// Routes for user, task, and subtask operations
app.use("/api", userRoutes);
app.use("/api", taskRoutes);
app.use("/api", subTaskRoutes);

const Task = require("./models/taskModel");
const User = require("./models/userModel");

// Schedule a task to change task priority based on due_date every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const tasks = await Task.find({ deleted_at: null });

    tasks.forEach(async (task) => {
      const currentDate = new Date();
      const dueDate = new Date(task.due_date);

      // Logic for updating task priority based on due date
      if (dueDate.toDateString() === currentDate.toDateString()) {
        task.priority = 0;
      } else {
        const daysDifference = Math.ceil(
          (dueDate - currentDate) / (1000 * 60 * 60 * 24)
        );

        if (daysDifference === 1 || daysDifference === 2) {
          task.priority = 1;
        } else if (daysDifference >= 3 && daysDifference <= 4) {
          task.priority = 2;
        } else {
          task.priority = 3;
        }
      }

      await task.save();
    });
  } catch (error) {
    console.error("Error updating task priorities:", error);
  }
});

// Schedule a task for voice calling using Twilio every day at 10 AM

cron.schedule("00 10 * * *", async () => {
  try {
    const users = await User.find().sort({ priority: 1 });

    for (const user of users) {
      const overdueTasks = await Task.find({
        user_id: user._id,
        due_date: { $lt: new Date() },
        status: "TODO",
        deleted_at: null,
      });

      if (overdueTasks.length > 0) {
        // Implement logic for Twilio voice calling here
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

        const client = new twilio(accountSid, authToken);

        const phoneNumber = user.phone_number;

        const call = await client.calls.create({
          url: "http://demo.twilio.com/docs/voice.xml",
          to: phoneNumber,
          from: twilioPhoneNumber,
        });

        console.log(`Voice call initiated for user ${user._id}: ${call.sid}`);
        break; // Break after initiating the call for the user with the highest priority
      }
    }
  } catch (error) {
    console.error("Error initiating voice calls:", error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
