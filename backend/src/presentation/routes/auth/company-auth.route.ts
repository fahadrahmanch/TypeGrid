import express from "express";
import { Routes } from "../main.route";
import { injectAuthController } from "../../DI/auth.di";
import { asyncHandler } from "../../../utils/async-handler";
export class companyAuthRouter {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(Routes.AUTH.SIGNIN, asyncHandler(injectAuthController.companySignIn));
    this.router.post(Routes.AUTH.REFRESH_TOKEN, asyncHandler(injectAuthController.refreshToken));
    this.router.post(Routes.AUTH.FORGOT_PASSWORD, asyncHandler(injectAuthController.forgotPassword));
    this.router.post(
      Routes.AUTH.VERIFY_FORGOT_PASSWORD_OTP,
      asyncHandler(injectAuthController.verifyForgotPasswordOtp)
    );
    this.router.post(Routes.AUTH.RESET_PASSWORD, asyncHandler(injectAuthController.resetPassword));
    this.router.post(Routes.AUTH.LOGOUT, asyncHandler(injectAuthController.logout));
    this.router.post(Routes.AUTH.GOOGLE_AUTH, asyncHandler(injectAuthController.companyGoogleAuth));
  }
  getRouter() {
    return this.router;
  }
}
