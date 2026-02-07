import {  Response } from "express";
import { AuthRequest } from "../../../types/AuthRequest";
import { MESSAGES } from "../../../domain/constants/messages";
import { ICreateSoloPlayUseCase } from "../../../application/use-cases/interfaces/user/soloPlayUserCases/ICreateSoloPlayUseCase";
import { ISoloPlayResultUseCase } from "../../../application/use-cases/interfaces/user/soloPlayUserCases/ISoloPlayResultUseCase";
export class SoloPlayController {
    constructor(
        private _createSoloPlayUseCase:ICreateSoloPlayUseCase,
        private _soloPlayResultUseCase:ISoloPlayResultUseCase
    ){

    }

    async  createSoloPlay(req:AuthRequest,res:Response):Promise<void>{
        try{
        const userId=req.user?.userId;
        if(!userId){
            throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
        }
        const soloPlay=await this._createSoloPlayUseCase.execute(userId);
        
        res.status(200).json({
            message:"Solo play created successfully",
            data:soloPlay
        });
        
        }
        catch(error:any){
            console.log("error",error);
            res.status(500).json({
                message:error.message
            });
        }
    }


      async result(req:AuthRequest,res:Response):Promise<void>{
        try{
        const userId=req.user?.userId;
        const gameId=req.params.gameId;
        const result=req.body;
        if(!userId){
            throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
        }
        if(!gameId){
            throw new Error(MESSAGES.GAME_ID_NOT_FOUND);
        }
        await this._soloPlayResultUseCase.execute(userId,gameId,result);
        }
        catch(error:any){
            console.log(error);
        }
      }

}