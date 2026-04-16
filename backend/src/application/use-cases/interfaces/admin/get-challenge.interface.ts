import { ChallengeResponseDTO } from '../../../DTOs/admin/challenge.dto';

export interface IGetChallengeUseCase {
  execute(id: string): Promise<ChallengeResponseDTO>;
}
