import express, { Request, Response } from "express";
import { Routes } from "../../domain/constants/routes";
import { injectUserManageController } from "../DI/admin";
import { injectCompanyManageController } from "../DI/admin";
export class adminRouter {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.get(Routes.ADMIN.GET_USERS, (req: Request, res: Response) => {
      injectUserManageController.getUsers(req, res);
    });
    this.router.get(Routes.ADMIN.GET_COMPANYS,(req:Request,res:Response)=>{
      injectCompanyManageController.getCompanys(req,res)
    })
    this.router.post(Routes.ADMIN.APPROVE_COMPANY,(req:Request,res:Response)=>{
      injectCompanyManageController.approve(req,res)
    })
    this.router.post(Routes.ADMIN.REJECT_COMPANY,(req:Request,res:Response)=>{
      injectCompanyManageController.reject(req,res)
    })
    
  }
  getRouter() {
    return this.router;
  }
}
