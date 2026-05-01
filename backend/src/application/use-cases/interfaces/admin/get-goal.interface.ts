import { GoalResponseDTO } from "../../../DTOs/admin/goal.dto";

export interface IGetGoalUseCase {
  execute(id: string): Promise<GoalResponseDTO>;
}
