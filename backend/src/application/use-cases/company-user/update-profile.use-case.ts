import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { IUpdateProfileUseCase } from "../interfaces/companyUser/update-profile.interface";

export class UpdateProfileUseCase implements IUpdateProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) { }

  async execute(userId: string, data: string): Promise<void> {
    await this.userRepository.updateById(userId, { imageUrl: data });
  }
}
