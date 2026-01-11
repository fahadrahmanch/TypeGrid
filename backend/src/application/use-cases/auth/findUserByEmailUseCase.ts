import { IFindUserByemailUseCase } from "../interfaces/auth/IFindUserByEmailUseCase";
import { IAuthRepostory } from "../../../domain/interfaces/repository/user/IAuthRepository";

export class FindUserByIdEmailCase implements IFindUserByemailUseCase {
    constructor(
        private _authRepository: IAuthRepostory
    ) {}
    async execute(email: string) {
        return await this._authRepository.findByEmail(email);
    }
}
