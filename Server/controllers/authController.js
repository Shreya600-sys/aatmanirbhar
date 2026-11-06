const User = require("../models/userModel");
const { generateToken } = require("../utils/generateToken");

// What we send back to the website about a user
const userResponse = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phoneNumber: user.phoneNumber,
  bio: user.bio,
  profileImage: user.profileImage,
  createdAt: user.createdAt,
  ...(token && { accessToken: token }),
});

// Turns database errors into friendly messages
const sendError = (res, error) => {
  if (error.code === 11000) {
    return res.status(400).json({ message: "User already exists" });
  }
  if (error.name === "ValidationError") {
    const first = Object.values(error.errors)[0];
    return res.status(400).json({ message: first.message });
  }
  console.error(error);
  res.status(500).json({ message: error.message });
};

// POST /api/v1/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: role === "provider" ? "provider" : "user",
    });

    // Log the user in straight away
    res.status(201).json(userResponse(user, generateToken(user._id)));
  } catch (error) {
    sendError(res, error);
  }
};

// POST /api/v1/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json(userResponse(user, generateToken(user._id)));
  } catch (error) {
    sendError(res, error);
  }
};

// GET /api/v1/auth/me
const getMe = async (req, res) => {
  res.json(userResponse(req.user));
};

// PUT /api/v1/auth/profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, bio, phoneNumber, password, currentPassword } = req.body;

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    if (password) {
      if (!currentPassword || !(await user.comparePassword(currentPassword))) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      user.password = password;
    }

    await user.save();
    res.json(userResponse(user));
  } catch (error) {
    sendError(res, error);
  }
};

module.exports = { registerUser, loginUser, getMe, updateUserProfile };
