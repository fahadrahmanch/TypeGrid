import { IDeleteGoalUseCase } from '../../interfaces/admin/delete-goal.interface';
import { IGoalRepository } from '../../../../domain/interfaces/repository/admin/goal-repository.interface';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';
import { MESSAGES } from '../../../../domain/constants/messages';

export class DeleteGoalUseCase implements IDeleteGoalUseCase {
  constructor(private readonly _goalRepository: IGoalRepository) {}
  async execute(id: string): Promise<void> {
    const existingGoal = await this._goalRepository.findById(id);
    if (!existingGoal) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GOAL_NOT_FOUND);
    }
    await this._goalRepository.delete(id);
  }
}
