import { AuthRequest } from "../../../types/AuthRequest";
import { Response } from "express";
import { MESSAGES } from "../../../domain/constants/messages";
import { IStartQuickPlayUseCase } from "../../../application/use-cases/interfaces/user/quickPlayUseCases/IStartQuickPlayUseCase";
import { IChangeStatusUseCase } from "../../../application/use-cases/interfaces/user/quickPlayUseCases/IChangeStatusUseCase";
export class QuickPlayController {
  constructor(
    private _startQuickPlayUseCase: IStartQuickPlayUseCase,
    private _changeStatusUseCase: IChangeStatusUseCase
  ) {}
  async startQuickPlay(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      const quickPlay=await this._startQuickPlayUseCase.execute(userId);
      if(!quickPlay){
        throw new Error("Failed to start quick play.");
      }
      res.status(200).json({
        success: true,
        message: "Quick play started successfully",
        quickPlay
      });
    } catch (error: any) {
        console.error("Quick Play Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
  }


  async changeStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
     const competitionId=req.params.competitionId;
     const userId = req.user?.userId;
     const status=req.body.status;
        if (!status) {
          throw new Error(MESSAGES.STATUS_REQUIRED);
        }
      if (!userId) {
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
      }
      await this._changeStatusUseCase.execute(competitionId, status);

      res.status(200).json({
        success: true,
        message: "Quick play status changed successfully",
      });
    } catch (error: any) {
      console.error("Error changing quick play status:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }

}
}