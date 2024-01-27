const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

// Controller for updating user priority
const updateUserPriority = async (req, res) => {
  try {
    const { priority } = req.body;
    const user_id = req.userID;
    const user = await User.findOneAndUpdate(
      { _id: user_id },
      { $set: { priority } },
      { new: true }
    );
    // console.log(user_id);
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Controller for registering a new user
const registerUser = async (req, res) => {
  try {
    const { phone_number, priority } = req.body;
    let userData = await User.findOne({ phone_number });

    if (userData) {
      return res
        .status(400)
        .json({ error: "User already exists use ur provided token to login" });
    }

    const user = new User({ phone_number, priority });

    await user.save();
    console.log("saved in db");
    const token = jwt.sign({ userID: user._id }, jwtSecret, {
      expiresIn: "4h",
    });
    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller for getting all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerUser, getAllUsers, updateUserPriority };
