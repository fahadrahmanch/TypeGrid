import express, { Request, Response } from "express";
import { Routes } from "./routes";
import { injectCompanyRequestController } from "../DI/user";
import { injectUserController } from "../DI/user";
import { checkRoleBasedMiddleware } from "../middlewares/checkRoleBasedMIddleware";
import { injectTypingPracticeController } from "../DI/user";
import { injectGroupPlayController } from "../DI/user"; 
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

        // group 
        this.router.post(Routes.USERS.GROUP_PLAY.CREATE_GROUP,checkRoleBasedMiddleware(["user","companyAdmin"]),(req:Request,res:Response)=>{
            injectGroupPlayController.createGroup(req,res);
        })

        this.router.get(Routes.USERS.GROUP_PLAY.GET_GROUP,checkRoleBasedMiddleware(["user","companyAdmin"]),(req:Request,res:Response)=>{
            injectGroupPlayController.getGroup(req,res);
        })
        this.router.patch(Routes.USERS.GROUP_PLAY.EDIT_GROUP,checkRoleBasedMiddleware(['user','companyAdmin']),(req:Request,res:Response)=>{
            injectGroupPlayController.editGroup(req,res);
        })
        this.router.patch(Routes.USERS.GROUP_PLAY.JOIN_GROUP,checkRoleBasedMiddleware(['user','companyAdmin']),(req:Request,res:Response)=>{
            injectGroupPlayController.joinGroup(req,res);
        })
        this.router.delete(Routes.USERS.GROUP_PLAY.REMOVE_MEMBER,checkRoleBasedMiddleware(['user','companyAdmin']),(req:Request,res:Response)=>{
            injectGroupPlayController.removeMember(req,res);
        })
        this.router.post(Routes.USERS.GROUP_PLAY.START_GAME,checkRoleBasedMiddleware(['user','companyAdmin']),(req:Request,res:Response)=>{
            injectGroupPlayController.startGame(req,res);
        })


    }
     getRouter(){
        return this.router;
    }
}