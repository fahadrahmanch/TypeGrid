import { GoalResponseDTO } from "../../DTOs/admin/goal.dto";

export function mapToGoalDTO(goal: any): GoalResponseDTO {
    return {
        _id: goal._id || goal.id,
        title: goal.title,
        wpm: goal.wpm,
        accuracy: goal.accuracy,
        description: goal.description,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt
    };
}
