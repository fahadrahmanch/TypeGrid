import { ICreateNewPasswordUseCase } from "../../interfaces/auth/ICreateNewPasswordUseCase";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/IAuthRepository";
import { IHashService } from "../../../../domain/interfaces/services/IHashService";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
export class createNewPassword implements ICreateNewPasswordUseCase {
  constructor(
    private _authRepository: IAuthRepostory,
    private _hashServie: IHashService,
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
