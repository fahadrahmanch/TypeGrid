import { IAuthRepository } from '../../../../domain/interfaces/repository/user/auth-repository.interface';
import { IEmailService } from '../../../../domain/interfaces/services/email-service.interface';
import { IOtpService } from '../../../../domain/interfaces/services/otp-service.interface';
import { IEmailTemplate } from '../../../DTOs/email/email-template.dto';
import { IResentOtpUseCase } from '../../interfaces/resent-otp.interface';
/**
 * Resends an OTP to the user's email for sign up verification.
 */
export class ResentOtpUseCase implements IResentOtpUseCase {
  constructor(
    private _otpService: IOtpService,
    private _emailService: IEmailService,
    private _authRepository: IAuthRepository
  ) {}
  async execute(name: string, email: string): Promise<void> {
    await this._authRepository.findByEmail(email);
    const otp = await this._otpService.createOtp(email);
    const emailOptions: IEmailTemplate = {
      name,
      email,
      otp,
      subject: 'Type Grid Sign Up Otp',
    };
    await this._emailService.sentOtp(emailOptions);
  }
}
