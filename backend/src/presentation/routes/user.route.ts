import express, { Request, Response, NextFunction } from "express";
import { Routes } from "./main.route";
import { injectCompanyRequestController } from "../DI/user.di";
import { injectUserController } from "../DI/user.di";
import { checkRoleBasedMiddleware } from "../middlewares/check-role-based.middleware";
import { injectTypingPracticeController } from "../DI/user.di";
import { injectGroupPlayController } from "../DI/user.di";
import { injectSoloPlayController } from "../DI/user.di";
import { injectQuickPlayController } from "../DI/user.di";
import { injectDailyChallengeController } from "../DI/user.di";
import { injectLeaderboardController } from "../DI/user.di";
import { injectSubscriptionController } from "../DI/user.di";
import { injectPaymentController } from "../DI/user.di";
import { checkFeatureMiddleware } from "../DI/user.di";
export class UserRoutes {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      Routes.USERS.VERIFY_COMPANY,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyRequestController.companyRequestDetails(req, res, next);
      },
    );

    this.router.get(
      Routes.USERS.GET_PROFILE,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectUserController.getProfile(req, res, next);
      },
    );

    this.router.put(
      Routes.USERS.UPDATE_PROFILE,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectUserController.updateProfile(req, res, next);
      },
    );
    this.router.put(
      Routes.USERS.CHANGE_PASSWORD,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectUserController.changePassword(req, res, next);
      },
    );
    this.router.get(
      Routes.USERS.GET_COMPANY_STATUS,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyRequestController.getCompanyStatus(req, res, next);
      },
    );

    this.router.put(
      Routes.USERS.RE_VERIFY_COMPANY,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyRequestController.reApplyCompanyDetails(req, res, next);
      },
    );

    // typing practice routes
    this.router.get(
      Routes.USERS.GET_RANDOM_PRACTICE_LESSON,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectTypingPracticeController.getRandomPracticeLesson(req, res, next);
      },
    );

    this.router.get(
      Routes.USERS.GET_LESSON_BY_ID,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectTypingPracticeController.getLessonById(req, res, next);
      },
    );

    // group
    this.router.post(
      Routes.USERS.GROUP_PLAY.CREATE_GROUP,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      checkFeatureMiddleware("Group Play"),
      (req: Request, res: Response, next: NextFunction) => {
        injectGroupPlayController.createGroup(req, res, next);
      },
    );

    this.router.get(
      Routes.USERS.GROUP_PLAY.GET_GROUP,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectGroupPlayController.getGroup(req, res, next);
      },
    );
    this.router.patch(
      Routes.USERS.GROUP_PLAY.EDIT_GROUP,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectGroupPlayController.editGroup(req, res, next);
      },
    );
    this.router.patch(
      Routes.USERS.GROUP_PLAY.JOIN_GROUP,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectGroupPlayController.joinGroup(req, res, next);
      },
    );
    this.router.delete(
      Routes.USERS.GROUP_PLAY.REMOVE_MEMBER,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectGroupPlayController.removeMember(req, res, next);
      },
    );
    this.router.post(
      Routes.USERS.GROUP_PLAY.START_GAME,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectGroupPlayController.startGame(req, res, next);
      },
    );
    this.router.post(
      Routes.USERS.GROUP_PLAY.NEW_GAME,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectGroupPlayController.newGame(req, res, next);
      },
    );

    //solo
    this.router.post(
      Routes.USERS.SOLO_PLAY.SOLO_CREATE,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      checkFeatureMiddleware("Solo Play"),
      (req: Request, res: Response, next: NextFunction) => {
        injectSoloPlayController.createSoloPlay(req, res, next);
      },
    );
    this.router.post(
      Routes.USERS.SOLO_PLAY.RESULT_SOLO_PLAY,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectSoloPlayController.result(req, res, next);
      },
    );

    //quick play
    this.router.post(
      Routes.USERS.QUICK_PLAY.START_QUICK_PLAY,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      checkFeatureMiddleware("Quick Play"),
      (req: Request, res: Response, next: NextFunction) => {
        injectQuickPlayController.startQuickPlay(req, res, next);
      },
    );
    this.router.post(
      Routes.USERS.QUICK_PLAY.CHANGE_STATUS,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      checkFeatureMiddleware("Quick Play"),
      (req: Request, res: Response, next: NextFunction) => {
        injectQuickPlayController.changeStatus(req, res, next);
      },
    );

    //challenge
    this.router.get(
      Routes.USERS.GET_TODAY_CHALLENGE,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectDailyChallengeController.getTodayChallenge(req, res, next);
      },
    );
    this.router.post(
      Routes.USERS.DAILY_CHALLENGE_FINISHED,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectDailyChallengeController.dailyChallengeFinished(req, res, next);
      },
    );
    this.router.get(
      Routes.USERS.DAILY_CHALLENGE_STATISTICS,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectDailyChallengeController.getStatistics(req as any, res, next);
      },
    );

    // leaderboard
    this.router.get(
      Routes.USERS.LEADERBOARD,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectLeaderboardController.getLeaderboard(req, res, next);
      },
    );

    //subscription
    this.router.get(
      Routes.USERS.SUBSCRIPTION,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectSubscriptionController.getNormalSubscriptionPlans(req, res, next);
      },
    );
    this.router.get(
      Routes.USERS.COMPANY_PLANS,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectSubscriptionController.getCompanySubscriptionPlans(req, res, next);
      },
    );
    this.router.post(
      Routes.USERS.CREATE_SESSION,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectPaymentController.createSession(req, res, next);
      },
    );
    this.router.post(
      Routes.USERS.CONFIRM_SUBSCRIPTION,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectPaymentController.confirmSubscription(req, res, next);
      },
    );
    this.router.post(
      Routes.USERS.CREATE_COMPANY_SESSION,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectPaymentController.createCompanySession(req, res, next);
      },
    );
  }
  getRouter() {
    return this.router;
  }
}
