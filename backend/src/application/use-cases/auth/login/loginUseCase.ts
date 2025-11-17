import { ILoginUseCase } from "../../../../domain/interfaces/usecases/auth/ILoginUseCase";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/IAuthRepository";
import { IHashService } from "../../../../domain/interfaces/services/IHashService";
import { AuthUserEntity } from "../../../../domain/entities";
export class loginUseCase implements ILoginUseCase {
    constructor(
        private _AuthRepository: IAuthRepostory,
        private _hashService: IHashService
    ) { }
    async execute(email: string, password: string): Promise<AuthUserEntity | void> {
        console.log(email, password)
        const user = await this._AuthRepository.findByEmail(email);
        console.log(user)
        if (!user) {
            throw new Error("We couldn’t find a user with the provided details")
        };
        if (user.status != "block") {
            const verified = await this._hashService.compare(
                password,
                user.password
            );
            if (verified) {
                return new AuthUserEntity({
                    _id:user._id,
                    name: user.name,
                    email: user.email,
                    password:user.password,
                    status: user.status,
                    role: user.role,
                });
            } else {
                throw new Error("The password you entered is incorrect.")
            }
        } else {
            throw new Error("Access denied. This account is blocked.")
        }
    }
}