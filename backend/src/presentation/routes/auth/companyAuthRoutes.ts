import express, { Request, Response } from "express";
import { Routes } from "../../../domain/constants/routes";
import { injectAuthController } from "../../DI/auth";
export class companyAuthRouter {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(Routes.AUTH.SIGNIN, (req: Request, res: Response) => {
      injectAuthController.companySignIn(req, res);
    });
    this.router.post(Routes.AUTH.REFRESH_TOKEN,(req: Request, res: Response) => {
        injectAuthController.refreshToken(req, res);
    });
    this.router.post(Routes.AUTH.FORGOT_PASSWORD,(req:Request,res:Response)=>{
      injectAuthController.forgotPassword(req,res);
    });
    this.router.post(Routes.AUTH.VERIFY_FORGOT_PASSWORD_OTP,(req: Request, res: Response) => {
        injectAuthController.verifyForgotPasswordOtp(req, res);
    });
this.router.post(Routes.AUTH.RESET_PASSWORD,(req: Request, res: Response) => {
    injectAuthController.resetPassword(req, res);
});
this.router.post(Routes.AUTH.LOGOUT, (req: Request, res: Response) => {
  injectAuthController.logout(req, res);
});
  }
  getRouter() {
    return this.router;
  }
}
