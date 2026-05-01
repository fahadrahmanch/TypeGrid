import { CompetitionDTOGroupPlay } from "../../../../DTOs/user/competition-group-play.dto";
export interface INewGroupPlayUseCase {
  execute(gameId: string, users: string[]): Promise<CompetitionDTOGroupPlay>;
}
