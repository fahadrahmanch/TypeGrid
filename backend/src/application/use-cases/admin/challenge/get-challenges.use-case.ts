import { IGetChallengesUseCase } from "../../interfaces/admin/get-challenges.interface";
import { IChallengeRepository } from "../../../../domain/interfaces/repository/admin/challenge-repository.interface";
import { ChallengeResponseDTO } from "../../../DTOs/admin/challenge.dto";

export class GetChallengesUseCase implements IGetChallengesUseCase {
  constructor(private readonly _challengeRepository: IChallengeRepository) {}
  async execute(
    searchText: string,
    page: number,
    limit: number,
  ): Promise<{ challenges: ChallengeResponseDTO[]; total: number }> {
    const { challenges, total } = await this._challengeRepository.getChallenges(
      searchText,
      page,
      limit,
    );
    return {
      challenges: challenges.map((c) => c.toObject() as ChallengeResponseDTO),
      total,
    };
  }
}
