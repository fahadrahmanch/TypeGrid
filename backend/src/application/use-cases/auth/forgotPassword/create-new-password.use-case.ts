import { ICreateNewPasswordUseCase } from "../../interfaces/auth/create-new-password.interface";
import { IAuthRepository } from "../../../../domain/interfaces/repository/user/auth-repository.interface";
import { IHashService } from "../../../../domain/interfaces/services/hash-service.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
/**
 * Use case for creating a new password during the forgot password flow.
 */
export class CreateNewPasswordUseCase implements ICreateNewPasswordUseCase {
  constructor(
    private readonly _authRepository: IAuthRepository,
    private readonly _hashServie: IHashService,
  ) {}
  async execute(email: string, password: string): Promise<void> {
    if (!email) {
      throw new CustomError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        MESSAGES.SOMETHING_WENT_WRONG,
      );
    }

    if (!password) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.PASSWORD_REQUIRED,
      );
    }
    const user = await this._authRepository.findByEmail(email);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }
    const hashedPassword = await this._hashServie.hash(password);
    user.password = hashedPassword;
    await this._authRepository.update(user);
  }
}
