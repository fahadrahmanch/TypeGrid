import { IUserUpdateUseCase } from "../interfaces/user/user-update.interface";
import { AuthUserEntity } from "../../../domain/entities";
import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
export class UpdateUserUseCase implements IUserUpdateUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(data: any): Promise<void> {
    await this.userRepository.update(data);
  }
}
