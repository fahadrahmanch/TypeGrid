import express, { Request, Response } from "express";
import { Routes } from "./routes";
import { checkRoleBasedMiddleware } from "../middlewares/checkRoleBasedMIddleware";
import { injectMyLessonsController } from "../DI/CompanyUser";
import { injectContestController } from "../DI/CompanyUser";
import { injectChallengesController } from "../DI/CompanyUser";
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

this.router.get(Routes.COMPANY_USER.FETCH_COMPANY_USRS,checkRoleBasedMiddleware(['companyUser','companyAdmin']),(req:Request,res:Response)=>{
  injectChallengesController.companyUsers(req,res)
})
this.router.post(Routes.COMPANY_USER.MAKE_CHALLENGE,checkRoleBasedMiddleware(['companyAdmin','companyUser']),(req:Request,res:Response)=>{
  injectChallengesController.makeChallenge(req,res)
})
this.router.get(Routes.COMPANY_USER.CHECK_ALREAY_SEND,checkRoleBasedMiddleware(['companyAdmin','companyUser']),(req:Request,res:Response)=>{
  injectChallengesController.checkAlreadySentChallenge(req,res)
})
this.router.get(Routes.COMPANY_USER.GET_CHALLENGES,checkRoleBasedMiddleware(['companyAdmin','companyUser']),(req:Request,res:Response)=>{
  injectChallengesController.getAllChallenges(req,res)
})
this.router.put(Routes.COMPANY_USER.CHALLENGE_ACCEPT,checkRoleBasedMiddleware(['companyAdmin','companyUser']),(req:Request,res:Response)=>{
  injectChallengesController.acceptChallenge(req,res)
})
  }

  getRouter() {
    return this.router;
  }
}
