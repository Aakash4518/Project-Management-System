import dayjs from "dayjs";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { User } from "../models/User.js";

export const getDashboard = async (req, res) => {
  const scope = req.user.role === "user" ? { assignee: req.user._id } : {};
  const projectScope =
    req.user.role === "user" ? { members: req.user._id } : {};

  const [projects, tasks, overdueTasks, recentActivity, users] = await Promise.all([
    Project.countDocuments(projectScope),
    Task.find(scope).populate("project assignee reporter", "name email").sort({ createdAt: -1 }),
    Task.countDocuments({
      ...scope,
      dueDate: { $lt: new Date() },
      status: { $ne: "done" },
    }),
    ActivityLog.find()
      .populate("actor", "name role")
      .sort({ createdAt: -1 })
      .limit(10),
    User.countDocuments(),
  ]);

  const completed = tasks.filter((task) => task.status === "done").length;
  const pending = tasks.filter((task) => task.status !== "done").length;

  const statusMap = ["backlog", "todo", "in-progress", "review", "done"].map((status) => ({
    status,
    value: tasks.filter((task) => task.status === status).length,
  }));

  const dueSoon = tasks
    .filter((task) => task.dueDate && dayjs(task.dueDate).isAfter(dayjs().subtract(1, "day")))
    .slice(0, 5);

  res.json({
    success: true,
    data: {
      analytics: {
        projects,
        tasks: tasks.length,
        pending,
        overdue: overdueTasks,
        completionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
        teamMembers: users,
      },
      taskStatusData: statusMap,
      dueSoon,
      activity: recentActivity,
      recentTasks: tasks.slice(0, 8),
    },
  });
};
