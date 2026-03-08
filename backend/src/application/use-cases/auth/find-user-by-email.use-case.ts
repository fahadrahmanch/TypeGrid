import { IFindUserByemailUseCase } from "../interfaces/auth/find-user-by-email.interface";
import { IAuthRepostory } from "../../../domain/interfaces/repository/user/auth-repository.interface";

export class FindUserByEmailUseCase implements IFindUserByemailUseCase {
  constructor(private _authRepository: IAuthRepostory) {}
  async execute(email: string) {
    return await this._authRepository.findByEmail(email);
  }
}
