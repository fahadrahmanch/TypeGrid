import express,{Request,Response} from "express";
import { Routes } from "../../domain/constants/routes";
import { injectRegisterController } from "../DI/auth";
export class userRouter{
    private router:express.Router;
    constructor(){
    this.router=express.Router();
    this.initializeRoutes();
    }
    initializeRoutes(){
    this.router.post(Routes.AUTH.SIGNUP,(req:Request,res:Response)=>{
        injectRegisterController.register(req,res);
    });
    this.router.post(Routes.AUTH.VERIFY_OTP,(req:Request,res:Response)=>{
        injectRegisterController.verifyOtp(req,res);
    });
    }
    getRouter(){
        return this.router;
    }
}