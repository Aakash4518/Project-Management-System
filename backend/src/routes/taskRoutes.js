import { Router } from "express";
import {
  addTaskComment,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { commentValidator, taskValidator } from "../validators/taskValidators.js";

const router = Router();

router.use(protect);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", authorize("admin", "manager"), taskValidator, validate, createTask);
router.put("/:id", updateTask);
router.delete("/:id", authorize("admin", "manager"), deleteTask);
router.post("/:id/comments", commentValidator, validate, addTaskComment);

export default router;
