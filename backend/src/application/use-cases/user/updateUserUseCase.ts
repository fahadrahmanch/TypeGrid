import { IUserUpdateUseCase } from "../interfaces/user/IUserUpdateUseCase";
import { AuthUserEntity } from "../../../domain/entities";
import { IUserRepository } from "../../../domain/interfaces/repository/user/IUserRepository";
export class updateUserUseCase implements IUserUpdateUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(data: any): Promise<void> {
    await this.userRepository.update(data);
  }
}
