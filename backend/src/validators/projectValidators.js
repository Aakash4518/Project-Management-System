import { body } from "express-validator";

export const projectValidator = [
  body("name").trim().isLength({ min: 3 }).withMessage("Project name is required"),
  body("status")
    .optional()
    .isIn(["planning", "active", "on-hold", "completed"])
    .withMessage("Invalid project status"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Invalid project priority"),
  body("members")
    .optional()
    .customSanitizer((value) => (typeof value === "string" ? [value] : value))
    .isArray()
    .withMessage("Members must be an array"),
  body("members.*")
    .optional()
    .isMongoId()
    .withMessage("Each member id must be a valid user id"),
];
