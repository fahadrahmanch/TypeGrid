import express, { Request, Response, NextFunction } from "express";
import { Routes } from "../main.route";
import { injectAuthController } from "../../DI/auth.di";
export class userAuthRouter {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    //user
    this.router.post(Routes.AUTH.SIGNUP, (req: Request, res: Response, next: NextFunction) => {
      injectAuthController.register(req, res, next);
    });
    this.router.post(Routes.AUTH.VERIFY_OTP, (req: Request, res: Response, next: NextFunction) => {
      injectAuthController.verifyOtp(req, res, next);
    });
    this.router.post(Routes.AUTH.RESEND_OTP, (req: Request, res: Response, next: NextFunction) => {
      injectAuthController.resentOtp(req, res, next);
    });
    this.router.post(Routes.AUTH.SIGNIN, (req: Request, res: Response, next: NextFunction) => {
      injectAuthController.signin(req, res, next);
    });
    this.router.post(
      Routes.AUTH.REFRESH_TOKEN,
      (req: Request, res: Response, next: NextFunction) => {
        injectAuthController.refreshToken(req, res, next);
      },
    );
    this.router.post(Routes.AUTH.GOOGLE_AUTH, (req: Request, res: Response, next: NextFunction) => {
      injectAuthController.googleAuth(req, res, next);
    });
    this.router.post(Routes.AUTH.LOGOUT, (req: Request, res: Response, next: NextFunction) => {
      injectAuthController.logout(req, res, next);
    });
    this.router.post(
      Routes.AUTH.FORGOT_PASSWORD,
      (req: Request, res: Response, next: NextFunction) => {
        injectAuthController.forgotPassword(req, res, next);
      },
    );
    this.router.post(
      Routes.AUTH.VERIFY_FORGOT_PASSWORD_OTP,
      (req: Request, res: Response, next: NextFunction) => {
        injectAuthController.verifyForgotPasswordOtp(req, res, next);
      },
    );
    this.router.post(
      Routes.AUTH.RESET_PASSWORD,
      (req: Request, res: Response, next: NextFunction) => {
        injectAuthController.resetPassword(req, res, next);
      },
    );
  }
  getRouter() {
    return this.router;
  }
}
