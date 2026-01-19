import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { groupDTO } from "../../../DTOs/user/groupDto";
import { mapGroupToDTO } from "../../../DTOs/user/groupDto";   
import { IGetGroupPlayGroupUseCase } from "../../interfaces/user/groupplayUseCases/IGetGroupPlayGroupUseCase";
export class getGroupPlayGroupUseCase implements IGetGroupPlayGroupUseCase{
    constructor(
        private _baseRepoGroup: IBaseRepository<any>,
        private _baseRepoUser:IBaseRepository<any>
    ) {}
    async execute(joinLink: string,userId:string): Promise<groupDTO> {
        const group=await this._baseRepoGroup.findOne({joinLink:joinLink});
        if(!group){
            throw new Error("Group not found with the provided join link.");
        }
        
      group.members=await Promise.all(
      group.members.map(async(item: any) =>{
          const memberId=item.toString()
          const member= await  this._baseRepoUser.findById(memberId)
          return{
            userId:member._id,
            name:member.name,
            imageUrl:member.imageUrl,
            isHost:member._id.toString()===group.ownerId.toString(),
            
          }
      }
    )
);
        group.currentUserId=userId
        return mapGroupToDTO(group);
    }
} 