import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/AppError.js";

export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  next(
    new AppError("Validation failed", StatusCodes.BAD_REQUEST, errors.array())
  );
};
