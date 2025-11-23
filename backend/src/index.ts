import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { authRouter } from "./presentation/routes/authRoutes";
import cookieParser from "cookie-parser";
import { adminRouter } from "./presentation/routes/adminRoutes";
dotenv.config();
export class app{
    public app:Application;
    constructor(){
        this.app=express();
        
        this.setMiddleWares();
        this.setAuthRoutes();
        this.setAdminRoutes()
    }
      setMiddleWares(){
        this.app.use(cors({
            origin:"http://localhost:5173",
            credentials: true
        })); 
        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        
    }
 
    private setAuthRoutes(){
        const routerUser=new authRouter();
        this.app.use("/",routerUser.getRouter());

    }
    private setAdminRoutes(){
        const routerAdmin=new adminRouter()
        this.app.use("/admin",routerAdmin.getRouter())
    }
    public async connectDatabase(){
        const db=new connectDB();
        await db.connectDatabase();
    }

}
