import { IFindUserUseCase } from "../interfaces/user/IFindUserUseCase";
import { IBaseRepository } from "../../../domain/interfaces/repository/IBaseRepository";
import { AuthUserEntity } from "../../../domain/entities";
export class findUserUseCase implements IFindUserUseCase{
constructor(
private _baseRepository:IBaseRepository< AuthUserEntity>
){}
async execute(email: string): Promise<AuthUserEntity | null> {
    return await this._baseRepository.FindByEmail(email);
}


}