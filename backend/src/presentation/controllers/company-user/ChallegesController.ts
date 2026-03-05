import { AuthRequest } from "../../../types/AuthRequest";
import { Response } from "express";
import { IGetCompanyUsers } from "../../../application/use-cases/interfaces/companyUser/IGetCompanyUsers";
import { IMakeChallengeUseCase } from "../../../application/use-cases/interfaces/companyUser/IMakeChallengeUseCase";
import { IGetSentChallengeUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetSentChallengeUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
import { IGetChallengesUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetChallengesUseCase";
import { getIO } from "../../../infrastructure/socket/socket";
import { IAcceptChallengeUseCase } from "../../../application/use-cases/interfaces/companyUser/IAcceptChallengeUseCase";
import { IGetChallengeGameDataUseCase } from "../../../application/use-cases/interfaces/companyUser/IGetChallengeGameDataUseCase";
export class challengesController{
    constructor(
    private _getCompanyUsersUseCase:IGetCompanyUsers,
    private _makeChallengeUseCase:IMakeChallengeUseCase,
    private _getSentChallengesUseCase:IGetSentChallengeUseCase,
    private _getChallengesUseCase:IGetChallengesUseCase,
    private _acceptChallengeUseCase:IAcceptChallengeUseCase,
    private _getChallengeGameDataUseCase:IGetChallengeGameDataUseCase
    ){}
  async companyUsers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
      return;
    }

    const users = await this._getCompanyUsersUseCase.execute(userId);

    res.status(200).json({
      success: true,
      data: users,
    });

  } catch (error: any) {
    console.error("Error in companyUsers controller:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}
async makeChallenge(req: AuthRequest, res: Response): Promise<void> {
  try {
    const receiverId = req.body.receiverId;
    const senderId = req.user?.userId;

    if (!receiverId) {
      res.status(400).json({
        success: false,
        message: "receiverId is required"
      });
      return;
    }

    if (!senderId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }

    const challenge=await this._makeChallengeUseCase.execute(senderId, receiverId);
    const io = getIO()

io.to(`user:${receiverId}`).emit("challenge-received", challenge)
  
    res.status(201).json({
      success: true,
      message: "Challenge sent successfully"
    });

  } catch (err: any) {

    console.error("Make Challenge Error:", err);

    res.status(400).json({
      success: false,
      message: err.message || "Something went wrong"
    });
  }
}

async checkAlreadySentChallenge(req: AuthRequest, res: Response): Promise<void> {
  try {
   
   
    const senderId = req.user?.userId

    if (!senderId ) {
      res.status(400).json({ message: "senderId  are required" })
      return
    }

    const challenges = await this._getSentChallengesUseCase.execute(senderId)
    

    res.status(200).json({
      success: true,
      data:challenges
    })

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    })
  }
}


async getAllChallenges(req: AuthRequest, res: Response): Promise<void> {
  try {

    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: MESSAGES.AUTH_USER_NOT_FOUND
      });
      return;
    }

    const challenges = await this._getChallengesUseCase.execute(userId);

    res.status(200).json({
      success: true,
      data: challenges
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch challenges"
    });
  }
}

async acceptChallenge(req: AuthRequest, res: Response): Promise<void> {
  try {

    const challengeId = req.params.challengeId;

    if (!challengeId) {
      res.status(400).json({
        success: false,
        message: "Challenge ID is required"
      });
      return;
    }

    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
      return;
    }

    await this._acceptChallengeUseCase.execute(challengeId);


    res.status(200).json({
      success: true,
      message: "Challenge accepted successfully"
    });

  } catch (error: any) {

    console.error("Error in acceptChallenge controller:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });

  }
}

async getChallengeGameData(req: AuthRequest, res: Response): Promise<void> {
  try {

    const challengeId = req.params.challengeId

    if (!challengeId) {
      res.status(400).json({
        success: false,
        message: "Challenge ID is required"
      })
      return
    }

    const challengeGameData = await this._getChallengeGameDataUseCase.execute(challengeId)


    res.status(200).json({
      success: true,
      data: challengeGameData
    })

  } catch (error: any) {

    console.error("Error in getChallengeGameData:", error)

    res.status(500).json({
      success: false,
      message: error?.message || "Internal server error"
    })
  }
}



}