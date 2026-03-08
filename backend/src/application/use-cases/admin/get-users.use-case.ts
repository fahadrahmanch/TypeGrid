import { IGetUsersUseCase } from "../interfaces/admin/get-users.interface";
import { AuthUserEntity } from "../../../domain/entities";
import { IAuthRepostory } from "../../../domain/interfaces/repository/user/auth-repository.interface";
export class GetUsersUseCase implements IGetUsersUseCase {
  constructor(private authRepository: IAuthRepostory) {}
  async execute(): Promise<AuthUserEntity[]> {
    const users = await this.authRepository.find({ role: "user" });
    return users as any;
  }
}
