import {ICreateGroupPlayRoomUseCase} from "../../interfaces/user/groupplayUseCases/ICreateGroupPlayRoomUseCase";
import { GroupEntity } from "../../../../domain/entities/GroupEntity";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import crypto from "crypto";
import { groupDTO, mapGroupToDTO } from "../../../DTOs/user/groupDto";

function generateJoinCode(): string {
  return crypto.randomBytes(4).toString("hex");
}

export class CreateGroupPlayRoomUseCase implements ICreateGroupPlayRoomUseCase {
constructor(
    private _baseRepoGroup: IBaseRepository<any>,
    private _baseRepoUser:IBaseRepository<any>

) {}
async execute(hostUserId: string): Promise<groupDTO> {
    if (!hostUserId) {
        throw new Error("Host user ID is required to create a group play room.");
    }
    const joinCode=await generateJoinCode();
    const group = new GroupEntity({
        name: "Group Play Room",
        ownerId: hostUserId,
        difficulty: "easy",
        joinLink:joinCode,  
    });
    const groupCreated = await this._baseRepoGroup.create(group);
     groupCreated.members=await Promise.all(
      groupCreated.members.map(async(item: any) =>{
          const memberId=item.toString();
          const member= await  this._baseRepoUser.findById(memberId);
          return{
            userId:member._id,
            name:member.name,
            imageUrl:member.imageUrl,
            isHost:member._id.toString()==groupCreated.ownerId.toString()
          };
          
      }
      )
    );
    return mapGroupToDTO(groupCreated);
}
}