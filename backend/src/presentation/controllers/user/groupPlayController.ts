import { join } from "path";
import { Request, Response } from "express";
import { ICreateGroupPlayRoomUseCase } from "../../../application/use-cases/interfaces/user/groupplayUseCases/ICreateGroupPlayRoomUseCase";
import { IGetGroupPlayGroupUseCase } from "../../../application/use-cases/interfaces/user/groupplayUseCases/IGetGroupPlayGroupUseCase";
import { AuthRequest } from "../../../types/AuthRequest";
import { MESSAGES } from "../../../domain/constants/messages";
import { IEditGroupPlayUseCase } from "../../../application/use-cases/interfaces/user/groupplayUseCases/IEditGroupPlayUseCase";
export class groupPlayController{
    constructor(
        private _createGroupPlayRoomUseCase: ICreateGroupPlayRoomUseCase,
        private _getGroupPlayGroupUseCase:IGetGroupPlayGroupUseCase,
        private _editGroupPlayGroupUseCase:IEditGroupPlayUseCase,
        
    ){

    }

    async createGroup(req:AuthRequest,res:Response):Promise<void>{
        try{
            const hostUserId = req.user?.userId;
            if(!hostUserId){
                throw new Error(MESSAGES.UNAUTHORIZED)
            }
            console.log("host user id",hostUserId);
            const group=await this._createGroupPlayRoomUseCase.execute(hostUserId);
            if (!group) {
                throw new Error("Failed to create group play room.");
            }

            res.status(201).json({
                success:true,
                message:"Room created successfully",
                group
            });
        }catch(error:any){
            console.error("Create Room Error:",error);
            res.status(500).json({
                success:false,
                message:error.message || "Internal Server Error"
            });
        }
    }

    async getGroup(req:Request,res:Response):Promise<void>{
        try{
            const joinLink=req.params.joinLink;
            if(!joinLink){
                throw new Error("Join ID is required to fetch group details.");
            }
            const group=await this._getGroupPlayGroupUseCase.execute(joinLink);
            if(!group){
                throw new Error("Group not found with the provided join ID.");
            }

            res.status(200).json({
                success:true,
                message:"Group fetched successfully",
                group
            });
        }catch(error:any){
            console.error("Get Group Error:",error);
            res.status(500).json({
                success:false,
                message:error.message || "Internal Server Error"
            });
        }
    }
    
    async editGroup(req:Request,res:Response):Promise<void>{
        try{
        const {difficulty,maxPlayers}=req.body
        if(!difficulty&&!maxPlayers){
            throw new Error("Difficulty and max players are required");
        }


        }
        catch(error:any){
            console.log(error)
            res.status(500).json({
                success:false,
                message:error.message || "Internal Server Error"
            });
        }
    }
}