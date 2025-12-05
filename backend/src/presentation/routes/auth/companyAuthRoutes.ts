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
      injectAuthController.forgotPassword(req,res)
    })
    this.router.post(Routes.AUTH.FORGOT_PASSWORD_OTP_VERIFY,(req: Request, res: Response) => {
        injectAuthController.verifyForgotPasswordOtp(req, res);
    });
    this.router.post(Routes.AUTH.CREATE_NEW_PASSWORD,(req: Request, res: Response) => {
        injectAuthController.createNewPassword(req, res);
    });
      this.router.post(
          Routes.AUTH.REFRESH_TOKEN,
          (req: Request, res: Response) => {
            injectAuthController.refreshToken(req, res);
          }
        );
  }
  getRouter() {
    return this.router;
  }
}
