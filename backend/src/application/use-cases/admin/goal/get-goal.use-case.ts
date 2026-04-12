import { IGetGoalUseCase } from "../../interfaces/admin/get-goal.interface";
import { IGoalRepository } from "../../../../domain/interfaces/repository/admin/goal-repository.interface";
import { GoalResponseDTO } from "../../../DTOs/admin/goal.dto";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";
import { mapToGoalDTO } from "../../../mappers/admin/goal-management.mapper";

export class GetGoalUseCase implements IGetGoalUseCase {
  constructor(private readonly _goalRepository: IGoalRepository) {}
  async execute(id: string): Promise<GoalResponseDTO> {
    const goal = await this._goalRepository.findById(id);
    if (!goal) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GOAL_NOT_FOUND);
    }
    return mapToGoalDTO(goal);
  }
}
