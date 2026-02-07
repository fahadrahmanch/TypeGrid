import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { userAuthRouter } from "./presentation/routes/auth/userAuthRoutes";
import { adminAuthRouter } from "./presentation/routes/auth/adminAuthRoutes";
import cookieParser from "cookie-parser";
import { adminRouter } from "./presentation/routes/adminRoutes";
import { UserRoutes } from "./presentation/routes/userRoutes";
import { companyAuthRouter } from "./presentation/routes/auth/companyAuthRoutes";
import { companyAdminRouter } from "./presentation/routes/companyAdminRoutes";
import { TokenService } from "./application/services/tokenService";
import { authMiddleware } from "./presentation/middlewares/authMiddleware";
import { companyUserRoutes } from "./presentation/routes/companyUserRoutes";

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
  
  }
  setMiddleWares() {
    this.app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
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
    this.app.use("/admin", authMiddleware(this.tokenService),routerAdmin.getRouter());
  }
  private setUserRoutes() {
    const routerUser = new UserRoutes();
    this.app.use("/user",authMiddleware(this.tokenService), routerUser.getRouter());
  }
  private setCompanyAdminRoutes(){
    const routerCompanyAdmin=new companyAdminRouter();
    this.app.use("/company",authMiddleware(this.tokenService),routerCompanyAdmin.getRouter());
  }
  private setCompanyUserRoutes(){
    const routerCompanyUser= new companyUserRoutes();
    this.app.use("/company",authMiddleware(this.tokenService),routerCompanyUser.getRouter());
  }
  public async connectDatabase() {
    const db = new connectDB();
    await db.connectDatabase();
  }
}
