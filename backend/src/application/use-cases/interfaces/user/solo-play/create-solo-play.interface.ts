import { CompetitionDTOSoloPlay } from '../../../../DTOs/user/competition-solo-play.dto';
export interface ICreateSoloPlayUseCase {
  execute(userId: string): Promise<CompetitionDTOSoloPlay>;
}
