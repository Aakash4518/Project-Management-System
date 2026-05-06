import { Router } from "express";
import { body } from "express-validator";
import { getDirectory, getUsers, updateUserRole } from "../controllers/userController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(protect);
router.get("/directory", getDirectory);
router.use(authorize("admin"));
router.get("/", getUsers);
router.patch(
  "/:id",
  body("role").isIn(["admin", "manager", "user"]).withMessage("Invalid role"),
  validate,
  updateUserRole
);

export default router;
