import express from 'express';
import { Routes } from '../main.route';
import { injectAuthController } from '../../DI/auth.di';
import { asyncHandler } from '../../../utils/async-handler';
export class adminAuthRouter {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(Routes.AUTH.SIGNIN, asyncHandler(injectAuthController.AdminSignIn));
    this.router.post(Routes.AUTH.REFRESH_TOKEN, asyncHandler(injectAuthController.refreshToken));
    this.router.post(Routes.AUTH.REFRESH_TOKEN, asyncHandler(injectAuthController.refreshToken));
    this.router.post(Routes.AUTH.LOGOUT, asyncHandler(injectAuthController.logout));
  }
  getRouter() {
    return this.router;
  }
}
