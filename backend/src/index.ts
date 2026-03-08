import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { userAuthRouter } from "./presentation/routes/auth/user-auth.route";
import { adminAuthRouter } from "./presentation/routes/auth/admin-auth.route";
import cookieParser from "cookie-parser";
import { adminRouter } from "./presentation/routes/admin.route";
import { UserRoutes } from "./presentation/routes/user.route";
import { companyAuthRouter } from "./presentation/routes/auth/company-auth.route";
import { companyAdminRouter } from "./presentation/routes/company-admin.route";
import { TokenService } from "./application/services/token.service";
import { authMiddleware } from "./presentation/middlewares/auth.middleware";
import { companyUserRoutes } from "./presentation/routes/company-user.route";
import { errorMiddleware } from "./presentation/middlewares/error.middleware";

dotenv.config();
export class app {
  public app: Application;
  private tokenService: TokenService;
  constructor() {
    this.app = express();
    this.tokenService = new TokenService();
    this.setMiddleWares();
    this.setAuthRoutes();
    this.setAdminRoutes();
    this.setUserRoutes();
    this.setCompanyAdminRoutes();
    this.setCompanyUserRoutes();
    this.app.use(errorMiddleware);
  }
  setMiddleWares() {
    this.app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      }),
    );
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use((req, res, next) => {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      next();
    });
  }

  private setAuthRoutes() {
    const UserAuthRouter = new userAuthRouter();
    const AdminAuthRouter = new adminAuthRouter();
    const CompanyAuthRouter = new companyAuthRouter();
    this.app.use("/user/auth", UserAuthRouter.getRouter());
    this.app.use("/admin/auth", AdminAuthRouter.getRouter());
    this.app.use("/company/auth", CompanyAuthRouter.getRouter());
  }
  private setAdminRoutes() {
    const routerAdmin = new adminRouter();
    this.app.use(
      "/admin",
      authMiddleware(this.tokenService),
      routerAdmin.getRouter(),
    );
  }
  private setUserRoutes() {
    const routerUser = new UserRoutes();
    this.app.use(
      "/user",
      authMiddleware(this.tokenService),
      routerUser.getRouter(),
    );
  }
  private setCompanyAdminRoutes() {
    const routerCompanyAdmin = new companyAdminRouter();
    this.app.use(
      "/company",
      authMiddleware(this.tokenService),
      routerCompanyAdmin.getRouter(),
    );
  }
  private setCompanyUserRoutes() {
    const routerCompanyUser = new companyUserRoutes();
    this.app.use(
      "/company",
      authMiddleware(this.tokenService),
      routerCompanyUser.getRouter(),
    );
  }
  public async connectDatabase() {
    const db = new connectDB();
    await db.connectDatabase();
  }
}
