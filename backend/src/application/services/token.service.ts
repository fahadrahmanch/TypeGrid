import { ITokenService } from '../../domain/interfaces/services/token-service.interface';
import jwt from 'jsonwebtoken';
import { CustomError } from '../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../domain/enums/http-status-codes.enum';
export class TokenService implements ITokenService {
  private accessSecret: string;
  private refreshSecret: string;
  constructor() {
    if (!process.env.ACCESS_SECRET)
      throw new CustomError(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'ACCESS_SECRET is required');
    if (!process.env.REFRESH_SECRET)
      throw new CustomError(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'REFRESH_SECRET is required');

    this.accessSecret = process.env.ACCESS_SECRET;
    this.refreshSecret = process.env.REFRESH_SECRET;
  }

  async generateAccessToken(userId: string, email: string, role: string, companyId?: string): Promise<string> {
    return jwt.sign({ userId: userId, email: email, role: role, companyId }, this.accessSecret, {
      expiresIn: (process.env.ACCESS_EXPIRY || '7h') as jwt.SignOptions['expiresIn'],
    });
  }

  async generateRefreshToken(userId: string, email: string, role: string, companyId?: string): Promise<string> {
    return jwt.sign({ userId: userId, email: email, role: role, companyId }, this.refreshSecret, {
      expiresIn: (process.env.REFRESH_EXPIRY || '7d') as jwt.SignOptions['expiresIn'],
    });
  }

  async verifyAccessToken(token: string) {
    return jwt.verify(token, this.accessSecret);
  }
  async verifyRefreshToken(token: string) {
    return jwt.verify(token, this.refreshSecret);
  }
}
