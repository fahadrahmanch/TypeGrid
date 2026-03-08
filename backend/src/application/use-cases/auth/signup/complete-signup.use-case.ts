import { ICompleteSignupUseCase } from "../../interfaces/auth/complete-signup.interface";
import { IOtpService } from "../../../../domain/interfaces/services/otp-service.interface";
import { AuthUserEntity } from "../../../../domain/entities";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/auth-repository.interface";
import { IHashService } from "../../../../domain/interfaces/services/hash-service.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
export class CompleteSignupUseCase implements ICompleteSignupUseCase {
  constructor(
    private _otpservice: IOtpService,
    private _hashService: IHashService,
    private _authRepository: IAuthRepostory,
  ) {}
  async otp(
    otp: string,
    name: string,
    email: string,
    password: string,
  ): Promise<void> {
    const verifry = await this._otpservice.verifyOtp(otp, email);
    if (!verifry) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.OTP_VERIFICATION_FAILED,
      );
    }
    const hashedPassword = await this._hashService.hash(password);
    const newUser = new AuthUserEntity({
      name: name,
      email: email,
      password: hashedPassword,
      role: "user",
      KeyBoardLayout: "QWERTY",
      status: "active",
    });
    await this._authRepository.create(newUser);
  }
}
