import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { userRouter } from "./presentation/routes/authRoutes";
import { authRepository } from "./infrastructure/db/repositories/auth/authRepository";
dotenv.config();
export class app{
    public app:Application;
    constructor(){
        this.app=express();
        this.setMiddleWares();
        this.setUserRoutes();
    }
      setMiddleWares(){
        this.app.use(cors({
            origin:"http://localhost:5173",
            credentials: true
        })); 
        this.app.use(express.json());
        
    }
 
    private setUserRoutes(){
        const routerUser=new userRouter();
        this.app.use("/",routerUser.getRouter());

    }
    public async connectDatabase(){
        const db=new connectDB();
        await db.connectDatabase();
    }

}
