import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { IJoinGroupPlayGroupUseCase } from "../../interfaces/user/groupplayUseCases/IIJoinGroupPlayGroupUseCase";
import { GroupEntity } from "../../../../domain/entities/GroupEntity";
export class joinGroupPlayGroupUseCase implements IJoinGroupPlayGroupUseCase {
    constructor(
        private _baseRepoGroup: IBaseRepository<any>,
        private _baseRepoUser:IBaseRepository<any>
    ) {}
    async execute(joinLink: string, userId: string): Promise<void> {
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


    await this._baseRepoGroup.update({
      _id: group._id,
      members: groupEntity.getMembers(),
    });
    }
}