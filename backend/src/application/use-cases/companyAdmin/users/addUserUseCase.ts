import { IAddUserUseCase } from "../../../../domain/interfaces/usecases/companyAdmin/IAddUserUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/user/IBaseRepository";
import { AuthUserEntity } from "../../../../domain/entities";
import { IHashService } from "../../../../domain/interfaces/services/IHashService";
import { MESSAGES } from "../../../../domain/constants/messages";


export class addUserUseCase implements IAddUserUseCase{
    constructor(
        private _baseRepository:IBaseRepository<any>,
        private _hashService:IHashService,
    ){}
    async addUser(data:any):Promise<AuthUserEntity>{
     const exists = await this._baseRepository.FindByEmail(data.email);
        if (exists) {
            throw new Error(MESSAGES.AUTH_EMAIL_EXISTS);
        }
        const hashedPassword = await this._hashService.hash(data.password);
        const newUser = new AuthUserEntity({
          name: data.name,
          email: data.email,
          password: hashedPassword,
          CompanyId:data.CompanyId,
          role: data.role||"companyUser",
          KeyBoardLayout: "QWERTY",
          status: "active",
        });
        return  await this._baseRepository.create(newUser);
    }
}