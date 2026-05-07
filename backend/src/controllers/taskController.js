import { StatusCodes } from "http-status-codes";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { createActivity } from "../services/activityService.js";
import { AppError } from "../utils/AppError.js";
import { emitToUser } from "../socket/index.js";

const canManageTask = (user) => ["admin", "manager"].includes(user.role);

const canAccessTask = (task, user) =>
  canManageTask(user) ||
  task.assignees.some((assignee) => assignee.equals(user._id)) ||
  task.reporter.equals(user._id);

const ensureProjectAccess = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) throw new AppError("Project not found", StatusCodes.NOT_FOUND);
  if (
    user.role === "user" &&
    !project.members.some((member) => member.equals(user._id))
  ) {
    throw new AppError("Permission denied", StatusCodes.FORBIDDEN);
  }
  return project;
};

const validateAssigneesMembership = (project, assignees, userRole) => {
  const assigneeIds = Array.isArray(assignees) ? assignees : [assignees];
  assigneeIds.forEach((assigneeId) => {
    const assigneeIdStr = typeof assigneeId === "string" ? assigneeId : assigneeId?._id || assigneeId;
    const isProjectMember = project.members.some((member) => member.equals(assigneeIdStr));
    const isProjectOwner = project.owner.equals(assigneeIdStr);
    if (!isProjectMember && !isProjectOwner) {
      throw new AppError(
        "Assignee must be a member of the selected project",
        StatusCodes.BAD_REQUEST
      );
    }
  });
};

export const getTasks = async (req, res) => {
  const filter = {};
  if (req.query.project) filter.project = req.query.project;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.user.role === "user") filter.assignees = req.user._id;

  const tasks = await Task.find(filter)
    .populate("project", "name status")
    .populate("assignees reporter", "name email avatar role")
    .sort({ dueDate: 1, updatedAt: -1 });

  res.json({ success: true, data: { items: tasks } });
};

export const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("project", "name status priority dueDate")
    .populate("assignee reporter", "name email avatar role title")
    .populate("comments.author", "name email avatar role");

  if (!task) throw new AppError("Task not found", StatusCodes.NOT_FOUND);
  if (!canAccessTask(task, req.user)) {
    throw new AppError("Permission denied", StatusCodes.FORBIDDEN);
  }

  res.json({ success: true, data: { task } });
};

export const createTask = async (req, res) => {
  const project = await ensureProjectAccess(req.body.project, req.user);
  validateAssigneesMembership(project, req.body.assignees, req.user.role);
  const { _id, ...payload } = req.body;

  const task = await Task.create({
    ...payload,
    reporter: req.user._id,
    activity: [{ actor: req.user._id, action: "Task created" }],
  });
  const populatedTask = await Task.findById(task._id)
    .populate("project", "name status")
    .populate("assignees reporter", "name email avatar role");

  await createActivity({
    actor: req.user._id,
    entityType: "task",
    entityId: task._id,
    action: "task_created",
    message: `${req.user.name} created task ${task.title}`,
  });

  for (const assigneeId of task.assignees) {
    emitToUser(String(assigneeId), "task:assigned", {
      title: "New task assigned",
      taskId: task._id,
      taskTitle: task.title,
    });
  }

  res.status(StatusCodes.CREATED).json({ success: true, data: { task: populatedTask } });
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new AppError("Task not found", StatusCodes.NOT_FOUND);

  const isAssignee = task.assignees.some((assignee) => assignee.equals(req.user._id));
  if (!canManageTask(req.user) && !isAssignee) {
    throw new AppError("Permission denied", StatusCodes.FORBIDDEN);
  }

  const project = await Project.findById(req.body.project || task.project);
  if (!project) throw new AppError("Project not found", StatusCodes.NOT_FOUND);
  if (req.body.assignees) validateAssigneesMembership(project, req.body.assignees, req.user.role);

  if (!canManageTask(req.user)) {
    const allowedFields = ["status", "comments"];
    Object.keys(req.body).forEach((key) => {
      if (!allowedFields.includes(key)) delete req.body[key];
    });
  }

  const { _id, reporter, ...payload } = req.body;
  Object.assign(task, payload);
  if (req.body.status === "done") task.completedAt = new Date();
  task.activity.push({ actor: req.user._id, action: `Updated task to ${task.status}` });
  await task.save();
  const populatedTask = await Task.findById(task._id)
    .populate("project", "name status")
    .populate("assignee reporter", "name email avatar role");

  await createActivity({
    actor: req.user._id,
    entityType: "task",
    entityId: task._id,
    action: "task_updated",
    message: `${req.user.name} updated task ${task.title}`,
  });

  res.json({ success: true, data: { task: populatedTask } });
};

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new AppError("Task not found", StatusCodes.NOT_FOUND);
  if (!canManageTask(req.user)) {
    throw new AppError("Only admins and managers can delete tasks", StatusCodes.FORBIDDEN);
  }

  await task.deleteOne();
  res.json({ success: true, message: "Task deleted successfully" });
};

export const addTaskComment = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new AppError("Task not found", StatusCodes.NOT_FOUND);

  const isAssignee = task.assignee.equals(req.user._id);
  if (!canManageTask(req.user) && !isAssignee) {
    throw new AppError("Permission denied", StatusCodes.FORBIDDEN);
  }

  task.comments.push({ author: req.user._id, message: req.body.message });
  task.activity.push({ actor: req.user._id, action: "Added a comment" });
  await task.save();
  const populatedTask = await Task.findById(task._id)
    .populate("project", "name status")
    .populate("assignee reporter", "name email avatar role");

  res.status(StatusCodes.CREATED).json({ success: true, data: { task: populatedTask } });
};
