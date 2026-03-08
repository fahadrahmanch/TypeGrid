import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { CustomError } from "../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../domain/enums/http-status-codes.enum";
import { IChangePasswordUseCase } from "../interfaces/user/change-password.interface";
import { IHashService } from "../../../domain/interfaces/services/hash-service.interface";

export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(
    private readonly baseUserRepository: IUserRepository,
    private readonly hashProvider: IHashService,
  ) {}

  async execute(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.baseUserRepository.findById(userId);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }

    const isPasswordValid = await this.hashProvider.compare(
      currentPassword,
      (user as any).password,
    );
    if (!isPasswordValid) {
      throw new CustomError(
        HttpStatusCodes.UNAUTHORIZED,
        MESSAGES.INVALID_CURRENT_PASSWORD,
      );
    }

    const hashedPassword = await this.hashProvider.hash(newPassword);
    (user as any).password = hashedPassword;
    await this.baseUserRepository.update(user);
  }
}
