import { IGetJoinMemberUseCase } from "../../interfaces/user/quick-play/get-quick-play-data.interface";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { mapQuickMemberToDTO } from "../../../DTOs/user/competition-quick-play.dto";
import { QuickPlayMemberDTO } from "../../../DTOs/user/competition-quick-play.dto";
import logger from "../../../../utils/logger";

export class GetJoinMemberUseCase implements IGetJoinMemberUseCase {
  constructor(
    private readonly _competitionRepository: ICompetitionRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(
    competitionId: string,
    userId: string,
  ): Promise<QuickPlayMemberDTO> {
    try {
      const userExist = await this._userRepository.findById(userId);
      if (!userExist) {
        throw new CustomError(
          HttpStatusCodes.NOT_FOUND,
          MESSAGES.AUTH_USER_NOT_FOUND,
        );
      }
      const competition =
        await this._competitionRepository.findById(competitionId);
      if (!competition) {
        throw new CustomError(
          HttpStatusCodes.NOT_FOUND,
          MESSAGES.COMPETITION_NOT_FOUND,
        );
      }
      const isParticipant = (competition as any)
        .getParticipants()
        .some((participant: string) => participant.toString() === userId);
      if (!isParticipant) {
        throw new CustomError(
          HttpStatusCodes.FORBIDDEN,
          MESSAGES.USER_NOT_PARTICIPANT,
        );
      }
      const memberDTO = mapQuickMemberToDTO(userExist);
      return memberDTO;
    } catch (error: any) {
      logger.error("Error in getJoinMemberUseCase", {
        error: error.message,
        stack: error.stack,
        competitionId,
        userId,
      });
      throw error;
    }
  }
}
