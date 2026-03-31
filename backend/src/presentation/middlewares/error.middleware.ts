import { Request, Response, NextFunction } from "express";
import logger from "../../utils/logger";
import { MESSAGES } from "../../domain/constants/messages";
import { CustomError } from "../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../domain/enums/http-status-codes.enum";
import { AuthRequest } from "../../types/AuthRequest";

function narrowError(error: unknown): {
  message: string;
  status: number;
  stack?: string;
} {
  if (error instanceof CustomError) {
    return {
      message: error.message,
      status: error.statusCode,
      stack: error.stack,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      stack: error.stack,
    };
  }

  return {
    message: MESSAGES.INTERNAL_SERVER_ERROR,
    status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
  };
}

export const errorMiddleware = (
  err: any,
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
   const { message, status, stack } = narrowError(err); 

  // Log error with context
  logger.error("API Error", {
    message,
    status,
    stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user?.userId,
  });


  res.status(status).json({
    success: false,
    message,
  });
};

