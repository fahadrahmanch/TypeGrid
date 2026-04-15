import { Request, Response, NextFunction } from "express";
import { ICheckFeatureAccessUseCase } from "../../application/use-cases/interfaces/user/check-feature-access.interface";
import { AuthRequest } from "../../types/AuthRequest";

export const createCheckFeature = (useCase: ICheckFeatureAccessUseCase) => {

  return (feature: string) => {
    console.log(feature);
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        const userId = req.user?.userId;

        if (!userId) {
          return res.status(401).json({
            message: "User authentication required"
          });
        }

        await useCase.execute(userId, feature);

        next();
      } catch (error: any) {
        console.log("error",error.message);
        return res.status(403).json({
          success: false,
          message: error.message || "Feature access denied"
        });
      }
    };
  };
};