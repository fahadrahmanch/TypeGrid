import { UpdateGoalDTO, GoalResponseDTO } from '../../../DTOs/admin/goal.dto';

export interface IUpdateGoalUseCase {
  execute(id: string, goal: UpdateGoalDTO): Promise<GoalResponseDTO>;
}
