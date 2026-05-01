import { groupDTO } from "../../../../DTOs/user/group.dto";
export interface IEditGroupPlayUseCase {
  execute(groupId: string, difficulty: string, maxPlayers: number, userId: string): Promise<groupDTO>;
}
