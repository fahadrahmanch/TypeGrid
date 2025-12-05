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
            { email: email,role:role },
            this.accessSecret,
            { expiresIn: "1h" }
        );
    }

    async generateRefreshToken(email: string,role:string): Promise<string> {
        return jwt.sign(
            { email: email,role:role },
            this.refreshSecret,
            { expiresIn: "7d" }
        );
    }
    async verifyAccessToken(token: string) {
        console.log("token in verify",token)
        return jwt.verify(token, this.accessSecret);
    }
    async verifyRefreshToken(token: string) {
        return jwt.verify(token, this.refreshSecret) ;
    }
}