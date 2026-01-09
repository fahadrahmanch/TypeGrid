import express, { Request, Response } from "express";
import { Routes } from "../../domain/constants/routes";
import { injectCompanyRequestController } from "../DI/user";
import { injectUserController } from "../DI/user";
import { checkRoleBasedMiddleware } from "../middlewares/checkRoleBasedMIddleware";
import { injectTypingPracticeController } from "../DI/user";
export class UserRoutes {
    private router:express.Router;
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(Routes.USERS.VERIFY_COMPANY, checkRoleBasedMiddleware(["user","companyAdmin"]), (req: Request, res: Response) => {
            injectCompanyRequestController.companyRequestDetails(req,res);
        });
        this.router.get(Routes.USERS.GET_PROFILE,checkRoleBasedMiddleware(["user","companyAdmin"]),(req:Request,res:Response)=>{
            injectUserController.getProfile(req,res);
        });
        this.router.put(Routes.USERS.UPDATE_PROFILE,checkRoleBasedMiddleware(["user","companyAdmin"]),(req:Request,res:Response)=>{
            console.log("Update profile route hit");
            injectUserController.updateProfile(req,res);

        });
        this.router.get(Routes.USERS.GET_COMPANY_STATUS,checkRoleBasedMiddleware(["user","companyAdmin"]),(req:Request,res:Response)=>{
            injectCompanyRequestController.getCompanyStatus(req,res);
        });
        this.router.put(Routes.USERS.RE_VERIFY_COMPANY,checkRoleBasedMiddleware(["user","companyAdmin"]),(req:Request,res:Response)=>{
            injectCompanyRequestController.reApplyCompanyDetails(req,res);
        });

        // typing practice routes
        this.router.get(Routes.USERS.START_TYPING_PRACTICE,checkRoleBasedMiddleware(["user","companyAdmin"]),(req:Request,res:Response)=>{
            injectTypingPracticeController.startTypingPractice(req,res);

        });
        this.router.get(Routes.USERS.GET_LESSON_BY_ID,checkRoleBasedMiddleware(["user","companyAdmin"]),(req:Request,res:Response)=>{
            injectTypingPracticeController.getLessonById(req,res);
        });

    }
     getRouter(){
        return this.router;
    }
}