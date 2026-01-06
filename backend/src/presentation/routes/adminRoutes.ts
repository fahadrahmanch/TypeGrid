import express, { Request, Response } from "express";
import { Routes } from "../../domain/constants/routes";
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
    this.router.patch(Routes.ADMIN.BLOCK_USER,checkRoleBasedMiddleware(["admin"]),(req:Request,res:Response)=>{
      injectUserManageController.blockUser(req,res);
    });

    //company management routes
    this.router.get(Routes.ADMIN.GET_COMPANYS,checkRoleBasedMiddleware(["admin"]),(req:Request,res:Response)=>{
      injectCompanyManageController.getCompanys(req,res);
    });
    this.router.patch(Routes.ADMIN.APPROVE_COMPANY,checkRoleBasedMiddleware(["admin"]),(req:Request,res:Response)=>{
      injectCompanyManageController.approve(req,res);
    });
    this.router.patch(Routes.ADMIN.REJECT_COMPANY,checkRoleBasedMiddleware(["admin"]),(req:Request,res:Response)=>{
      injectCompanyManageController.reject(req,res);
    });
    //lesson management routes
    this.router.post(Routes.ADMIN.CREATE_LESSON,checkRoleBasedMiddleware(["admin"]),(req:Request,res:Response)=>{
      injectLessonManageController.createLesson(req,res);
    });
    
    
  }
  getRouter() {
    return this.router;
  }
}
