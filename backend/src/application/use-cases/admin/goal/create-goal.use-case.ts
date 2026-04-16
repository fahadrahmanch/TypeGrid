import { ICreateGoalUseCase } from '../../interfaces/admin/create-goal.interface';
import { IGoalRepository } from '../../../../domain/interfaces/repository/admin/goal-repository.interface';
import { GoalEntity } from '../../../../domain/entities/goal.entity';
import { CreateGoalDTO, GoalResponseDTO } from '../../../DTOs/admin/goal.dto';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';
import { MESSAGES } from '../../../../domain/constants/messages';
import { mapToGoalDTO } from '../../../mappers/admin/goal-management.mapper';

export class CreateGoalUseCase implements ICreateGoalUseCase {
  constructor(private readonly _goalRepository: IGoalRepository) {}
  async execute(goal: CreateGoalDTO): Promise<GoalResponseDTO> {
    const isGoalExist = await this._goalRepository.findOne({
      title: goal.title,
    });
    if (isGoalExist) {
      throw new CustomError(HttpStatusCodes.CONFLICT, MESSAGES.GOAL_ALREADY_EXISTS);
    }
    const goalEntity = new GoalEntity(goal);
    const newGoal = await this._goalRepository.create(goalEntity.toObject());
    return mapToGoalDTO(newGoal);
  }
}
