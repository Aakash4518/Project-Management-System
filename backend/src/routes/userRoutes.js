import { Router } from "express";
import { body } from "express-validator";
import { createUser, deleteUser, getDirectory, getUsers, updateUserRole } from "../controllers/userController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(protect);
router.get("/directory", getDirectory);
router.use(authorize("admin"));
router.get("/", getUsers);
router.post(
  "/",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("role").optional().isIn(["admin", "manager", "user"]).withMessage("Invalid role"),
    body("title").optional().trim(),
    body("isActive").optional().isBoolean().withMessage("Status must be active or inactive"),
  ],
  validate,
  createUser
);
router.patch(
  "/:id",
  body("role").isIn(["admin", "manager", "user"]).withMessage("Invalid role"),
  validate,
  updateUserRole
);
router.delete("/:id", deleteUser);

export default router;
