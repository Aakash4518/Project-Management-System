import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

export const protect = async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return next(new AppError("Authentication required", StatusCodes.UNAUTHORIZED));
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id);

  if (!user || !user.isActive) {
    return next(new AppError("User is not authorized", StatusCodes.UNAUTHORIZED));
  }

  req.user = user;
  next();
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission", StatusCodes.FORBIDDEN));
  }
  next();
};
