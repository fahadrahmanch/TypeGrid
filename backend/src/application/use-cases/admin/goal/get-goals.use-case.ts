import { IGetGoalsUseCase } from "../../interfaces/admin/get-goals.interface";
import { IGoalRepository } from "../../../../domain/interfaces/repository/admin/goal-repository.interface";
import { GoalResponseDTO } from "../../../DTOs/admin/goal.dto";
import { mapToGoalDTO } from "../../../mappers/admin/goal-management.mapper";

export class GetGoalsUseCase implements IGetGoalsUseCase {
  constructor(private readonly _goalRepository: IGoalRepository) {}
  async execute(
    searchText: string,
    page: number,
    limit: number,
  ): Promise<{ goals: GoalResponseDTO[]; total: number }> {
    const { goals, total } = await this._goalRepository.getGoals(
      searchText,
      page,
      limit,
    );
    return {
      goals: goals.map((goal) => mapToGoalDTO(goal.toObject())),
      total,
    };
  }
}
