import { groupDTO } from '../../../../DTOs/user/group.dto';
export interface ICreateGroupPlayRoomUseCase {
  execute(hostUserId: string): Promise<groupDTO>;
}
