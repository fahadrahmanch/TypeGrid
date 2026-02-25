import express, { Request, Response } from "express";
import { Routes } from "./routes";
import { checkRoleBasedMiddleware } from "../middlewares/checkRoleBasedMIddleware";
import { injectMyLessonsController } from "../DI/CompanyUser";
import { injectContestController } from "../DI/CompanyUser";
export class companyUserRoutes {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
   this.router.get(Routes.COMPANY_USER.MY_LESSONS,checkRoleBasedMiddleware(["companyAdmin","companyUser"]),(req:Request,res:Response)=>{
    injectMyLessonsController.myLessons(req,res);
   });
 this.router.get( Routes.COMPANY_USER.ASSIGNED_LESSON_BY_ID, checkRoleBasedMiddleware(["companyAdmin", "companyUser"]), (req: Request, res: Response) => {
    injectMyLessonsController.getAssignedLessonById(req, res);
  }
);
this.router.post(Routes.COMPANY_USER.SAVE_LESSON_RESULT,checkRoleBasedMiddleware(["companyUser","companyAdmin"]),(req:Request,res:Response)=>{
  injectMyLessonsController.saveLessonResult(req,res);
});
this.router.get(Routes.COMPANY_USER.OPEN_CONTESTS,checkRoleBasedMiddleware(["companyUser","companyAdmin"]),(req:Request,res:Response)=>{
  injectContestController.getOpenContests(req,res);
});
this.router.put(Routes.COMPANY_USER.JOIN_OR_LEAVE_CONTEST,checkRoleBasedMiddleware(["companyUser","companyAdmin"]),(req:Request,res:Response)=>{
  injectContestController.joinOrLeaveContest(req,res);
});
this.router.get(Routes.COMPANY_USER.GROUP_CONTESTS,checkRoleBasedMiddleware(["companyUser","companyAdmin"]),(req:Request,res:Response)=>{
  injectContestController.getGroupContests(req,res);
});
this.router.get(Routes.COMPANY_USER.FETCH_CONTEST,checkRoleBasedMiddleware(["companyUser","companyAdmin"]),(req:Request,res:Response)=>{
  injectContestController.getContest(req,res);
});
this.router.get(Routes.COMPANY_USER.FETCH_CONTEST_DATA,checkRoleBasedMiddleware(["companyUser","companyAdmin"]),(req:Request,res:Response)=>{
  injectContestController.getContestData(req,res);
});
  }

  getRouter() {
    return this.router;
  }
}
