import { IAuthUseCase } from "../../../../domain/interfaces/usecases/auth/IAuthUseCase";
import { IAuthRepostory } from "../../../../domain/interfaces/repository/user/IAuthRepository";
import { IOtpService } from "../../../../domain/interfaces/services/IOtpService";
import { IEmailService } from "../../../../domain/interfaces/services/IEmailService";
import { IEmailTemplate } from "../../../../domain/interfaces/emailTemplates/IEmailTemplate";
export class registerUser implements IAuthUseCase {
    constructor(
        private userRepository: IAuthRepostory,
        private otpService: IOtpService,
        private _EmailService: IEmailService
    ) {
    }
    async createUser({ name, email, password }: { name: string; email: string; password: string }): Promise<void> {
        if (!name || !email || !password) {
            throw new Error("All fields are required");
        }
        const exists = await this.userRepository.findByEmail(email);
        if (exists) {
            throw new Error("User already exists with this email");
        }
        const otp = await this.otpService.createOtp(email);
        const emailOptions: IEmailTemplate = {
            name,
            email,
            otp,
            subject: "Type Grid Sign Up Otp",

        };
        await this._EmailService.sentOtp(emailOptions);
    }
}
