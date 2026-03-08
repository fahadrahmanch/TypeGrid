import { Request, Response, NextFunction } from "express";
import logger from "../../utils/logger";
import { MESSAGES } from "../../domain/constants/messages";
import { CustomError } from "../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../domain/enums/http-status-codes.enum";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Determine status code
  const status =
    err instanceof CustomError
      ? err.statusCode
      : err.status || HttpStatusCodes.INTERNAL_SERVER_ERROR;

  // Log error with context
  logger.error("API Error", {
    message: err.message,
    status,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    user: (req as any).user?.userId,
  });

  const message = err.message || MESSAGES.INTERNAL_SERVER_ERROR;

  res.status(status).json({
    success: false,
    message,
  });
};

