import { ICompleteSignupUseCase } from '../../interfaces/auth/complete-signup.interface';
import { IOtpService } from '../../../../domain/interfaces/services/otp-service.interface';
import { AuthUserEntity } from '../../../../domain/entities';
import { IAuthRepository } from '../../../../domain/interfaces/repository/user/auth-repository.interface';
import { IHashService } from '../../../../domain/interfaces/services/hash-service.interface';
import { MESSAGES } from '../../../../domain/constants/messages';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';

/**
 * Completes the user signup by verifying OTP and creating the account.
 */
export class CompleteSignupUseCase implements ICompleteSignupUseCase {
  constructor(
    private readonly _otpService: IOtpService,
    private readonly _hashService: IHashService,
    private readonly _authRepository: IAuthRepository
  ) {}

  async execute(otp: string, name: string, email: string, password: string): Promise<void> {
    const isVerified = await this._otpService.verifyOtp(otp, email);

    if (!isVerified) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.OTP_VERIFICATION_FAILED);
    }

    const hashedPassword = await this._hashService.hash(password);

    const newUser = new AuthUserEntity({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      KeyBoardLayout: 'QWERTY',
      status: 'active',
    });

    await this._authRepository.create(newUser);
  }
}
