import { Request, Response, NextFunction } from "express";
import { IGetAllAchievementsUseCase } from "../../../application/use-cases/user/achievements/get-all-achievements.use-case";
import { AuthRequest } from "../../../types/AuthRequest";

export interface IUserAchievementController {
    allAchievements(req: Request, res: Response, next: NextFunction): Promise<void>;
    userAchievements(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class UserAchievementController implements IUserAchievementController {
    constructor(
        private readonly _getAllAchievementsUseCase: IGetAllAchievementsUseCase
    ){}


    async allAchievements(req:AuthRequest,res:Response, next: NextFunction):Promise<void>{
        try{
            const userId = req.user?.userId;
            if(!userId){
                throw new Error("User not found");
            }
            const result = await this._getAllAchievementsUseCase.execute(userId);
            console.log("result",result);
            res.status(200).json({
                success:true,
                message:"Achievements fetched successfully",
                data:result
            });
        }
        catch(error){
            next(error);
        }
    }
    async userAchievements(req:Request,res:Response, next: NextFunction):Promise<void>{
        try{
        
        }
        catch(error){
            next(error);
        }
    }

}