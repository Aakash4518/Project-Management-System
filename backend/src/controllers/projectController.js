import { StatusCodes } from "http-status-codes";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { createActivity } from "../services/activityService.js";
import { getPagination } from "../utils/pagination.js";
import { AppError } from "../utils/AppError.js";

const canAccessProject = (project, user) =>
  user.role === "admin" ||
  user.role === "manager" ||
  project.owner.equals(user._id) ||
  project.members.some((member) => member.equals(user._id));

const projectTaskFilter = (projectId) => ({ project: projectId });

const attachProjectMetrics = async (projectDoc) => {
  const tasks = await Task.find(projectTaskFilter(projectDoc._id))
    .populate("assignee assignees reporter", "name email role avatar")
    .sort({ dueDate: 1, updatedAt: -1 });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    ...projectDoc.toObject(),
    progress,
    taskSummary: {
      total: totalTasks,
      completed: completedTasks,
      pending: totalTasks - completedTasks,
      overdue: tasks.filter((task) => task.dueDate && task.dueDate < new Date() && task.status !== "done").length,
    },
    tasks,
  };
};

export const getProjects = async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) filter.name = { $regex: req.query.search, $options: "i" };
  if (req.user.role === "user") filter.members = req.user._id;

  const [items, total] = await Promise.all([
    Project.find(filter)
      .populate("owner members", "name email role avatar")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit),
    Project.countDocuments(filter),
  ]);

  const enrichedItems = await Promise.all(items.map((project) => attachProjectMetrics(project)));

  res.json({
    success: true,
    data: {
      items: enrichedItems,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    },
  });
};

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "owner members",
    "name email role avatar title"
  );

  if (!project) throw new AppError("Project not found", StatusCodes.NOT_FOUND);
  if (!canAccessProject(project, req.user)) {
    throw new AppError("Permission denied", StatusCodes.FORBIDDEN);
  }

  const enrichedProject = await attachProjectMetrics(project);
  res.json({ success: true, data: { project: enrichedProject } });
};

export const createProject = async (req, res) => {
  const { _id, ...payload } = req.body;
  const project = await Project.create({
    ...payload,
    owner: req.user._id,
  });
  const populatedProject = await Project.findById(project._id).populate(
    "owner members",
    "name email role avatar"
  );
  const enrichedProject = await attachProjectMetrics(populatedProject);

  await createActivity({
    actor: req.user._id,
    entityType: "project",
    entityId: project._id,
    action: "project_created",
    message: `${req.user.name} created project ${project.name}`,
  });

  res.status(StatusCodes.CREATED).json({ success: true, data: { project: enrichedProject } });
};

export const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError("Project not found", StatusCodes.NOT_FOUND);
  if (!canAccessProject(project, req.user)) {
    throw new AppError("Permission denied", StatusCodes.FORBIDDEN);
  }

  const { _id, owner, ...payload } = req.body;
  Object.assign(project, payload);
  await project.save();
  const populatedProject = await Project.findById(project._id).populate(
    "owner members",
    "name email role avatar"
  );
  const enrichedProject = await attachProjectMetrics(populatedProject);

  await createActivity({
    actor: req.user._id,
    entityType: "project",
    entityId: project._id,
    action: "project_updated",
    message: `${req.user.name} updated project ${project.name}`,
  });

  res.json({ success: true, data: { project: enrichedProject } });
};

export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError("Project not found", StatusCodes.NOT_FOUND);
  if (!["admin", "manager"].includes(req.user.role) && !project.owner.equals(req.user._id)) {
    throw new AppError("Permission denied", StatusCodes.FORBIDDEN);
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();
  res.json({ success: true, message: "Project deleted successfully" });
};
