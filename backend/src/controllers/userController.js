import { StatusCodes } from "http-status-codes";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
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

export const createUser = async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
  if (existingUser) {
    throw new AppError("Email already exists", StatusCodes.CONFLICT);
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || "user",
    title: req.body.title || "Team Member",
    isActive: req.body.isActive ?? true,
  });
  const createdUser = await User.findById(user._id);

  res.status(StatusCodes.CREATED).json({ success: true, data: { user: createdUser } });
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

export const deleteUser = async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) {
    throw new AppError("You cannot delete your own account", StatusCodes.BAD_REQUEST);
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);

  await Project.updateMany({ owner: user._id }, { $set: { owner: req.user._id } });
  await Project.updateMany({ members: user._id }, { $pull: { members: user._id } });

  const tasks = await Task.find({
    $or: [{ assignee: user._id }, { assignees: user._id }, { reporter: user._id }],
  });

  await Promise.all(
    tasks.map(async (task) => {
      task.assignees = (task.assignees || []).filter((assignee) => String(assignee) !== String(user._id));
      task.assignee = task.assignees[0] || undefined;
      if (String(task.reporter) === String(user._id)) task.reporter = req.user._id;
      await task.save();
    })
  );

  await user.deleteOne();
  res.json({ success: true, message: "User deleted successfully" });
};
