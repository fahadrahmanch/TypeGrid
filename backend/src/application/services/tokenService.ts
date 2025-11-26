import { ITokenService } from "../../domain/interfaces/services/ITokenService";
import jwt from "jsonwebtoken";
export class TokenService implements ITokenService {

    private accessSecret: string;
    private refreshSecret: string;
    constructor() {
        this.accessSecret = process.env.ACCESS_SECRET || "";
        this.refreshSecret = process.env.REFRESH_SECRET || "";
    }
    async generateAccessToken(email: string,role:string): Promise<string> {
        return jwt.sign(
            { email: email },
            this.accessSecret,
            { expiresIn: "1h" }
        );
    }

    async generateRefreshToken(email: string,role:string): Promise<string> {
        return jwt.sign(
            { email: email },
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