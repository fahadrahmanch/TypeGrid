import { CompetitionDTOQuickPlay } from "../../../../DTOs/user/competition-quick-play.dto";
export interface IStartQuickPlayUseCase {
  execute(userId: string): Promise<CompetitionDTOQuickPlay>;
}
