import express, { Request, Response } from "express";
import { Routes } from "../../domain/constants/routes";
import { injectCompanyRequestController } from "../DI/user";
export class UserRoutes {
    private router:express.Router;
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(Routes.USERS.verifyCompany, (req: Request, res: Response) => {
            injectCompanyRequestController.companyDetails(req,res)
        });
        
    }
     getRouter(){
        return this.router;
    }
}