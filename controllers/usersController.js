const User = require("../models/User");
const Note = require("../models/Notes");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// Get all Users
// GET /users
//access Private

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users) {
    return res.status(400).json({ message: "No users Found" });
  }
  res.json(users);
});
// Create new Users
// Post /users
//access Private

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // confirm data
  if (!username || !password || Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  // Hash password

  const hashedPwd = await bcrypt(password, 10);

  const userObject = { username, password: hashedPwd, roles };

  // create and store new user

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data recieved" });
  }
});

// Update a User
// Patch /users
//access Private

const updateUser = asyncHandler(async (req, res) => {});
// Delete a User
// Patch /users
//access Private

const deleteUser = asyncHandler(async (req, res) => {});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
