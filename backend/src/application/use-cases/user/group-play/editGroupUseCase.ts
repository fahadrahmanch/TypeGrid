import { IEditGroupPlayUseCase } from "../../interfaces/user/groupplayUseCases/IEditGroupPlayUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { GroupEntity } from "../../../../domain/entities/GroupEntity";
import { mapGroupToDTO } from "../../../DTOs/user/groupDto";
import { groupDTO } from "../../../DTOs/user/groupDto";
export class editGroupUseCase implements IEditGroupPlayUseCase{
    constructor(
        private _baseRepoGroup:IBaseRepository<any>
    ){}
    async execute(groupId:string,difficulty:string,maxPlayers:number,userId:string):Promise<groupDTO>{
        const group=await this._baseRepoGroup.findById(groupId)
        if(!group){
            throw new Error("Group not found with the provided group ID.")
        }
        const groupEntity=new GroupEntity(group)
        if(groupEntity.getOwnerId()!=userId){
            throw new Error("Only host can edit group settings");
        }
         groupEntity.changeDifficulty(difficulty as "easy" | "medium" | "hard")
         groupEntity.changeMaximumPlayers(maxPlayers)
         const groupObject=await groupEntity.toObject()
         const updatedGroup= await this._baseRepoGroup.update(groupObject)
         
         return mapGroupToDTO({
           ...updatedGroup,
           currentUserId: userId,
         });

    }
    
   
}
