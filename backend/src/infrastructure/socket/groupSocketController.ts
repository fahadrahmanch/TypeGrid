import { IRemoveMemberGroupPlayGroupUseCase } from "../../application/use-cases/interfaces/user/groupplayUseCases/IRemoveMemberGroupPlayGroupUseCase";

export class GroupSocketController{
    constructor(
        private _removeMemberGroupPlayGroupUseCase:IRemoveMemberGroupPlayGroupUseCase
    ){}
    async handleDisconnect(socket:any,io:any){
        const {groupId,userId}=socket.data
        if(!groupId||!userId){
            return
        }
        try{
            const updateGroup=await this._removeMemberGroupPlayGroupUseCase.execute(groupId,userId,"LEAVE")
            io.to(groupId).emit("remove-player", {
                group:updateGroup
            })

        }catch(error:any){
            console.log(error)
        }
    }

    async handleLeaveGroupPlay(socket:any,io:any){
        
        console.log("handleLeaveGroupPlay",socket.data)
        
      
    }        

}
