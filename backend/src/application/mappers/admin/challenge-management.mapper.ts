import { ChallengeResponseDTO } from "../../DTOs/admin/challenge.dto";

export function mapToChallengeDTO(challenge: any): ChallengeResponseDTO {
    return {
        _id: challenge._id || challenge.id,
        title: challenge.title,
        difficulty: challenge.difficulty,
        goal: challenge.goal,
        reward: challenge.reward,
        duration: challenge.duration,
        description: challenge.description,
        createdAt: challenge.createdAt,
        updatedAt: challenge.updatedAt
    };
}
