import express,{Request,Response} from "express";
import { IRegisterUseCase } from "../../../domain/interfaces/usecases/auth/IRegisterUseCase";
import { ICompleteSignupUseCase } from "../../../domain/interfaces/usecases/auth/ICompleteSignupUseCase";
import logger from "../../../utils/logger";


export class registerController{
    constructor(
        private _RegisterUser:IRegisterUseCase,
        private _completeSignupUseCase:ICompleteSignupUseCase
    ){
    }
    async register(req:Request,res:Response):Promise<any>{
        try{
        const {name,email,password}=req.body;
        logger.info(name)
        if(!name||!email||!password){
            throw new Error("All fields are required");

        }
        await this._RegisterUser.createUser({name,email,password});
        console.log("helo");
        res.status(200).json({ message: "Email sent successfully" });        
        }
        catch(error){
        res.status(500).json({ message: "Something went wrong" });
        }
    }
    async verifyOtp(req:Request,res:Response):Promise<void>{
        try{
            const {otp,name,email,password}=req.body;
            logger.info(req.body);
            await this._completeSignupUseCase.otp(otp,name,email,password);

           
        }
        catch(error){
            console.log(error);
        }
    }
}