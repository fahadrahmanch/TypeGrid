import { ILoginUseCase } from "../../interfaces/auth/login.interface";
import { IAuthRepository } from "../../../../domain/interfaces/repository/user/auth-repository.interface";
import { IHashService } from "../../../../domain/interfaces/services/hash-service.interface";
import { AuthUserEntity } from "../../../../domain/entities";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

export class LoginUseCase implements ILoginUseCase {

  constructor(
    private readonly _authRepository: IAuthRepository,
    private readonly _hashService: IHashService
  ) {}

  async execute(
    email: string,
    password: string,
    allowedRoles: string[]
  ): Promise<AuthUserEntity> {

    if (!email || !password) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.INVALID_REQUEST
      );
    }

    const user = await this._authRepository.findByEmail(email);

    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.USER_DETAILS_NOT_FOUND
      );
    }

    if (user.status === "block") {
      throw new CustomError(
        HttpStatusCodes.FORBIDDEN,
        MESSAGES.AUTH_ACCOUNT_BLOCKED
      );
    }

    if (!allowedRoles.includes(user.role)) {
      throw new CustomError(
        HttpStatusCodes.UNAUTHORIZED,
        MESSAGES.AUTH_UNAUTHORIZED_ROLE
      );
    }

    if (!user.password) {
      throw new CustomError(
        HttpStatusCodes.UNAUTHORIZED,
        MESSAGES.AUTH_INCORRECT_PASSWORD
      );
    }

    const verified = await this._hashService.compare(password, user.password);

    if (!verified) {
      throw new CustomError(
        HttpStatusCodes.UNAUTHORIZED,
        MESSAGES.AUTH_INCORRECT_PASSWORD
      );
    }

    return new AuthUserEntity({
      _id: user._id?.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      status: user.status,
      CompanyId: user?.CompanyId?.toString(),
      role: user.role,
    });

  }
}