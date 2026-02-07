import { IRemoveMemberGroupPlayGroupUseCase } from "../../application/use-cases/interfaces/user/groupplayUseCases/IRemoveMemberGroupPlayGroupUseCase";
import { IValidateGroupPlayMemberUseCase } from "../../application/use-cases/interfaces/user/groupplayUseCases/IValidateGroupPlayMemberUseCase";
import { GroupPlayResult } from "../../application/DTOs/user/groupPlayDTO";
import { IFinishGroupPlayUseCase } from "../../application/use-cases/interfaces/user/groupplayUseCases/IFinishGroupPlayUseCase";
export class GroupSocketController{
    constructor(
        private _removeMemberGroupPlayGroupUseCase:IRemoveMemberGroupPlayGroupUseCase,
        private _validateGroupPlayMemberUseCase:IValidateGroupPlayMemberUseCase,
        private _finishGroupPlayUseCase:IFinishGroupPlayUseCase,
    ){}
    async handleDisconnect(socket:any,io:any){
        console.log("Handling disconnect for socket:", socket.id);
        const {groupId,userId}=socket.data;
        if(!groupId||!userId){
            return;
        }
        try{
            const updateGroup=await this._removeMemberGroupPlayGroupUseCase.execute(groupId,userId,"LEAVE");
      
            const newHosrId=updateGroup.ownerId;
            io.to(groupId).emit("player-left", {
                userId:userId,
                newHostId:newHosrId,
                members:updateGroup.members
            });

        }catch(error:any){
            console.log(error);
        }
    }

    async getGroup(gameId:string,userId:string):Promise<boolean | undefined>{
       try{
        const isMember=await this._validateGroupPlayMemberUseCase.execute(gameId,userId);
        return isMember;
       }catch(error:any){
        console.log("Error in getGroup:",error);

       }
    }     

    async groupLeave(socket:any,io:any){
        const {groupId,userId}=socket.data;
        if(!groupId||!userId){
            return;
        }
        try{
            const updateGroup=await this._removeMemberGroupPlayGroupUseCase.execute(groupId,userId,"LEAVE");
            const newHostId=updateGroup.ownerId;
            io.to(groupId).emit("player-left", {
                members:updateGroup.members,
                newHostId: newHostId
            });

        }catch(error:any){
            console.log(error);
        }
    }

    async saveGroupPlayResult(gameId:string,resultArray:GroupPlayResult[]):Promise<void>{
        try{
        await this._finishGroupPlayUseCase.execute(gameId,resultArray);
        }
        catch(error:any){
            console.log("Error in saveGroupPlayResult:",error);
        }
    }   

}
