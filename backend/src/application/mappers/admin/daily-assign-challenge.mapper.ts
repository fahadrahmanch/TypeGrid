import { DailyAssignChallengeResponseDTO } from "../../../application/DTOs/admin/daily-challenge.dto";
import { DailyAssignChallengeDTO } from "../../../application/DTOs/admin/daily-challenge.dto";
export function DailyAssignChallengeMapper(
  dailyAssignChallenge: DailyAssignChallengeDTO
): DailyAssignChallengeResponseDTO {
  return {
    _id: dailyAssignChallenge._id,
    challengeId: {
      _id: dailyAssignChallenge.challengeId._id,
      title: dailyAssignChallenge.challengeId.title,
    },
    date: dailyAssignChallenge.date,
  };
}
