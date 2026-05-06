import { body } from "express-validator";

export const taskValidator = [
  body("title").trim().isLength({ min: 3 }).withMessage("Task title is required"),
  body("project").notEmpty().withMessage("Project is required"),
  body("assignee").notEmpty().withMessage("Assignee is required"),
  body("status")
    .optional()
    .isIn(["backlog", "todo", "in-progress", "review", "done"])
    .withMessage("Invalid task status"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Invalid task priority"),
];

export const commentValidator = [
  body("message").trim().isLength({ min: 1 }).withMessage("Comment is required"),
];
