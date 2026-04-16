import { GroupPlayResult } from '../../../../DTOs/user/group-play.dto';
export interface IFinishGroupPlayUseCase {
  execute(gameId: string, resultArray: GroupPlayResult[]): Promise<void>;
}
