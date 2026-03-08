import { groupDTO } from "../../../../DTOs/user/group.dto";
export interface IJoinGroupPlayGroupUseCase {
  execute(joinLink: string, userId: string): Promise<groupDTO>;
}
