import { groupDTO } from '../../../../DTOs/user/group.dto';
export interface IGetGroupPlayGroupUseCase {
  execute(joinLink: string, userId: string): Promise<groupDTO>;
}
