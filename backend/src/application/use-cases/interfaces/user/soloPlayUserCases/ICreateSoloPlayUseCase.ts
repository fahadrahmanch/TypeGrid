import { CompetitionDTOSoloPlay } from "../../../../DTOs/user/CompetitionDTOSoloPlay";
export interface ICreateSoloPlayUseCase{
    execute(userId:string):Promise<CompetitionDTOSoloPlay>
}