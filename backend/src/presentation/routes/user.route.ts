import express, { Request, Response, NextFunction } from "express";
import { Routes } from "./main.route";
import { injectCompanyRequestController } from "../DI/user.di";
import { injectUserController } from "../DI/user.di";
import { checkRoleBasedMiddleware } from "../middlewares/check-role-based.middleware";
import { injectTypingPracticeController } from "../DI/user.di";
import { injectGroupPlayController } from "../DI/user.di";
import { injectSoloPlayController } from "../DI/user.di";
import { injectQuickPlayController } from "../DI/user.di";
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
      (req: Request, res: Response, next: NextFunction) => {
        injectQuickPlayController.startQuickPlay(req, res, next);
      },
    );
    this.router.post(
      Routes.USERS.QUICK_PLAY.CHANGE_STATUS,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectQuickPlayController.changeStatus(req, res, next);
      },
    );
  }
  getRouter() {
    return this.router;
  }
}
