import { DailyChallengeResponseDTO } from '../../../../DTOs/user/daily-challenge.dto';

export interface IGetTodayChallengeUseCase {
  execute(): Promise<DailyChallengeResponseDTO>;
}
