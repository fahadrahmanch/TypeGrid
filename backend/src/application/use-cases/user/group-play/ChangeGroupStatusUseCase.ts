import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { IChangeGroupStatusUseCase } from "../../interfaces/user/groupplayUseCases/IChangeGroupStatusUseCase";
export class ChangeGroupStatusUseCase implements IChangeGroupStatusUseCase{
    constructor(
        private _baseRepoGroup:IBaseRepository<any>
    ){}
    async changeGroupStatus(groupId:string,status:string){
        const group=await this._baseRepoGroup.findById(groupId);
        if(!group){
            throw new Error("Group not found with the provided group ID.");
        }
        group.status=status;
        await this._baseRepoGroup.update(group);
    }
}