import express, { Request, Response } from "express";
import { Routes } from "../../domain/constants/routes";
import { injectCompanyRequestController } from "../DI/user";
import { injectUserController } from "../DI/user";
export class UserRoutes {
    private router:express.Router;
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(Routes.USERS.verifyCompany, (req: Request, res: Response) => {
            injectCompanyRequestController.companyDetails(req,res);
        });
        this.router.get(Routes.USERS.getUserData,(req:Request,res:Response)=>{
            injectUserController.getUserData(req,res);
        });
        this.router.post(Routes.USERS.updateUser,(req:Request,res:Response)=>{
            injectUserController.updateUser(req,res);
        });
        this.router.get(Routes.USERS.GETCOMPANYSTATUS,(req:Request,res:Response)=>{
            injectCompanyRequestController.getCompanyStatus(req,res);
        });
    }
     getRouter(){
        return this.router;
    }
}