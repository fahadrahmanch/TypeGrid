import { Request, Response, NextFunction } from "express";
import { Company } from "../../infrastructure/db/models/company/company.schema";
import { HttpStatus } from "../constants/httpStatus";
import logger from "../../utils/logger";

export const checkCompanyStatusMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const companyId = user?.companyId;

    if (!companyId) {
      return next();
    }

    const company = await Company.findById(companyId);

    if (company && company.status === "expired") {
      logger.warn("Company access denied: Company is expired", {
        companyId,
        userId: user?.userId,
        path: req.path,
      });

      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "COMPANY_EXPIRED",
      });
    }

    next();
  } catch (error) {
    logger.error("Error in checkCompanyStatusMiddleware:", error);
    next(error);
  }
};
