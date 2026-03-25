import { NextFunction, Request, Response } from "express";
import { ICreateRewardUseCase } from "../../../application/use-cases/interfaces/admin/create-reward.interface";
import logger from "../../../utils/logger";
import { IGetRewardsUseCase } from "../../../application/use-cases/interfaces/admin/get-rewards.interface";
import { IGetRewardByIdUseCase } from "../../../application/use-cases/interfaces/admin/get-reward-by-id.interface";
import { IUpdateRewardUseCase } from "../../../application/use-cases/interfaces/admin/update-reward.interface";
import { IDeleteRewardUseCase } from "../../../application/use-cases/interfaces/admin/delete-reward.interface";
export class RewardManageController {
    constructor(
        private readonly _createRewardUseCase: ICreateRewardUseCase,
        private readonly _getRewardsUseCase: IGetRewardsUseCase,
        private readonly _getRewardByIdUseCase: IGetRewardByIdUseCase,
        private readonly _updateRewardUseCase: IUpdateRewardUseCase,
        private readonly _deleteRewardUseCase: IDeleteRewardUseCase
    ) { }

    async createReward(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const reward = await this._createRewardUseCase.execute(req.body);
            logger.info("Reward created successfully", reward);
            res.status(201).json({
                message: "Reward created successfully",
                reward
            })
        } catch (error) {
            next(error);
        }
    }

    async getRewards(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {search,page,limit} = req.query;
            const rewards = await this._getRewardsUseCase.execute(search as string,Number(page),Number(limit));
            logger.info("Rewards fetched successfully", rewards);
            res.status(200).json({
                message: "Rewards fetched successfully",
                rewards
            })
        } catch (error) {
            next(error);
        }
    }
    async getRewardById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.params;
            const reward = await this._getRewardByIdUseCase.execute(id as string);
            logger.info("Reward fetched successfully", reward);
            res.status(200).json({
                message: "Reward fetched successfully",
                reward
            })
        } catch (error) {
            next(error);
        }
    }
    async updateReward(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.params;
            const reward = await this._updateRewardUseCase.execute(id as string,req.body);
            logger.info("Reward updated successfully", reward);
            res.status(200).json({
                message: "Reward updated successfully",
                reward
            })
        } catch (error) {
            next(error);
        }
    }
    async deleteReward(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {id} = req.params;
            const reward = await this._deleteRewardUseCase.execute(id as string);
            logger.info("Reward deleted successfully", reward);
            res.status(200).json({
                message: "Reward deleted successfully",
                reward
            })
        } catch (error) {
            next(error);
        }
    }
}

