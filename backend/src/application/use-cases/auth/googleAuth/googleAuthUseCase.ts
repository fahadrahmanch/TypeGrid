import { IGoogleAuthUseCase } from "../../interfaces/auth/IGoogleAuthUseCase";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/IAuthRepository";
import { AuthUserEntity } from "../../../../domain/entities";
import { MESSAGES } from "../../../../domain/constants/messages";
export class googleAuthUseCase implements IGoogleAuthUseCase {
    constructor(
        private _authRepository: IAuthRepostory
    ) { }
    async gooogleAuth(name: string, email: string, googleId: string): Promise<AuthUserEntity | void> {
        const user = await this._authRepository.findByEmail(email);
        if (!user) {
            const newUser = await new AuthUserEntity({
                name: name,
                email: email,
                googleId: googleId
            });
            return await this._authRepository.create(newUser);

        } else if (user) {
            if (user.status == "block") {
                throw new Error(MESSAGES.AUTH_ACCOUNT_BLOCKED);
            }
           
           return user;
        }
    }
}