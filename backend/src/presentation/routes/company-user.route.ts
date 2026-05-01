import express from "express";
import { Routes } from "./main.route";
import { checkRoleBasedMiddleware } from "../middlewares/check-role-based.middleware";
import { injectMyLessonsController } from "../DI/company-user.di";
import { injectContestController } from "../DI/company-user.di";
import { injectChallengesController } from "../DI/company-user.di";
import { injectLeaderBoardController } from "../DI/company-user.di";
import { injectCompanyUserController } from "../DI/company-user.di";
import { injectTypingPracticeController } from "../DI/company-user.di";
import { injectNotificationController } from "../DI/company-user.di";
import { injectSetKeyboardLayoutController, injectUserDashboardController } from "../DI/company-user.di";
import { asyncHandler } from "../../utils/async-handler";
import { checkCompanyStatusMiddleware } from "../middlewares/check-company-status.middleware";

export class companyUserRoutes {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(asyncHandler(checkCompanyStatusMiddleware));

    this.router.get(
      Routes.COMPANY_USER.DASHBOARD_STATS,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectUserDashboardController.getStats)
    );

    this.router.get(
      Routes.COMPANY_USER.MY_LESSONS,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      asyncHandler(injectMyLessonsController.myLessons)
    );
    this.router.get(
      Routes.COMPANY_USER.ASSIGNED_LESSON_BY_ID,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      asyncHandler(injectMyLessonsController.getAssignedLessonById)
    );
    this.router.post(
      Routes.COMPANY_USER.SAVE_LESSON_RESULT,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectMyLessonsController.saveLessonResult)
    );
    this.router.get(
      Routes.COMPANY_USER.OPEN_CONTESTS,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectContestController.getOpenContests)
    );
    this.router.put(
      Routes.COMPANY_USER.JOIN_OR_LEAVE_CONTEST,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectContestController.joinOrLeaveContest)
    );
    this.router.get(
      Routes.COMPANY_USER.GROUP_CONTESTS,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectContestController.getGroupContests)
    );
    this.router.get(
      Routes.COMPANY_USER.FETCH_CONTEST,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectContestController.getContest)
    );
    this.router.get(
      Routes.COMPANY_USER.FETCH_CONTEST_DATA,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectContestController.getContestData)
    );

    this.router.get(
      Routes.COMPANY_USER.FETCH_COMPANY_USRS,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectChallengesController.companyUsers)
    );
    this.router.post(
      Routes.COMPANY_USER.MAKE_CHALLENGE,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      asyncHandler(injectChallengesController.makeChallenge)
    );
    this.router.get(
      Routes.COMPANY_USER.CHECK_ALREAY_SEND,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      asyncHandler(injectChallengesController.checkAlreadySentChallenge)
    );
    this.router.get(
      Routes.COMPANY_USER.GET_CHALLENGES,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      asyncHandler(injectChallengesController.getAllChallenges)
    );
    this.router.put(
      Routes.COMPANY_USER.CHALLENGE_ACCEPT,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      asyncHandler(injectChallengesController.acceptChallenge)
    );
    this.router.get(
      Routes.COMPANY_USER.GET_CHALLENGE_GAME_DATA,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      asyncHandler(injectChallengesController.getChallengeGameData)
    );
    this.router.get(
      Routes.COMPANY_USER.LEADERBOARD,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      asyncHandler(injectLeaderBoardController.getLeaderboard)
    );
    this.router.put(
      Routes.COMPANY_USER.REJECT_CHALLENGE,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      asyncHandler(injectChallengesController.rejectChallenge)
    );
    //profile
    this.router.get(
      Routes.COMPANY_USER.PROFILE,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectCompanyUserController.getProfile)
    );
    this.router.put(
      Routes.COMPANY_USER.UPDATE_PASSWORD,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectCompanyUserController.changePassword)
    );
    //typing practice
    this.router.post(
      Routes.COMPANY_USER.GENERATE_TYPING_TEXT,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectTypingPracticeController.generateTypingText)
    );
    //notifications
    this.router.get(
      Routes.COMPANY_USER.GET_NOTIFICATIONS,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectNotificationController.getNotifications)
    );
    this.router.put(
      Routes.COMPANY_USER.MARK_NOTIFICATION_AS_READ,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectNotificationController.markAsRead)
    );
    this.router.put(
      Routes.COMPANY_USER.SET_KEYBOARD_LAYOUT,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectSetKeyboardLayoutController.execute)
    );
    this.router.get(
      Routes.COMPANY_USER.DASHBOARD_STATS,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      asyncHandler(injectUserDashboardController.getStats)
    );
  }


  getRouter() {
    return this.router;
  }
}
