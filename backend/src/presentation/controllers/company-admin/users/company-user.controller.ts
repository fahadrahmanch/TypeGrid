import { Request, Response, NextFunction } from "express";
import logger from "../../../../utils/logger";
import { HttpStatus } from "../../../constants/httpStatus";
import { IAddUserUseCase } from "../../../../application/use-cases/interfaces/companyAdmin/add-user.interface";
import { IFindUserUseCase } from "../../../../application/use-cases/interfaces/user/find-user.interface";
import { IGetCompanyUsersUseCase } from "../../../../application/use-cases/interfaces/companyAdmin/get-company-users.interface";
import { IDeleteCompanyUserUseCase } from "../../../../application/use-cases/interfaces/companyAdmin/delete-company-user.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";

export class CompanyUserController {
  constructor(
    private _addUserUseCase: IAddUserUseCase,
    private _findUserUseCase: IFindUserUseCase,
    private _getCompanyUsersUseCase: IGetCompanyUsersUseCase,
    private _deleteCompanyUserUseCase: IDeleteCompanyUserUseCase,
  ) {}


  // get company admin info

  private async _getCompanyAdminInfo(req: Request): Promise<{ user?: any; error?: { status: number; message: string } }> {
    const userRole = (req as any).user?.role;
    const email = (req as any).user?.email;

    if (!email) {
      return { error: { status: HttpStatus.UNAUTHORIZED, message: MESSAGES.UNAUTHORIZED } };
    }

    const user = await this._findUserUseCase.execute(email);
    if (!user || user.role !== "companyAdmin") {
      return { error: { status: HttpStatus.NOT_FOUND, message: MESSAGES.AUTH_USER_NOT_FOUND } };
    }

    if (!user.CompanyId) {
      return { error: { status: HttpStatus.FORBIDDEN, message: MESSAGES.COMPANY_NOT_ASSIGNED_TO_USER } };
    }

    return { user };
  }

  // add company user

  async addUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = req.body;
      if (
        !userData.name ||
        !userData.email ||
        !userData.password ||
        !userData.role
      ) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ALL_FIELDS_REQUIRED,
        });
        return;
      }

      const adminInfo = await this._getCompanyAdminInfo(req);
      if (adminInfo.error) {
        res.status(adminInfo.error.status).json({
          success: false,
          message: adminInfo.error.message,
        });
        return;
      }
      const adminUser = adminInfo.user;
      userData.CompanyId = adminUser.CompanyId;

      const data = await this._addUserUseCase.addUser(userData);
      const newUser = {
        name: data.name,
        email: data.email,
        CompanyId: data.CompanyId,
        role: data.role || "companyUser",
        KeyBoardLayout: "QWERTY",
        status: "active",
      };

      logger.info("Company user added successfully", { email: newUser.email, companyId: newUser.CompanyId });
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGES.USER_ADDED_SUCCESS,
        data: newUser,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
// get company users

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminInfo = await this._getCompanyAdminInfo(req);
      if (adminInfo.error) {
        res.status(adminInfo.error.status).json({
          success: false,
          message: adminInfo.error.message,
        });
        return;
      }
      const adminUser = adminInfo.user;

      const companyUsers = await this._getCompanyUsersUseCase.execute(
        adminUser.CompanyId!,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.COMPANY_USERS_FETCHED_SUCCESS,
        data: companyUsers,
      });
    } catch (error: unknown) {
      next(error);
    }
  }


  //delete company user
  async deleteCompanyUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyUserId = req.params.userId;
      if (!companyUserId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.SOMETHING_WENT_WRONG,
        });
        return;
      }
      await this._deleteCompanyUserUseCase.execute(companyUserId);
      logger.info("Company user deleted successfully", { userId: companyUserId });
      res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.USER_DELETED_SUCCESS,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
