import express, { Request, Response } from "express";
import { Routes } from "../routes";
import { injectAuthController } from "../../DI/auth";
export class adminAuthRouter {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(Routes.AUTH.SIGNIN,(req: Request, res: Response) => {
        injectAuthController.AdminSignIn(req, res);
      }
    );
    this.router.post(Routes.AUTH.REFRESH_TOKEN,(req: Request, res: Response) => {
        injectAuthController.refreshToken(req, res);
      }
    );
    this.router.post(Routes.AUTH.REFRESH_TOKEN,(req: Request, res: Response) => {
            injectAuthController.refreshToken(req, res);
          }
    );
     this.router.post(Routes.AUTH.LOGOUT, (req: Request, res: Response) => {
      injectAuthController.logout(req, res);
    });
   
  }
  getRouter() {
    return this.router;
  }
}
