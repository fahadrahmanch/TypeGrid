import { IFindUserUseCase } from "../interfaces/user/find-user.interface";
import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { AuthUserEntity } from "../../../domain/entities";
export class FindUserUseCase implements IFindUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(email: string): Promise<AuthUserEntity | null> {
    return await this.userRepository.FindByEmail(email);
  }
}
