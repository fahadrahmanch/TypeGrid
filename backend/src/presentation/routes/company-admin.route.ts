import express, { Request, Response, NextFunction } from "express";
import { Routes } from "./main.route";
import { injectCompanyUserController } from "../DI/company-admin.di";
import { checkRoleBasedMiddleware } from "../middlewares/check-role-based.middleware";
import { injectCompanyLessonManageController } from "../DI/company-admin.di";
import { injectCompanyGroupController } from "../DI/company-admin.di";
import { injectCompanyContestManagementController } from "../DI/company-admin.di";
import { validate } from "../middlewares/validate.middleware";
import { companyUserValidation } from "../middlewares/validations/company-user.validation";
import { lessonValidation } from "../middlewares/validations/lessson.validation";
import { injectNotificationController } from "../DI/company-admin.di";
export class companyAdminRouter {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      Routes.COMPANY_ADMIN.ADD_USER,
      checkRoleBasedMiddleware(["companyAdmin"]),
      validate(companyUserValidation.addCompanyUser),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyUserController.addUser(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_ADMIN.GET_COMPANY_USERS,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyUserController.getUsers(req, res, next);
      },
    );
    this.router.delete(
      Routes.COMPANY_ADMIN.DELETE_COMPANY_USER,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyUserController.deleteCompanyUser(req, res, next);
      },
    );

    //lessons
    this.router.post(
      Routes.COMPANY_ADMIN.CREATE_LESSON,
      checkRoleBasedMiddleware(["companyAdmin"]),
      validate(lessonValidation.createLesson),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyLessonManageController.createLesson(req, res, next);
      },
    );

    this.router.get(
      Routes.COMPANY_ADMIN.FETCH_LESSONS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyLessonManageController.getLessons(req, res, next);
      },
    );

    this.router.get(
      Routes.COMPANY_ADMIN.FETCH_LESSON_BY_ID,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyLessonManageController.getLesson(req, res, next);
      },
    );
    this.router.put(
      Routes.COMPANY_ADMIN.UPDATE_LESSON,
      checkRoleBasedMiddleware(["companyAdmin"]),
      validate(lessonValidation.updateLesson),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyLessonManageController.updateLesson(req, res, next);
      },
    );
    this.router.delete(
      Routes.COMPANY_ADMIN.DELETE_LESSON,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyLessonManageController.deleteLesson(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_ADMIN.GET_COMPANY_USERS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyUserController.getUsers(req, res, next);
      },
    );

    this.router.get(
      Routes.COMPANY_ADMIN.GET_ADMIN_LESSONS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyLessonManageController.getAdminLessons(req, res, next);
      },
    );
    this.router.post(
      Routes.COMPANY_ADMIN.ASSIGN_LESSON,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyLessonManageController.assignLessons(req, res, next);
      },
    );
    // group
    this.router.post(
      Routes.COMPANY_ADMIN.CREATE_COMPANY_GROUP,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyGroupController.createGroup(req, res, next);
      },
    );

    this.router.post(
      Routes.COMPANY_ADMIN.CREATE_COMPANY_GROUP_AUTO,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyGroupController.createGroupAuto(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_ADMIN.COMPANY_USERS_WITH_STATUS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyUserController.getCompanyUsersWithStatus(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_ADMIN.GET_COMPANY_GROUPS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyGroupController.getCompanyGroups(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_ADMIN.GET_COMPANY_GROUP_BY_ID,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyGroupController.getCompanyGroupById(req, res, next);
      },
    );
    this.router.delete(
      Routes.COMPANY_ADMIN.DELETE_COMPANY_GROUP,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyGroupController.deleteGroup(req, res, next);
      },
    );
    this.router.patch(
      Routes.COMPANY_ADMIN.REMOVE_MEMBER,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyGroupController.removeMember(req, res, next);
      },
    );
    this.router.patch(
      Routes.COMPANY_ADMIN.ADD_MEMBER,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyGroupController.addMember(req, res, next);
      },
    );

    //company contest
    this.router.post(
      Routes.COMPANY_ADMIN.CREATE_COMPANY_CONTEST,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyContestManagementController.createContest(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_ADMIN.COMPANY_CONTESTS,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyContestManagementController.getContests(req, res, next);
      },
    );
    this.router.patch(
      Routes.COMPANY_ADMIN.CONTEST_STATUS,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyContestManagementController.updateContestStatus(
          req,
          res,
          next,
        );
      },
    );
    this.router.get(
      Routes.COMPANY_ADMIN.CONTEST_PARTICIPANTS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyContestManagementController.getContestsParticipants(
          req,
          res,
          next,
        );
      },
    );
    this.router.get(
      Routes.COMPANY_ADMIN.FETCH_CONTEST_ADMIN,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyContestManagementController.getContestData(req, res, next);
      },
    );
    this.router.put(
      Routes.COMPANY_ADMIN.UPDATE_CONTEST,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyContestManagementController.updateContest(req, res, next);
      },
    );
    this.router.delete(
      Routes.COMPANY_ADMIN.DELETE_CONTEST,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyContestManagementController.deleteContest(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_ADMIN.FETCH_CONTEST_RESULT,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyContestManagementController.getContestResult(
          req,
          res,
          next,
        );
      },
    );

    //notification
    this.router.post(
      Routes.COMPANY_ADMIN.SEND_INDIVIDUAL_NOTIFICATION,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectNotificationController.sendIndividualNotification(req, res, next);
      },
    );
    this.router.post(
      Routes.COMPANY_ADMIN.SEND_GROUP_NOTIFICATION,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectNotificationController.sendGroupNotification(req, res, next);
      },
    );
    this.router.post(
      Routes.COMPANY_ADMIN.SEND_ALL_NOTIFICATION,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectNotificationController.sendAllNotification(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_ADMIN.GET_NOTIFICATION_HISTORY,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectNotificationController.getNotificationHistory(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_ADMIN.GET_COMPANY_DETAILS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyUserController.companyDetailswithSubcitptionDetails(req, res, next);
      },
    );
  }
  getRouter() {
    return this.router;
  }
}
