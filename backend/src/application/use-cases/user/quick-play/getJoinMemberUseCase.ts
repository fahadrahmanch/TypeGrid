import { IGetJoinMemberUseCase } from "../../interfaces/user/quickPlayUseCases/IGetQuickPlayDataUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { mapQuickMemberToDTO } from "../../../DTOs/user/CompetitionDTOQuickPlay";
import { QuickPlayMemberDTO } from "../../../DTOs/user/CompetitionDTOQuickPlay";

export class getJoinMemberUseCase implements IGetJoinMemberUseCase{
    constructor(
        private readonly _competitionRepository:IBaseRepository<any>,
        private readonly _userRepository:IBaseRepository<any>
    ){}
    
    async execute(competitionId:string,userId:string):Promise<QuickPlayMemberDTO>{
        try{
        const userExist=await this._userRepository.findById(userId);
        if(!userExist){
            throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
        }
        const competition=await this._competitionRepository.findById(competitionId);
        if(!competition){
            throw new Error(MESSAGES.COMPETITION_NOT_FOUND)
        }
        const isParticipant=competition.participants.some((participant:string)=>participant.toString()===userId);
        if(!isParticipant){
            throw new Error(MESSAGES.USER_NOT_PARTICIPANT);
        }
        const memberDTO=mapQuickMemberToDTO(userExist);
        return memberDTO;
    }
    catch(error:any){
        console.log("Error in getJoinMemberUseCase:",error);
        throw error;
    }
}
}