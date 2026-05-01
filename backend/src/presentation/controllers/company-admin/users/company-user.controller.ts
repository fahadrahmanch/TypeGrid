import { Request, Response } from "express";
import logger from "../../../../utils/logger";
import { HttpStatus } from "../../../constants/httpStatus";
import { IAddUserUseCase } from "../../../../application/use-cases/interfaces/companyAdmin/add-user.interface";
import { IFindUserUseCase } from "../../../../application/use-cases/interfaces/user/find-user.interface";
import { IGetCompanyUsersUseCase } from "../../../../application/use-cases/interfaces/companyAdmin/get-company-users.interface";
import { IDeleteCompanyUserUseCase } from "../../../../application/use-cases/interfaces/companyAdmin/delete-company-user.interface";
import { IGetCompanyUsersWithStatusUseCase } from "../../../../application/use-cases/interfaces/companyAdmin/get-company-users-with-status.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { IGetCompanyDetailsUseCase } from "../../../../application/use-cases/interfaces/companyAdmin/get-company-details.interface";
import { AuthRequest } from "../../../../types/AuthRequest";
import { CustomError } from "../../../../domain/entities/custom-error.entity";

export class CompanyUserController {
  constructor(
    private _addUserUseCase: IAddUserUseCase,
    private _findUserUseCase: IFindUserUseCase,
    private _getCompanyUsersUseCase: IGetCompanyUsersUseCase,
    private _deleteCompanyUserUseCase: IDeleteCompanyUserUseCase,
    private _getCompanyUsersWithStatusUseCase: IGetCompanyUsersWithStatusUseCase,
    private _getCompanyDetailsUseCase: IGetCompanyDetailsUseCase
  ) {}

  // get company admin info

  private async _getCompanyAdminInfo(
    req: Request
  ): Promise<{ user?: any; error?: { status: number; message: string } }> {
    const email = (req as any).user?.email;

    if (!email) {
      return {
        error: {
          status: HttpStatus.UNAUTHORIZED,
          message: MESSAGES.UNAUTHORIZED,
        },
      };
    }

    const user = await this._findUserUseCase.execute(email);
    if (!user || user.role !== "companyAdmin") {
      return {
        error: {
          status: HttpStatus.NOT_FOUND,
          message: MESSAGES.AUTH_USER_NOT_FOUND,
        },
      };
    }

    if (!user.CompanyId) {
      return {
        error: {
          status: HttpStatus.FORBIDDEN,
          message: MESSAGES.COMPANY_NOT_ASSIGNED_TO_USER,
        },
      };
    }

    return { user };
  }

  // add company user

  addUser = async (req: Request, res: Response): Promise<void> => {
    const userData = req.body;
    if (!userData.name || !userData.email || !userData.password || !userData.role) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.ALL_FIELDS_REQUIRED);
    }

    const adminInfo = await this._getCompanyAdminInfo(req);
    if (adminInfo.error) {
      throw new CustomError(adminInfo.error.status, adminInfo.error.message);
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

    logger.info(MESSAGES.USER_ADDED_SUCCESS, {
      email: newUser.email,
      companyId: newUser.CompanyId,
    });
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: MESSAGES.USER_ADDED_SUCCESS,
      data: newUser,
    });
  };
  // get company users

  getUsers = async (req: Request, res: Response): Promise<void> => {
    const adminInfo = await this._getCompanyAdminInfo(req);
    if (adminInfo.error) {
      throw new CustomError(adminInfo.error.status, adminInfo.error.message);
    }
    const adminUser = adminInfo.user;

    const search = (req.query.search as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { users, total } = await this._getCompanyUsersUseCase.execute(adminUser.CompanyId!, search, page, limit);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.COMPANY_USERS_FETCHED_SUCCESS,
      data: users,
      total,
    });
  };

  //delete company user
  deleteCompanyUser = async (req: Request, res: Response): Promise<void> => {
    const companyUserId = req.params.userId;
    if (!companyUserId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.SOMETHING_WENT_WRONG);
    }
    await this._deleteCompanyUserUseCase.execute(companyUserId);
    logger.info(MESSAGES.USER_DELETED_SUCCESS, {
      userId: companyUserId,
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.USER_DELETED_SUCCESS,
    });
  };

  getCompanyUsersWithStatus = async (req: Request, res: Response): Promise<void> => {
    const adminInfo = await this._getCompanyAdminInfo(req);
    if (adminInfo.error) {
      throw new CustomError(adminInfo.error.status, adminInfo.error.message);
    }
    const adminUser = adminInfo.user;

    const companyUsers = await this._getCompanyUsersWithStatusUseCase.execute(adminUser.CompanyId!);

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.COMPANY_USERS_FETCHED_SUCCESS,
      data: companyUsers,
    });
  };
  companyDetailswithSubcitptionDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const companyDetails = await this._getCompanyDetailsUseCase.execute(userId!);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.COMPANY_DETAILS_FETCHED_SUCCESS,
      data: companyDetails,
    });
  };
}
