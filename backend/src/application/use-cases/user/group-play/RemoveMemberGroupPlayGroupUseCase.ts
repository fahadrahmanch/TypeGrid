import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository"
import { IRemoveMemberGroupPlayGroupUseCase } from "../../interfaces/user/groupplayUseCases/IRemoveMemberGroupPlayGroupUseCase"
import { GroupEntity } from "../../../../domain/entities/GroupEntity"
import { groupDTO, mapGroupToDTO } from "../../../DTOs/user/groupDto"
export class RemoveMemberGroupPlayGroupUseCase implements IRemoveMemberGroupPlayGroupUseCase{
    constructor(
        private _baseRepoGroup:IBaseRepository<any>,
        private _baseRepoUser:IBaseRepository<any>
    ){}
    async execute(groupId:string,userId:string, reason: "KICK" | "LEAVE"):Promise<groupDTO>{
      const group=await this._baseRepoGroup.findById(groupId)
      if(!group){
        throw new Error("Group not found")
      }
      const user=await this._baseRepoUser.findById(userId)
      if(!user){
        throw new Error("User not found")
      }
      const groupEntity=new GroupEntity(group)
      console.log("group members",groupEntity.getMembers())
      groupEntity.removeMember(userId)
      if(group.ownerId.toString()==userId){
        const pickOnehoster=groupEntity.getMembers().find((memberId:string)=>memberId!=userId)
        if(pickOnehoster){
          groupEntity.setOwner(pickOnehoster.toString())
        }
       
      }
      if(reason==="KICK"){
        groupEntity.kickUser(userId)
      }
      
      const kickedUsers=groupEntity.getKickedUsers()
        const updatedGroup = await this._baseRepoGroup.update({
      _id: groupId,
      members: groupEntity.getMembers(),
      kickedUsers,
      ownerId:groupEntity.getOwnerId()
    });
    const members = await Promise.all(
      updatedGroup.members.map(async (memberId: any) => {
        const member = await this._baseRepoUser.findById(memberId);
        return {
          userId: member._id?.toString(),
          name: member.name,
          imageUrl: member.imageUrl,
          isHost:
          member._id?.toString() === updatedGroup.ownerId?.toString(),
          
        };
      })
    );
    return mapGroupToDTO({
      ...updatedGroup,
      members,
      
    });
    }
}