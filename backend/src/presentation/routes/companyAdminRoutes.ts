import express, { Request, Response } from "express";
import { Routes } from "./routes";
import { injectCompanyUserController } from "../DI/CompanyAdmin";
import { checkRoleBasedMiddleware } from "../middlewares/checkRoleBasedMIddleware";
import { injectCompanyLessonManageController } from "../DI/CompanyAdmin";
import { injectCompanyGroupController } from "../DI/CompanyAdmin";
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
    
    //lessons
    this.router.post(Routes.COMPANY_ADMIN.CREATE_LESSON,checkRoleBasedMiddleware(["companyAdmin"]),(req:Request,res:Response)=>{
      injectCompanyLessonManageController.createLesson(req,res);
    } );
    
    this.router.get(Routes.COMPANY_ADMIN.FETCH_LESSONS,checkRoleBasedMiddleware(["companyAdmin"]),(req:Request,res:Response)=>{
      injectCompanyLessonManageController.getLessons(req,res);
    });
    
    this.router.get(Routes.COMPANY_ADMIN.FETCH_LESSON_BY_ID,checkRoleBasedMiddleware(["companyAdmin"]),(req:Request,res:Response)=>{
      injectCompanyLessonManageController.getLesson(req,res);
    });
    this.router.put(Routes.COMPANY_ADMIN.UPDATE_LESSON,checkRoleBasedMiddleware(["companyAdmin"]),(req:Request,res:Response)=>{
      injectCompanyLessonManageController.updateLesson(req,res);
    });
    this.router.delete(Routes.COMPANY_ADMIN.DELETE_LESSON,checkRoleBasedMiddleware(["companyAdmin"]),(req:Request,res:Response)=>{
      injectCompanyLessonManageController.deleteLesson(req,res);
    });
    this.router.get(Routes.COMPANY_ADMIN.GET_COMPANY_USERS,checkRoleBasedMiddleware(["companyAdmin"]),(req:Request,res:Response)=>{
      injectCompanyUserController.getUsers(req,res);
    });
     
    this.router.get(Routes.COMPANY_ADMIN.GET_ADMIN_LESSONS,checkRoleBasedMiddleware(["companyAdmin"]),(req:Request,res:Response)=>{
      injectCompanyLessonManageController.getAdminLessons(req,res);
    });
    this.router.post(Routes.COMPANY_ADMIN.ASSIGN_LESSON,checkRoleBasedMiddleware(["companyAdmin"]),(req:Request,res:Response)=>{
      injectCompanyLessonManageController.assignLessons(req,res);
    });
    this.router.post(Routes.COMPANY_ADMIN.CREATE_COMPANY_GROUP,checkRoleBasedMiddleware(['companyAdmin']),(req:Request,res:Response)=>{
      injectCompanyGroupController.createGroup(req,res)
    })
    this.router.get(Routes.COMPANY_ADMIN.GET_COMPANY_GROUPS,checkRoleBasedMiddleware(['companyAdmin']),(req:Request,res:Response)=>{
      injectCompanyGroupController.getCompanyGroups(req,res)
    })
    
  }
  getRouter() {
    return this.router;
  }
}
