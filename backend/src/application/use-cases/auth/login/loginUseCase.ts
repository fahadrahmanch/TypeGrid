import { ILoginUseCase } from "../../interfaces/auth/ILoginUseCase";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/IAuthRepository";
import { IHashService } from "../../../../domain/interfaces/services/IHashService";
import { AuthUserEntity } from "../../../../domain/entities";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
export class loginUseCase implements ILoginUseCase {
  constructor(
    private _AuthRepository: IAuthRepostory,
    private _hashService: IHashService,
  ) {}
  async execute(
    email: string,
    password: string,
  ): Promise<AuthUserEntity | void> {
    const user = await this._AuthRepository.findByEmail(email);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.USER_DETAILS_NOT_FOUND,
      );
    }
    if (!user.password) {
      throw new CustomError(
        HttpStatusCodes.UNAUTHORIZED,
        MESSAGES.AUTH_INCORRECT_PASSWORD,
      );
    }
    if (user.status != "block") {
      const verified = await this._hashService.compare(password, user.password);
      if (verified) {
        return new AuthUserEntity({
          _id: user._id?.toString(),
          name: user.name,
          email: user.email,
          password: user.password ?? "",
          status: user.status,
          CompanyId: user?.CompanyId?.toString(),
          role: user.role,
        });
      } else {
        throw new CustomError(
          HttpStatusCodes.UNAUTHORIZED,
          MESSAGES.AUTH_INCORRECT_PASSWORD,
        );
      }
    } else {
      throw new CustomError(
        HttpStatusCodes.FORBIDDEN,
        MESSAGES.AUTH_ACCOUNT_BLOCKED,
      );
    }
  }
}
