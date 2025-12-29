import express, { Request, Response } from "express";
import { Routes } from "../../domain/constants/routes";
import { injectCompanyRequestController } from "../DI/user";
import { injectUserController } from "../DI/user";
import { checkRoleBasedMiddleware } from "../middlewares/checkRoleBasedMIddleware";
export class UserRoutes {
    private router:express.Router;
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(Routes.USERS.verifyCompany, checkRoleBasedMiddleware(["user",'companyAdmin']), (req: Request, res: Response) => {
            injectCompanyRequestController.companyDetails(req,res);
        });
        this.router.get(Routes.USERS.getUserData,checkRoleBasedMiddleware(["user","companyAdmin"]),(req:Request,res:Response)=>{
            injectUserController.getUserData(req,res);
        });
        this.router.post(Routes.USERS.updateUser,checkRoleBasedMiddleware(["user","companyAdmin"]),(req:Request,res:Response)=>{
            injectUserController.updateUser(req,res);
        });
        this.router.get(Routes.USERS.GETCOMPANYSTATUS,checkRoleBasedMiddleware(["user","companyAdmin"]),(req:Request,res:Response)=>{
            injectCompanyRequestController.getCompanyStatus(req,res);
        });
        this.router.put(Routes.USERS.RE_VERIFY_COMPANY,checkRoleBasedMiddleware(["user","companyAdmin"]),(req:Request,res:Response)=>{
            injectCompanyRequestController.reApplyCompanyDetails(req,res)
        })
    }
     getRouter(){
        return this.router;
    }
}