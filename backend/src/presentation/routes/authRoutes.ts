import express,{Request,Response} from "express";
import { Routes } from "../../domain/constants/routes";
import { injectAuthController } from "../DI/auth";
export class userRouter{
    private router:express.Router;
    constructor(){
    this.router=express.Router();
    this.initializeRoutes();
    }
    initializeRoutes(){
    this.router.post(Routes.AUTH.SIGNUP,(req:Request,res:Response)=>{
        injectAuthController.register(req,res);
    });
    this.router.post(Routes.AUTH.VERIFY_OTP,(req:Request,res:Response)=>{
        injectAuthController.verifyOtp(req,res);
    });
    this.router.post(Routes.AUTH.RESENT_OTP,(req:Request,res:Response)=>{
        injectAuthController.resentOtp(req,res);
    });
    this.router.post(Routes.AUTH.SIGNIN,(req:Request,res:Response)=>{
        injectAuthController.signin(req,res);
    });
    this.router.post(Routes.AUTH.REFRESH_TOKEN,(req:Request,res:Response)=>{
        injectAuthController.refreshToken(req,res);
    });
    this.router.post(Routes.AUTH.GOOGLE_AUTH,(req:Request,res:Response)=>{
        injectAuthController.googleAuth(req,res);
    });
    this.router.post(Routes.AUTH.LOGOUT,(req:Request,res:Response)=>{
        injectAuthController.logout(req,res)
    })
    }
    getRouter(){
        return this.router;
    }
}