import express, { Request, Response } from "express";
import { Routes } from "./routes";
import { injectUserManageController } from "../DI/admin";
import { injectCompanyManageController } from "../DI/admin";
import { checkRoleBasedMiddleware } from "../middlewares/checkRoleBasedMIddleware";
import { injectLessonManageController } from "../DI/admin";
export class adminRouter {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    //user management routes
    this.router.get(Routes.ADMIN.GET_USERS, checkRoleBasedMiddleware(["admin"]), (req: Request, res: Response)=>{
      injectUserManageController.getUsers(req, res);
    });
    this.router.patch(Routes.ADMIN.UPDATE_USER_STATUS,checkRoleBasedMiddleware(["admin"]),(req:Request,res:Response)=>{
      injectUserManageController.updateUserStatus(req,res);
    });

    //company management routes
    this.router.get(Routes.ADMIN.GET_COMPANYS,checkRoleBasedMiddleware(["admin"]),(req:Request,res:Response)=>{
      injectCompanyManageController.getCompanys(req,res);
    });

    this.router.patch("/companies/:companyId/status",checkRoleBasedMiddleware(["admin"]),(req: Request, res: Response) => {
    injectCompanyManageController.updateCompanyRequestStatus(req, res);
    }
    );

    //lesson management routes
    this.router.post(Routes.ADMIN.CREATE_LESSON,checkRoleBasedMiddleware(["admin"]),(req:Request,res:Response)=>{
      injectLessonManageController.createLesson(req,res);
    });
    this.router.get(Routes.ADMIN.FETCH_LESSONS,checkRoleBasedMiddleware(["admin"]),(req:Request,res:Response)=>{
      console.log("Fetching lessons for admin");
      injectLessonManageController.getLessons(req,res);
    });
    
    
  }
  getRouter() {
    return this.router;
  }
}
