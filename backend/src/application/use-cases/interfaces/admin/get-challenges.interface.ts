import { ChallengeResponseDTO } from "../../../DTOs/admin/challenge.dto";

export interface IGetChallengesUseCase {
  execute(
    searchText: string,
    page: number,
    limit: number
  ): Promise<{ challenges: ChallengeResponseDTO[]; total: number }>;
}
