import "dotenv/config";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";

const seed = async () => {
  await connectDb();
  await Promise.all([User.deleteMany({}), Project.deleteMany({}), Task.deleteMany({})]);

  const [admin, manager, user] = await User.create([
    {
      name: "Ariana Blake",
      email: "admin@taskflow.pro",
      password: "Password123!",
      role: "admin",
      title: "Operations Director",
    },
    {
      name: "Marcus Lee",
      email: "manager@taskflow.pro",
      password: "Password123!",
      role: "manager",
      title: "Delivery Manager",
    },
    {
      name: "Nina Patel",
      email: "user@taskflow.pro",
      password: "Password123!",
      role: "user",
      title: "Product Designer",
    },
  ]);

  const project = await Project.create({
    name: "Apollo Workspace",
    description: "Rebuild the customer-facing operations dashboard.",
    status: "active",
    priority: "high",
    startDate: new Date(),
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    progress: 62,
    owner: manager._id,
    members: [manager._id, user._id],
    tags: ["design", "dashboard", "ops"],
  });

  await Task.create([
    {
      title: "Ship dashboard hero analytics",
      description: "Design and implement top-level KPI cards.",
      project: project._id,
      assignee: user._id,
      assignees: [user._id],
      reporter: manager._id,
      status: "in-progress",
      priority: "high",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    },
    {
      title: "Finalize QA checklist",
      description: "Prepare launch readiness checklist.",
      project: project._id,
      assignee: manager._id,
      assignees: [manager._id],
      reporter: admin._id,
      status: "review",
      priority: "medium",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    },
  ]);

  console.log("Seeded successfully");
  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
