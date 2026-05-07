import { body } from "express-validator";

export const taskValidator = [
  body("title").trim().isLength({ min: 3 }).withMessage("Task title is required"),
  body("project").notEmpty().withMessage("Project is required").isMongoId().withMessage("Project id is invalid"),
  body("assignees")
    .notEmpty()
    .withMessage("At least one assignee is required")
    .isArray()
    .withMessage("Assignees must be an array")
    .custom((arr) => arr.length > 0)
    .withMessage("At least one assignee is required"),
  body("assignees.*").isMongoId().withMessage("Each assignee id must be a valid user id"),
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
