import express, { Request, Response, NextFunction } from "express";
import { Routes } from "./main.route";
import { injectUserManageController } from "../DI/admin.di";
import { injectCompanyManageController } from "../DI/admin.di";
import { checkRoleBasedMiddleware } from "../middlewares/check-role-based.middleware";
import { injectLessonManageController } from "../DI/admin.di";

export class adminRouter {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    //user management routes
    this.router.get(
      Routes.ADMIN.GET_USERS,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectUserManageController.getUsers(req, res, next);
      },
    );
    this.router.patch(
      Routes.ADMIN.UPDATE_USER_STATUS,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectUserManageController.updateUserStatus(req, res, next);
      },
    );

    //company management routes
    this.router.get(
      Routes.ADMIN.GET_COMPANYS,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyManageController.getCompanys(req, res, next);
      },
    );

    this.router.patch(
      "/companies/:companyId/status",
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyManageController.updateCompanyRequestStatus(req, res, next);
      },
    );

    //lesson management routes
    this.router.post(
      Routes.ADMIN.CREATE_LESSON,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectLessonManageController.createLesson(req, res, next);
      },
    );
    this.router.get(
      Routes.ADMIN.FETCH_LESSONS,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectLessonManageController.getLessons(req, res, next);
      },
    );
    this.router.get(
      Routes.ADMIN.FETCH_LESSON,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectLessonManageController.fetchLesson(req, res, next);
      },
    );
    this.router.put(
      Routes.ADMIN.UPDATE_LESSON,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectLessonManageController.updateLesson(req, res, next);
      },
    );

    this.router.delete(
      Routes.ADMIN.DELETE_LESSON,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectLessonManageController.deleteLesson(req, res, next);
      },
    );
  }
  getRouter() {
    return this.router;
  }
}
