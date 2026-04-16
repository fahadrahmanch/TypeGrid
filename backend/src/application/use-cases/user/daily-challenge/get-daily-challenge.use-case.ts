import { IGetTodayChallengeUseCase } from '../../interfaces/user/daily-challenge/get-daily-challenge.interface';
import { IDailyAssignChallengeRepository } from '../../../../domain/interfaces/repository/admin/daily-challenge-repository.interface';
import { IChallengeRepository } from '../../../../domain/interfaces/repository/admin/challenge-repository.interface';
import { MESSAGES } from '../../../../domain/constants/messages';
import { IGoalRepository } from '../../../../domain/interfaces/repository/admin/goal-repository.interface';
import { IRewardRepository } from '../../../../domain/interfaces/repository/admin/reward-repository.interface';
import { mapToGoalResponseDTO } from '../../../mappers/user/daily-challenge.mapper';
import { DailyChallengeResponseDTO } from '../../../DTOs/user/daily-challenge.dto';
import { ILessonRepository } from '../../../../domain/interfaces/repository/admin/lesson-repository.interface';
export class GetTodayChallengeUseCase implements IGetTodayChallengeUseCase {
  constructor(
    private readonly _dailyChallengeRepository: IDailyAssignChallengeRepository,
    private readonly _challengeRepository: IChallengeRepository,
    private readonly _goalRepository: IGoalRepository,
    private readonly _rewardRepository: IRewardRepository,
    private readonly _lessonRepository: ILessonRepository
  ) {}
  async execute(): Promise<DailyChallengeResponseDTO> {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    const dailyChallenge = await this._dailyChallengeRepository.getTodayChallenge(startOfDay, endOfDay);
    if (!dailyChallenge) {
      throw new Error(MESSAGES.DAILY_CHALLENGE_NOT_FOUND);
    }
    const challenge = await this._challengeRepository.findById(dailyChallenge.getChallengeId());
    if (!challenge) {
      throw new Error(MESSAGES.CHALLENGE_NOT_FOUND);
    }
    const goal = await this._goalRepository.findById(challenge.getGoal());
    if (!goal) {
      throw new Error(MESSAGES.GOAL_NOT_FOUND);
    }
    const reward = await this._rewardRepository.findById(challenge.getReward());
    if (!reward) {
      throw new Error(MESSAGES.REWARD_NOT_FOUND);
    }
    const level =
      challenge.getDifficulty() === 'easy'
        ? 'beginner'
        : challenge.getDifficulty() === 'medium'
          ? 'intermediate'
          : 'advanced';
    const lesson = await this._lessonRepository.findOne({ level: level });
    if (!lesson) {
      throw new Error(MESSAGES.LESSON_NOT_FOUND);
    }
    return mapToGoalResponseDTO(
      dailyChallenge.toObject(),
      { ...challenge.toObject(), lesson: lesson.text },
      goal.toObject(),
      reward.toObject()
    );
  }
}
