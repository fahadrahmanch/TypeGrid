import { ILoginUseCase } from "../../../../domain/interfaces/usecases/auth/ILoginUseCase";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/IAuthRepository";
import { IHashService } from "../../../../domain/interfaces/services/IHashService";
import { AuthUserEntity } from "../../../../domain/entities";
import { MESSAGES } from "../../../../domain/constants/messages";
export class loginUseCase implements ILoginUseCase {
    constructor(
        private _AuthRepository: IAuthRepostory,
        private _hashService: IHashService
    ) { }
    async execute(email: string, password: string): Promise<AuthUserEntity | void> {
        const user = await this._AuthRepository.findByEmail(email);
        if (!user) {
            throw new Error(MESSAGES.USER_DETAILS_NOT_FOUND);
        };
        if (user.status != "block") {
            const verified = await this._hashService.compare(
                password,
                user.password
            );
            if (verified) {
                return new AuthUserEntity({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    status: user.status,
                    CompanyId:user?.CompanyId,
                    role: user.role,
                });
            } else {
                throw new Error(MESSAGES.AUTH_INCORRECT_PASSWORD);
            }
        } else {
            throw new Error(MESSAGES.AUTH_ACCOUNT_BLOCKED);
        }
    }
}