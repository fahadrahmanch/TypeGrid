import { ITokenService } from "../../domain/interfaces/services/ITokenService";
import jwt from "jsonwebtoken";
export class TokenService implements ITokenService {

    private accessSecret: string;
    private refreshSecret: string;
    constructor() {
        this.accessSecret = process.env.ACCESS_SECRET || "";
        this.refreshSecret = process.env.REFRESH_SECRET || "";
    }

    async generateAccessToken(userId: string, email: string, role: string): Promise<string> {
        return jwt.sign(
            { userId: userId, email: email, role: role },
            this.accessSecret,
            { expiresIn: "7h" }
        );
    }

    async generateRefreshToken(userId: string, email: string, role: string): Promise<string> {
        return jwt.sign(
            { userId: userId, email: email, role: role },
            this.refreshSecret,
            { expiresIn: "7d" }
        );
    }

    async verifyAccessToken(token: string) {
        return jwt.verify(token, this.accessSecret);
    }
    async verifyRefreshToken(token: string) {
        return jwt.verify(token, this.refreshSecret) ;
    }
}