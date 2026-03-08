import { IFindUserUseCase } from "../interfaces/user/IFindUserUseCase";
import { IUserRepository } from "../../../domain/interfaces/repository/user/IUserRepository";
import { AuthUserEntity } from "../../../domain/entities";
export class findUserUseCase implements IFindUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(email: string): Promise<AuthUserEntity | null> {
    return await this.userRepository.FindByEmail(email);
  }
}
