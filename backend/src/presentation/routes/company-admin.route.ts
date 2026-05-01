import express from "express";
import { Routes } from "./main.route";
import { injectCompanyUserController } from "../DI/company-admin.di";
import { checkRoleBasedMiddleware } from "../middlewares/check-role-based.middleware";
import { injectCompanyLessonManageController } from "../DI/company-admin.di";
import { injectCompanyGroupController } from "../DI/company-admin.di";
import { injectCompanyContestManagementController } from "../DI/company-admin.di";
import { validate } from "../middlewares/validate.middleware";
import { companyUserValidation } from "../middlewares/validations/company-user.validation";
import { lessonValidation } from "../middlewares/validations/lessson.validation";
import { injectNotificationController, injectCompanyDashboardController } from "../DI/company-admin.di";
import { asyncHandler } from "../../utils/async-handler";
import { checkCompanyStatusMiddleware } from "../middlewares/check-company-status.middleware";
export class companyAdminRouter {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.use(asyncHandler(checkCompanyStatusMiddleware));
    
    this.router.get(
      Routes.COMPANY_ADMIN.DASHBOARD_STATS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyDashboardController.getStats)
    );

    this.router.post(
      Routes.COMPANY_ADMIN.ADD_USER,
      checkRoleBasedMiddleware(["companyAdmin"]),
      validate(companyUserValidation.addCompanyUser),
      asyncHandler(injectCompanyUserController.addUser)
    );
    this.router.get(
      Routes.COMPANY_ADMIN.GET_COMPANY_USERS,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      asyncHandler(injectCompanyUserController.getUsers)
    );
    this.router.delete(
      Routes.COMPANY_ADMIN.DELETE_COMPANY_USER,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyUserController.deleteCompanyUser)
    );

    //lessons
    this.router.post(
      Routes.COMPANY_ADMIN.CREATE_LESSON,
      checkRoleBasedMiddleware(["companyAdmin"]),
      validate(lessonValidation.createLesson),
      asyncHandler(injectCompanyLessonManageController.createLesson)
    );
    this.router.post(
      Routes.COMPANY_ADMIN.ASSIGN_LESSON_TO_GROUP,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyLessonManageController.assignLessonToGroup)
    );
    this.router.get(
      Routes.COMPANY_ADMIN.FETCH_LESSONS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyLessonManageController.getLessons)
    );

    this.router.get(
      Routes.COMPANY_ADMIN.GET_PENDING_USERS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyLessonManageController.getPendingUsers)
    );
    this.router.get(
      Routes.COMPANY_ADMIN.FETCH_LESSON_BY_ID,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyLessonManageController.getLesson)
    );
    this.router.put(
      Routes.COMPANY_ADMIN.UPDATE_LESSON,
      checkRoleBasedMiddleware(["companyAdmin"]),
      validate(lessonValidation.updateLesson),
      asyncHandler(injectCompanyLessonManageController.updateLesson)
    );
    this.router.delete(
      Routes.COMPANY_ADMIN.DELETE_LESSON,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyLessonManageController.deleteLesson)
    );

    this.router.get(
      Routes.COMPANY_ADMIN.GET_COMPANY_USERS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyUserController.getUsers)
    );

    this.router.get(
      Routes.COMPANY_ADMIN.GET_ADMIN_LESSONS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyLessonManageController.getAdminLessons)
    );
    this.router.post(
      Routes.COMPANY_ADMIN.ASSIGN_LESSON,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyLessonManageController.assignLessons)
    );
    // group
    this.router.post(
      Routes.COMPANY_ADMIN.CREATE_COMPANY_GROUP,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyGroupController.createGroup)
    );

    this.router.post(
      Routes.COMPANY_ADMIN.CREATE_COMPANY_GROUP_AUTO,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyGroupController.createGroupAuto)
    );
    this.router.get(
      Routes.COMPANY_ADMIN.COMPANY_USERS_WITH_STATUS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyUserController.getCompanyUsersWithStatus)
    );
    this.router.get(
      Routes.COMPANY_ADMIN.GET_COMPANY_GROUP_BY_ID,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyGroupController.getCompanyGroupById)
    );
    this.router.get(
      Routes.COMPANY_ADMIN.GET_COMPANY_GROUPS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyGroupController.getCompanyGroups)
    );
    this.router.delete(
      Routes.COMPANY_ADMIN.DELETE_COMPANY_GROUP,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyGroupController.deleteGroup)
    );
    this.router.patch(
      Routes.COMPANY_ADMIN.REMOVE_MEMBER,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyGroupController.removeMember)
    );
    this.router.patch(
      Routes.COMPANY_ADMIN.ADD_MEMBER,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyGroupController.addMember)
    );

    //company contest
    this.router.post(
      Routes.COMPANY_ADMIN.CREATE_COMPANY_CONTEST,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyContestManagementController.createContest)
    );
    this.router.get(
      Routes.COMPANY_ADMIN.COMPANY_CONTESTS,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      asyncHandler(injectCompanyContestManagementController.getContests)
    );
    this.router.patch(
      Routes.COMPANY_ADMIN.CONTEST_STATUS,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      asyncHandler(injectCompanyContestManagementController.updateContestStatus)
    );
    this.router.get(
      Routes.COMPANY_ADMIN.CONTEST_PARTICIPANTS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyContestManagementController.getContestsParticipants)
    );
    this.router.get(
      Routes.COMPANY_ADMIN.FETCH_CONTEST_ADMIN,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyContestManagementController.getContestData)
    );
    this.router.put(
      Routes.COMPANY_ADMIN.UPDATE_CONTEST,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyContestManagementController.updateContest)
    );
    this.router.delete(
      Routes.COMPANY_ADMIN.DELETE_CONTEST,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyContestManagementController.deleteContest)
    );
    this.router.get(
      Routes.COMPANY_ADMIN.FETCH_CONTEST_RESULT,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyContestManagementController.getContestResult)
    );

    //notification
    this.router.post(
      Routes.COMPANY_ADMIN.SEND_INDIVIDUAL_NOTIFICATION,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectNotificationController.sendIndividualNotification)
    );
    this.router.post(
      Routes.COMPANY_ADMIN.SEND_GROUP_NOTIFICATION,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectNotificationController.sendGroupNotification)
    );
    this.router.post(
      Routes.COMPANY_ADMIN.SEND_ALL_NOTIFICATION,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectNotificationController.sendAllNotification)
    );
    this.router.get(
      Routes.COMPANY_ADMIN.GET_NOTIFICATION_HISTORY,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectNotificationController.getNotificationHistory)
    );
    this.router.get(
      Routes.COMPANY_ADMIN.GET_COMPANY_DETAILS,
      checkRoleBasedMiddleware(["companyAdmin"]),
      asyncHandler(injectCompanyUserController.companyDetailswithSubcitptionDetails)
    );
  }
  getRouter() {
    return this.router;
  }
}
