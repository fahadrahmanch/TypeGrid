import { Request, Response, NextFunction } from "express";
import { ITokenService } from "../../domain/interfaces/services/ITokenService";
import logger from "../../utils/logger";
export function authMiddleware(
    tokenService: ITokenService
) {
    return async function (req: Request, res: Response, next: NextFunction) {
        console.log("auth middleware")
        const authHeader = req.headers["authorization"]; 
        console.log(authHeader,"authHese")
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                console.log("token in middleware",token)
                const decoded = await tokenService.verifyAccessToken(token);
                if(decoded){

                    console.log(decoded)
                }
                (req as any).user = decoded;
                next();

            }
            catch (error) {
                logger.error(error);
                console.log("error hpnd",error)
                return res.status(401).json({ message: "Invalid or expired token" });
            }
        } else {
            console.log("unAuthorized")
            return res.status(403).json({ message: "Anauthorized" });
        }

    };
}