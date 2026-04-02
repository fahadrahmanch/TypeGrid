import {
  UpdateChallengeDTO,
  ChallengeResponseDTO,
} from "../../../DTOs/admin/challenge.dto";

export interface IUpdateChallengeUseCase {
  execute(
    id: string,
    challenge: UpdateChallengeDTO,
  ): Promise<ChallengeResponseDTO>;
}
