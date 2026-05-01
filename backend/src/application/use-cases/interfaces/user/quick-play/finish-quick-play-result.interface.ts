import { QuicKPlayResult } from "../../../../DTOs/user/competition-quick-play.dto";
export interface IFinishQuickPlayResult {
  execute(gameId: string, resultArray: QuicKPlayResult[]): Promise<void>;
}
