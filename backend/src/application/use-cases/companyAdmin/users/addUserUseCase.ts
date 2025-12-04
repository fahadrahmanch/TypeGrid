import { IAddUserUseCase } from "../../../../domain/interfaces/usecases/companyAdmin/IAddUserUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/user/IBaseRepository";
import { User } from "../../../../infrastructure/db/models/userSchema";
import { AuthUserEntity } from "../../../../domain/entities";
import { IHashService } from "../../../../domain/interfaces/services/IHashService";

export class addUserUseCase implements IAddUserUseCase{
    constructor(
        private _baseRepository:IBaseRepository<any>,
        private _hashService:IHashService,
    ){}
    async addUser(data:any):Promise<void>{
     const exists = await this._baseRepository.FindByEmail(data.email);
        if (exists) {
            throw new Error("User already exists with this email");
        }
        const hashedPassword = await this._hashService.hash(data.password);
        const newUser = new AuthUserEntity({
          name: data.name,
          email: data.email,
          password: hashedPassword,
          CompanyId:data.CompanyId,
          role: data.role||'companyUser',
          KeyBoardLayout: "QWERTY",
          status: "active",
        });
        await this._baseRepository.create(newUser);
    }
}