import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { IJoinGroupPlayGroupUseCase } from "../../interfaces/user/groupplayUseCases/IIJoinGroupPlayGroupUseCase";
import { GroupEntity } from "../../../../domain/entities/GroupEntity";
import { mapGroupToDTO } from "../../../DTOs/user/groupDto";
import { groupDTO } from "../../../DTOs/user/groupDto";
export class joinGroupPlayGroupUseCase implements IJoinGroupPlayGroupUseCase {
    constructor(
        private _baseRepoGroup: IBaseRepository<any>,
        private _baseRepoUser:IBaseRepository<any>
    ) {}
    async execute(joinLink: string, userId: string): Promise<groupDTO> {
        if (!joinLink || !userId) {
            throw new Error("Join link and user ID are required to join a group.");
        }
        const group = await this._baseRepoGroup.findOne({ joinLink });
        
        if (!group) {
            throw new Error("Group not found with the provided join link.");
        }
        const user = await this._baseRepoUser.findById(userId);
        if (!user) {
            throw new Error("User not found with the provided user ID.");
        }
     
        const groupEntity = new GroupEntity(group);
       groupEntity.addMember(userId);


   const updatedGroup= await this._baseRepoGroup.update({
      _id: group._id,
      members: groupEntity.getMembers(),
    });
         updatedGroup.members=await Promise.all(
      updatedGroup.members.map(async(item: any) =>{
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
    return mapGroupToDTO({
        ...updatedGroup,
        // currentUserId:userId
    })
    }
}