import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IGetContestParticipantsUseCase } from "../../interfaces/companyAdmin/get-contest-participants.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { ParticipantsDTO } from "../../../DTOs/companyAdmin/company-contest.dto";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case for retrieving participants of a contest.
 * 
 * Fetches a contest by its ID and retrieves detailed information about all participants
 * enrolled in that contest.
 */
export class GetContestParticipantsUseCase implements IGetContestParticipantsUseCase {
  constructor(
    private readonly _contestRepository: IContestRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(contestId: string): Promise<ParticipantsDTO[]> {
    const contest = await this._contestRepository.findById(contestId);

    if (!contest) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.CONTEST_NOT_FOUND,
      );
    }

    const participants = await Promise.all(
      contest.participants.map(async (participantId: string) => {
        const user = await this._userRepository.findById(participantId);

        if (!user) {
          throw new CustomError(
            HttpStatusCodes.NOT_FOUND,
            MESSAGES.AUTH_USER_NOT_FOUND,
          );
        }

        return {
          name: user.name,
          email: user.email,
        } as ParticipantsDTO;
      }),
    );

    return participants;
  }
}