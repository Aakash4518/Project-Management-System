import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";

export const getUsers = async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, data: { items: users } });
};

export const getDirectory = async (_req, res) => {
  const users = await User.find({}, "name email role title avatar isActive").sort({ name: 1 });
  res.json({ success: true, data: { items: users } });
};

export const updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);

  user.role = req.body.role;
  if (req.body.title) user.title = req.body.title;
  if (typeof req.body.isActive === "boolean") user.isActive = req.body.isActive;
  await user.save();

  res.json({ success: true, data: { user } });
};
