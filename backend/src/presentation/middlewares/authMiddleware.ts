import { Request, Response, NextFunction } from "express";
import { ITokenService } from "../../domain/interfaces/services/ITokenService";
import logger from "../../utils/logger";
export function authMiddleware(
    tokenService: ITokenService
) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers["authorization"]; 
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const decoded = await tokenService.verifyAccessToken(token);
                (req as any).user = decoded;
            
                next();

            }
            catch (error) {
                logger.error(error);
                return res.status(401).json({ message: "Invalid or expired token" });
            }
        } else {
            console.log("No token provided");
            return res.status(403).json({ message: "Anauthorized" });
        }

    };
}