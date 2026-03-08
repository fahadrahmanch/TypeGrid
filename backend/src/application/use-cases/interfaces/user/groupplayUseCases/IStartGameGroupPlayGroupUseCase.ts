import { CompetitionDTOGroupPlay } from "../../../../DTOs/user/CompetitionDTOGroupPlay";
export interface IStartGameGroupPlayGroupUseCase {
  execute(groupId: string, countDown: number): Promise<CompetitionDTOGroupPlay>;
}
