import { CreateGoalDTO, GoalResponseDTO } from '../../../DTOs/admin/goal.dto';

export interface ICreateGoalUseCase {
  execute(goal: CreateGoalDTO): Promise<GoalResponseDTO>;
}
