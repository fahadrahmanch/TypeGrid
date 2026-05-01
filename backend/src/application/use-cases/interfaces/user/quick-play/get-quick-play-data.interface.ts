import { QuickPlayMemberDTO } from "../../../../DTOs/user/competition-quick-play.dto";
export interface IGetJoinMemberUseCase {
  execute(competitionId: string, userId: string): Promise<QuickPlayMemberDTO>;
}
