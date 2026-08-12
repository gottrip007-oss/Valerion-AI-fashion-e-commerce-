import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ message: "An account with this email already exists" });
  }

  const user = await User.create({ name, email, password, phone });

  res.status(201).json({
    user: user.toSafeObject(),
    token: generateToken(user._id, user.role),
  });
};

// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    user: user.toSafeObject(),
    token: generateToken(user._id, user.role),
  });
};

// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ user: req.user });
};
