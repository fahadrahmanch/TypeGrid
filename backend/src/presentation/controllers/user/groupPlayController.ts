import { join } from "path";
import { Request, Response } from "express";
import { ICreateGroupPlayRoomUseCase } from "../../../application/use-cases/interfaces/user/groupplayUseCases/ICreateGroupPlayRoomUseCase";
import { IGetGroupPlayGroupUseCase } from "../../../application/use-cases/interfaces/user/groupplayUseCases/IGetGroupPlayGroupUseCase";
import { AuthRequest } from "../../../types/AuthRequest";
import { MESSAGES } from "../../../domain/constants/messages";
import { IEditGroupPlayUseCase } from "../../../application/use-cases/interfaces/user/groupplayUseCases/IEditGroupPlayUseCase";
import { IJoinGroupPlayGroupUseCase } from "../../../application/use-cases/interfaces/user/groupplayUseCases/IIJoinGroupPlayGroupUseCase";
import { IRemoveMemberGroupPlayGroupUseCase } from "../../../application/use-cases/interfaces/user/groupplayUseCases/IRemoveMemberGroupPlayGroupUseCase";
import { Console } from "console";
export class groupPlayController{
    constructor(
        private _createGroupPlayRoomUseCase: ICreateGroupPlayRoomUseCase,
        private _getGroupPlayGroupUseCase:IGetGroupPlayGroupUseCase,
        private _editGroupPlayGroupUseCase:IEditGroupPlayUseCase, 
        private _joinGroupPlayGroupUseCase:IJoinGroupPlayGroupUseCase,
        private _removeMemberGroupPlayGroupUseCase:IRemoveMemberGroupPlayGroupUseCase
    ){}

    async createGroup(req:AuthRequest,res:Response):Promise<void>{
        try{
            const hostUserId = req.user?.userId;
            if(!hostUserId){
                throw new Error(MESSAGES.UNAUTHORIZED)

            }
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

    async getGroup(req:AuthRequest,res:Response):Promise<void>{
        try{
            const joinLink=req.params.joinLink;
            const userId=req.user?.userId
            if(!userId)return
            if(!joinLink){
                throw new Error("Join ID is required to fetch group details.");
            }
            const group=await this._getGroupPlayGroupUseCase.execute(joinLink,userId);
            console.log("group here",group)
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
    
    async editGroup(req:AuthRequest,res:Response):Promise<void>{
        try{
        const {difficulty,maxPlayers}=req.body
        const groupId=req.params.groupId
        if(!groupId){
            throw new Error("Group ID is required to edit group details.")
        }
        const userId=req.user?.userId
        if(!difficulty&&!maxPlayers){
            throw new Error("Difficulty and max players are required");
        }
        if(!userId){
            throw new Error(MESSAGES.UNAUTHORIZED)
        }
        await this._editGroupPlayGroupUseCase.execute(groupId,difficulty,maxPlayers,userId)
         res.status(200).json({
             success:true,
             message:"Group edited successfully"
         })
        }
        catch(error:any){
            console.log(error)
            res.status(500).json({
                success:false,
                message:error.message || "Internal Server Error"
            });
        }
    }
    async joinGroup(req:AuthRequest,res:Response):Promise<void>{
        try{
            const joinLink=req.params.joinLink;
            const userId=req.user?.userId
            console.log("userId",userId)
            if(!joinLink){
                throw new Error("Join ID is required to join group.");
            }
            if(!userId){
                throw new Error(MESSAGES.UNAUTHORIZED)
            }
            await this._joinGroupPlayGroupUseCase.execute(joinLink,userId)
            res.status(200).json({
                success:true,
                message:"Joined group successfully"
            })
        }
        catch(error:any){
            console.log(error)
            res.status(500).json({
                success:false,
                message:error.message || "Internal Server Error"
            });
        }
    }

    async removeMember(req:AuthRequest,res:Response):Promise<void>{
        try{
            const groupId=req.params.groupId;
            const userId=req.params.playerId
            if(!groupId){
                throw new Error("Group ID is required to remove member.");
            }
            if(!userId){
                throw new Error(MESSAGES.UNAUTHORIZED)
            }
            const group=await this._removeMemberGroupPlayGroupUseCase.execute(groupId,userId)
            res.status(200).json({
                success:true,
                message:"Member removed successfully",
                group,
            })
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