import { IGetUsersUseCase } from "../../../domain/interfaces/usecases/admin/IGetUsersUseCase";
import { InterfaceUser } from "../../../domain/interfaces/usecases/user/InterfaceUser";
import { IAuthRepostory } from "../../../domain/interfaces/repository/user/IAuthRepository";
export class getUsersUseCase implements IGetUsersUseCase {
  constructor(private authRepository: IAuthRepostory) {}
  async execute(): Promise<InterfaceUser[]> {
    const users = await this.authRepository.find({role:"user"});
    return users;
  }
}
