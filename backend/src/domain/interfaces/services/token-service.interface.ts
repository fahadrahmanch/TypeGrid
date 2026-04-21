export interface ITokenService {
  generateAccessToken(userId: string, email: string, role: string, companyId?: string): Promise<string>;
  generateRefreshToken(userId: string, email: string, role: string, companyId?: string): Promise<string>;
  verifyAccessToken(token: string): Promise<any>;
  verifyRefreshToken(refresToken: string): Promise<any>;
}
