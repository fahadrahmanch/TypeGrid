import { Request,Response,NextFunction } from "express";

export function checkRoleBasedMiddleware(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        const userRole = user?.role;
        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            return res.status(403).json({ message: "Forbidden: You don't have access to this resource" });
        }
    };
}