import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { CustomError } from "../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../domain/enums/http-status-codes.enum";
import { IUpdateCompanyPasswordUseCase } from "../interfaces/companyUser/update-password.interface";
import { IHashService } from "../../../domain/interfaces/services/hash-service.interface";

export class UpdateCompanyPasswordUseCase implements IUpdateCompanyPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService
  ) {}

  async execute(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    const isPasswordValid = await this.hashService.compare(currentPassword, (user as any).password);
    if (!isPasswordValid) {
      throw new CustomError(HttpStatusCodes.UNAUTHORIZED, MESSAGES.INVALID_CURRENT_PASSWORD);
    }

    const hashedPassword = await this.hashService.hash(newPassword);
    (user as any).password = hashedPassword;
    await this.userRepository.update(user);
  }
}
