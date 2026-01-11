import { IEditGroupPlayUseCase } from "../../interfaces/user/groupplayUseCases/IEditGroupPlayUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
export class editGroupUseCase implements IEditGroupPlayUseCase{
    constructor(
        private _baseRepoGroup:IBaseRepository<any>
    ){}
    async execute(difficulty:string,maxPlayers:number):Promise<void>{
        
    }
    
   
}
