import { CompetitionDTOGroupPlay } from "../../../../DTOs/user/competition-group-play.dto";
export interface IStartGameGroupPlayGroupUseCase {
  execute(groupId: string, countDown: number): Promise<CompetitionDTOGroupPlay>;
}
