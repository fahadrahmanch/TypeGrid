import express, { Request, Response } from "express";
import { Routes } from "../../domain/constants/routes";
import { injectCompanyUserController } from "../DI/CompanyAdmin";
import { checkRoleBasedMiddleware } from "../middlewares/checkRoleBasedMIddleware";
export class companyAdminRouter {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(Routes.COMPANY_ADMIN.ADD_USER,checkRoleBasedMiddleware(["companyAdmin"]),(req:Request,res:Response)=>{
        injectCompanyUserController.addUser(req,res);
    });
    this.router.get(Routes.COMPANY_ADMIN.GET_COMPANY_USERS,checkRoleBasedMiddleware(["companyAdmin"]),(req:Request,res:Response)=>{
      injectCompanyUserController.getUsers(req,res);
    });
    this.router.delete(Routes.COMPANY_ADMIN.DELETE_COMPANY_USER,checkRoleBasedMiddleware(["companyAdmin"]),(req:Request,res:Response)=>{
      injectCompanyUserController.deleteCompanyUser(req,res);
    });
    
  }
  getRouter() {
    return this.router;
  }
}
