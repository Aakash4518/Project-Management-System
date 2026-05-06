import { Router } from "express";
import {
  forgotPassword,
  getCurrentUser,
  login,
  signup,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  forgotPasswordValidator,
  loginValidator,
  signupValidator,
} from "../validators/authValidators.js";

const router = Router();

router.post("/signup", signupValidator, validate, signup);
router.post("/login", loginValidator, validate, login);
router.post("/forgot-password", forgotPasswordValidator, validate, forgotPassword);
router.get("/me", protect, getCurrentUser);

export default router;
