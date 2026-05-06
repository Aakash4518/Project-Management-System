import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

const buildAuthResponse = (user) => ({
  token: signToken({ id: user._id, role: user.role }),
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    avatar: user.avatar,
  },
});

export const signup = async (req, res) => {
  const existing = await User.findOne({ email: req.body.email.toLowerCase() });
  if (existing) {
    throw new AppError("Email already in use", StatusCodes.CONFLICT);
  }

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Account created successfully",
    data: buildAuthResponse(user),
  });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
  }

  user.lastLoginAt = new Date();
  await user.save();

  res.json({
    success: true,
    message: "Login successful",
    data: buildAuthResponse(user),
  });
};

export const getCurrentUser = async (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        title: req.user.title,
        avatar: req.user.avatar,
      },
    },
  });
};

export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() });

  res.json({
    success: true,
    message: user
      ? "Password reset link generated. Hook this into your email provider in production."
      : "If the account exists, a reset link has been sent.",
    data: user
      ? {
          resetPreviewToken: `reset-${user._id}-${Date.now()}`,
        }
      : null,
  });
};
