import { ICreateNewPasswordUseCase } from "../../../../domain/interfaces/usecases/auth/ICreateNewPasswordUseCase";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/IAuthRepository";
import { IHashService } from "../../../../domain/interfaces/services/IHashService";
export class createNewPassword implements ICreateNewPasswordUseCase{
    constructor(
        private _authRepository:IAuthRepostory,
        private _hashServie:IHashService
    ){}
    async execute(email:string,password:string):Promise<void>{
    if(!email){
        throw new Error("something went wrong")
    }
    if(!password){
        throw new Error("password is required")
    }
    const user=await this._authRepository.findByEmail(email)
    if(!user){
        throw new Error("user not found")
    }
    const hashedPassword=await this._hashServie.hash(password)
    user.password=hashedPassword
    await this._authRepository.update(user);
    }
}