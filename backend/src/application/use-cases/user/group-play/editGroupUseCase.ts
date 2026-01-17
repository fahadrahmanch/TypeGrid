import { IEditGroupPlayUseCase } from "../../interfaces/user/groupplayUseCases/IEditGroupPlayUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { GroupEntity } from "../../../../domain/entities/GroupEntity";
import { mapGroupToDTO } from "../../../DTOs/user/groupDto";
import { groupDTO } from "../../../DTOs/user/groupDto";
type Difficulty = "easy" | "medium" | "hard";
export class editGroupUseCase implements IEditGroupPlayUseCase{
    constructor(
        private _baseRepoGroup:IBaseRepository<any>
    ){}
    async execute(groupId:string,difficulty:Difficulty,maxPlayers:number,userId:string):Promise<groupDTO>{
        console.log("editGroupUseCase",groupId,difficulty,maxPlayers,userId)
        const group=await this._baseRepoGroup.findById(groupId)
        if(!group){
            throw new Error("Group not found with the provided group ID.")
        }
        const groupEntity=new GroupEntity(group)
        if(groupEntity.getOwnerId()!=userId){
            throw new Error("Only host can edit group settings");
        }
         groupEntity.changeDifficulty(difficulty )
         groupEntity.changeMaximumPlayers(maxPlayers)
         const groupObject=await groupEntity.toObject()
         const updatedGroup= await this._baseRepoGroup.update(groupObject)
         
         return mapGroupToDTO({
           ...updatedGroup,
           currentUserId: userId,
         });

    }
    
   
}
