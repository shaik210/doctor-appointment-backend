import jwt from "jsonwebtoken";
import User from "../models/user.js"; 
import dotenv from "dotenv";
dotenv.config();

// Utility functions
export const createAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const createRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// Register
export const CreateUser = async (req, res) => {
  try {
    const { name, email, password, role, specialization, availableSlots } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      specialization: role === "doctor" ? specialization : undefined,
      availableSlots: role === "doctor" ? availableSlots : [],
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" }); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Refresh token
export const refreshToken = (req, res) => {
  const token = req.body.token;
  if (!token) return res.status(400).json({ message: "No token provided" });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    const newAccessToken = createAccessToken(user);
    res.json({ accessToken: newAccessToken });
  });
};
