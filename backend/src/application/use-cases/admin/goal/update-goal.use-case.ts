import { IUpdateGoalUseCase } from '../../interfaces/admin/update-goal.interface';
import { IGoalRepository } from '../../../../domain/interfaces/repository/admin/goal-repository.interface';
import { GoalResponseDTO, UpdateGoalDTO } from '../../../DTOs/admin/goal.dto';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';
import { MESSAGES } from '../../../../domain/constants/messages';
import { mapToGoalDTO } from '../../../mappers/admin/goal-management.mapper';

export class UpdateGoalUseCase implements IUpdateGoalUseCase {
  constructor(private readonly _goalRepository: IGoalRepository) {}
  async execute(id: string, goalData: UpdateGoalDTO): Promise<GoalResponseDTO> {
    const existingGoal = await this._goalRepository.findById(id);
    if (!existingGoal) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GOAL_NOT_FOUND);
    }

    if (goalData.title !== undefined) {
      const isGoalExist = await this._goalRepository.findOne({
        title: goalData.title,
      });
      if (isGoalExist && isGoalExist.getId() !== id) {
        throw new CustomError(HttpStatusCodes.CONFLICT, MESSAGES.GOAL_ALREADY_EXISTS);
      }
    }

    const updatedGoal = await this._goalRepository.update({
      _id: id,
      ...goalData,
    });
    if (!updatedGoal) {
      throw new CustomError(HttpStatusCodes.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG);
    }

    return mapToGoalDTO(updatedGoal);
  }
}
