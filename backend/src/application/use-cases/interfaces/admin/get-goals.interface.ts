import { GoalResponseDTO } from "../../../DTOs/admin/goal.dto";

export interface IGetGoalsUseCase {
  execute(
    searchText: string,
    page: number,
    limit: number,
  ): Promise<{ goals: GoalResponseDTO[]; total: number }>;
}
