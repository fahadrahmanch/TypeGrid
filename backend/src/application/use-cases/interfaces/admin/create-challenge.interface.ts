import { CreateChallengeDTO, ChallengeResponseDTO } from '../../../DTOs/admin/challenge.dto';

export interface ICreateChallengeUseCase {
  execute(challenge: CreateChallengeDTO): Promise<ChallengeResponseDTO>;
}
