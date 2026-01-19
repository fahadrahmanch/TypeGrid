import { IGetUsersUseCase } from "../interfaces/admin/IGetUsersUseCase";
import { AuthUserEntity } from "../../../domain/entities";
import { IAuthRepostory } from "../../../domain/interfaces/repository/user/IAuthRepository";
export class getUsersUseCase implements IGetUsersUseCase {
  constructor(private authRepository: IAuthRepostory) {}
  async execute(): Promise<AuthUserEntity[]> {
    const users = await this.authRepository.find({role:"user"});
    return users;
  }
}
