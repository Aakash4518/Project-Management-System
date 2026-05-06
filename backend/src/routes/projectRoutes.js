import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { projectValidator } from "../validators/projectValidators.js";

const router = Router();

router.use(protect);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", authorize("admin", "manager"), projectValidator, validate, createProject);
router.put("/:id", authorize("admin", "manager"), projectValidator, validate, updateProject);
router.delete("/:id", authorize("admin", "manager"), deleteProject);

export default router;
