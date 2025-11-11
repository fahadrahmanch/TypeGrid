import express,{Request,Response} from "express";
import { IRegisterUseCase } from "../../../../domain/interfaces/usecases/auth/IRegisterUseCase";
export class registerController{
    constructor(
        private RegisterUser:IRegisterUseCase
    ){
    }
    async register(req:Request,res:Response):Promise<void>{
        try{
        const {name,email,password}=req.body;
        console.log(req.body)
        if(!name||!email||!password){
            throw new Error("All fields are required");

        }
        const data =await this.RegisterUser.createUser({name,email,password})
        }
        catch(error){
            console.error("error: ",error);
        
        }
    }
    
}