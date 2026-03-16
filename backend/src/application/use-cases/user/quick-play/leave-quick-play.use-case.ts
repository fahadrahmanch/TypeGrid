import { ILeaveQuickPlayUseCase } from "../../interfaces/user/quick-play/leave-quick-play.interface";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import {MESSAGES} from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { CompetitionEntity } from "../../../../domain/entities/competition.entity";
export class LeaveQuickPlayUseCase implements ILeaveQuickPlayUseCase {
    constructor(
        private readonly _competitionRepository: ICompetitionRepository,
        private readonly _userRepository: IUserRepository,
    ) {}

    async execute(gameId: string, userId: string): Promise<void> {
         if(!gameId || !userId){
            throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
         }
         const competition = await this._competitionRepository.findById(gameId);
         if(!competition){
            throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.COMPETITION_NOT_FOUND);
         }
         const competitionEntity = new CompetitionEntity({
            ...competition,
            id: competition._id,
         });
         const user = await this._userRepository.findById(userId);
         if(!user){
            throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
         }
         competitionEntity.removeParticipant(userId);
         if(competitionEntity.getParticipants().length === 0){
            competitionEntity.setStatus("completed");
          
         }
         const updatedCompetition=competitionEntity.toObject();
         await this._competitionRepository.update(updatedCompetition);
}
       
}