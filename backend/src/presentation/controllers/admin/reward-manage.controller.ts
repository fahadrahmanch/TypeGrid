import { Request, Response } from 'express';
import { ICreateRewardUseCase } from '../../../application/use-cases/interfaces/admin/create-reward.interface';
import logger from '../../../utils/logger';
import { IGetRewardsUseCase } from '../../../application/use-cases/interfaces/admin/get-rewards.interface';
import { IGetRewardByIdUseCase } from '../../../application/use-cases/interfaces/admin/get-reward-by-id.interface';
import { IUpdateRewardUseCase } from '../../../application/use-cases/interfaces/admin/update-reward.interface';
import { IDeleteRewardUseCase } from '../../../application/use-cases/interfaces/admin/delete-reward.interface';
import { HttpStatus } from '../../constants/httpStatus';
import { MESSAGES } from '../../../domain/constants/messages';
export class RewardManageController {
  constructor(
    private readonly _createRewardUseCase: ICreateRewardUseCase,
    private readonly _getRewardsUseCase: IGetRewardsUseCase,
    private readonly _getRewardByIdUseCase: IGetRewardByIdUseCase,
    private readonly _updateRewardUseCase: IUpdateRewardUseCase,
    private readonly _deleteRewardUseCase: IDeleteRewardUseCase
  ) {}

  createReward = async (req: Request, res: Response): Promise<void> => {
    const reward = await this._createRewardUseCase.execute(req.body);
    logger.info(MESSAGES.REWARD_CREATED_SUCCESS, reward);
    res.status(HttpStatus.CREATED).json({
      message: MESSAGES.REWARD_CREATED_SUCCESS,
      reward,
    });
  };

  getRewards = async (req: Request, res: Response): Promise<void> => {
    const { search, page, limit } = req.query;
    const rewards = await this._getRewardsUseCase.execute(search as string, Number(page), Number(limit));
    logger.info(MESSAGES.REWARDS_FETCHED_SUCCESS, rewards);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.REWARDS_FETCHED_SUCCESS,
      rewards,
    });
  };
  getRewardById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const reward = await this._getRewardByIdUseCase.execute(id as string);
    logger.info(MESSAGES.REWARD_FETCHED_SUCCESS, reward);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.REWARD_FETCHED_SUCCESS,
      reward,
    });
  };
  updateReward = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const reward = await this._updateRewardUseCase.execute(id as string, req.body);
    logger.info(MESSAGES.REWARD_UPDATED_SUCCESS, reward);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.REWARD_UPDATED_SUCCESS,
      reward,
    });
  };
  deleteReward = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const reward = await this._deleteRewardUseCase.execute(id as string);
    logger.info(MESSAGES.REWARD_DELETED_SUCCESS, reward);
    res.status(HttpStatus.OK).json({
      message: MESSAGES.REWARD_DELETED_SUCCESS,
      reward,
    });
  };
}
