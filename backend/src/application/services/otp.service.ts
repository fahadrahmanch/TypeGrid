import { IOtpService } from "../../domain/interfaces/services/otp-service.interface";
import { ICachingService } from "../../domain/interfaces/services/caching-service.interface";

export class OtpService implements IOtpService {
  constructor(private _cachingService: ICachingService) {}

  createOtp(email: string): string {
    let otp = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 9);
      otp += randomIndex;
    }
    this.storeOtp(otp, email);
    return otp;
  }

  storeOtp(otp: string, email: string): void {
    this._cachingService.setData(`user-otp-${email}`, otp, 300);
  }

  verifyOtp(otp: string, email: string): boolean {
    return this._cachingService.getData(`user-otp-${email}`) === otp;
  }
}
