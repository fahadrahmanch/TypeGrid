import { NextFunction, Request, Response } from "express";
import { ICreateChallengeUseCase } from "../../../application/use-cases/interfaces/admin/create-challenge.interface";
import { IGetChallengeUseCase } from "../../../application/use-cases/interfaces/admin/get-challenge.interface";
import { IGetChallengesUseCase } from "../../../application/use-cases/interfaces/admin/get-challenges.interface";
import { IUpdateChallengeUseCase } from "../../../application/use-cases/interfaces/admin/update-challenge.interface";
import { IDeleteChallengeUseCase } from "../../../application/use-cases/interfaces/admin/delete-challenge.interface";
import logger from "../../../utils/logger";

export class ChallengeManageController {
    constructor(
        private readonly _createChallengeUseCase: ICreateChallengeUseCase,
        private readonly _getChallengeUseCase: IGetChallengeUseCase,
        private readonly _updateChallengeUseCase: IUpdateChallengeUseCase,
        private readonly _deleteChallengeUseCase: IDeleteChallengeUseCase,
        private readonly _getChallengesUseCase: IGetChallengesUseCase,
    ) { }

    async createChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const challenge = await this._createChallengeUseCase.execute(req.body);
            logger.info("Challenge created successfully", challenge);
            res.status(201).json({
                message: "Challenge created successfully",
                challenge
            })
        } catch (error) {
            next(error);
        }
    }

    async getChallenges(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { search, page, limit } = req.query;
            const result = await this._getChallengesUseCase.execute(search as string, Number(page), Number(limit));
            logger.info("Challenges fetched successfully", result);
            res.status(200).json({
                message: "Challenges fetched successfully",
                challenges: result.challenges,
                total: result.total
            })
        } catch (error) {
            next(error);
        }
    }

    async getChallengeById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const challenge = await this._getChallengeUseCase.execute(id as string);
            logger.info("Challenge fetched successfully", challenge);
            res.status(200).json({
                message: "Challenge fetched successfully",
                challenge
            })
        } catch (error) {
            next(error);
        }
    }

    async updateChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const challenge = await this._updateChallengeUseCase.execute(id as string, req.body);
            logger.info("Challenge updated successfully", challenge);
            res.status(200).json({
                message: "Challenge updated successfully",
                challenge
            })
        } catch (error) {
            next(error);
        }
    }

    async deleteChallenge(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await this._deleteChallengeUseCase.execute(id as string);
            logger.info("Challenge deleted successfully", { id });
            res.status(200).json({
                message: "Challenge deleted successfully"
            })
        } catch (error) {
            next(error);
        }
    }
}
