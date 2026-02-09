import { QuickPlayMemberDTO } from "../../../../DTOs/user/CompetitionDTOQuickPlay"
export interface IGetJoinMemberUseCase{
    execute(competitionId:string,userId:string):Promise<QuickPlayMemberDTO>
}