import express, { Request, Response, NextFunction } from "express";
import { Routes } from "./main.route";
import { checkRoleBasedMiddleware } from "../middlewares/check-role-based.middleware";
import { injectMyLessonsController } from "../DI/company-user.di";
import { injectContestController } from "../DI/company-user.di";
import { injectChallengesController } from "../DI/company-user.di";
import { injectLeaderBoardController } from "../DI/company-user.di";
import { injectCompanyUserController } from "../DI/company-user.di";
import { injectTypingPracticeController } from "../DI/company-user.di";
import { injectNotificationController } from "../DI/company-user.di";
import { injectSetKeyboardLayoutController } from "../DI/company-user.di";

export class companyUserRoutes {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      Routes.COMPANY_USER.MY_LESSONS,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectMyLessonsController.myLessons(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_USER.ASSIGNED_LESSON_BY_ID,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectMyLessonsController.getAssignedLessonById(req, res, next);
      },
    );
    this.router.post(
      Routes.COMPANY_USER.SAVE_LESSON_RESULT,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectMyLessonsController.saveLessonResult(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_USER.OPEN_CONTESTS,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectContestController.getOpenContests(req, res, next);
      },
    );
    this.router.put(
      Routes.COMPANY_USER.JOIN_OR_LEAVE_CONTEST,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectContestController.joinOrLeaveContest(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_USER.GROUP_CONTESTS,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectContestController.getGroupContests(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_USER.FETCH_CONTEST,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectContestController.getContest(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_USER.FETCH_CONTEST_DATA,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectContestController.getContestData(req, res, next);
      },
    );

    this.router.get(
      Routes.COMPANY_USER.FETCH_COMPANY_USRS,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectChallengesController.companyUsers(req, res, next);
      },
    );
    this.router.post(
      Routes.COMPANY_USER.MAKE_CHALLENGE,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectChallengesController.makeChallenge(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_USER.CHECK_ALREAY_SEND,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectChallengesController.checkAlreadySentChallenge(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_USER.GET_CHALLENGES,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectChallengesController.getAllChallenges(req, res, next);
      },
    );
    this.router.put(
      Routes.COMPANY_USER.CHALLENGE_ACCEPT,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectChallengesController.acceptChallenge(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_USER.GET_CHALLENGE_GAME_DATA,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectChallengesController.getChallengeGameData(req, res, next);
      },
    );
    this.router.get(
      Routes.COMPANY_USER.LEADERBOARD,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectLeaderBoardController.getLeaderboard(req, res, next);
      },
    );
    this.router.put(
      Routes.COMPANY_USER.REJECT_CHALLENGE,
      checkRoleBasedMiddleware(["companyAdmin", "companyUser"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectChallengesController.rejectChallenge(req, res, next);
      },
    );
    //profile
    this.router.get(
      Routes.COMPANY_USER.PROFILE,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyUserController.getProfile(req, res, next);
      },
    );
    this.router.put(
      Routes.COMPANY_USER.UPDATE_PASSWORD,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyUserController.changePassword(req, res, next);
      },
    );
    //typing practice
    this.router.post(
      Routes.COMPANY_USER.GENERATE_TYPING_TEXT,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectTypingPracticeController.generateTypingText(req, res, next);
      },
    );
    //notifications
    this.router.get(
      Routes.COMPANY_USER.GET_NOTIFICATIONS,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectNotificationController.getNotifications(req, res, next);
      },
    );
    this.router.put(
      Routes.COMPANY_USER.MARK_NOTIFICATION_AS_READ,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectNotificationController.markAsRead(req, res, next);
      },
    );
    this.router.put(
      Routes.COMPANY_USER.SET_KEYBOARD_LAYOUT,
      checkRoleBasedMiddleware(["companyUser", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectSetKeyboardLayoutController.execute(req, res, next);
      },
    );


  }

  getRouter() {
    return this.router;
  }
}
 