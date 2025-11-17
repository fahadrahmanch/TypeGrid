import { ObjectId } from "mongoose";
import { ITokenService } from "../../domain/interfaces/services/ITokenService";
import jwt from "jsonwebtoken";
export class TokenService implements ITokenService{

    private accessSecret: string;
    private refreshSecret: string;
    constructor() {
        this.accessSecret = process.env.ACCESS_SECRET || "";
        this.refreshSecret = process.env.REFRESH_SECRET || "";
    }
    async generateAccessToken(_id: ObjectId): Promise<string> {
        return jwt.sign(
            { userId: _id },
            this.accessSecret,
            { expiresIn: "15m" }
        );
    }

    async generateRefreshToken(_id: ObjectId): Promise<string> {
        return jwt.sign(
            { userId: _id },
            this.refreshSecret,
            { expiresIn: "7d" }
        );
    }
}