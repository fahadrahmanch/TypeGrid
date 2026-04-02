import { AuthRequest } from "../../../types/AuthRequest";
import logger from "../../../utils/logger";
import { Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { IGetCompanyGroupsUseCase } from "../../../application/use-cases/interfaces/companyAdmin/get-company-groups.interface";
import { MESSAGES } from "../../../domain/constants/messages";
export class CompanyGroupController {
  constructor(
    private _createCompanyGroupUseCase: any,
    private _getCompanyGroupsUseCase: IGetCompanyGroupsUseCase,
  ) {}

  async createGroup(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new Error(MESSAGES.UNAUTHORIZED);
      }

      const groupData = req.body;

      await this._createCompanyGroupUseCase.execute(groupData, userId);

      logger.info("Company group created successfully", { userId });
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGES.GROUP_CREATED_SUCCESS,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getCompanyGroups(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new Error(MESSAGES.UNAUTHORIZED);
      }

      const groups = await this._getCompanyGroupsUseCase.execute(userId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.GROUPS_FETCHED_SUCCESS,
        groups,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
