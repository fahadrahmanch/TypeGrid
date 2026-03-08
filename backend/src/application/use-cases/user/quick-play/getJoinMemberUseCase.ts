import { IGetJoinMemberUseCase } from "../../interfaces/user/quickPlayUseCases/IGetQuickPlayDataUseCase";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/ICompetitionRepository";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
import { mapQuickMemberToDTO } from "../../../DTOs/user/CompetitionDTOQuickPlay";
import { QuickPlayMemberDTO } from "../../../DTOs/user/CompetitionDTOQuickPlay";
import logger from "../../../../utils/logger";

export class getJoinMemberUseCase implements IGetJoinMemberUseCase {
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
