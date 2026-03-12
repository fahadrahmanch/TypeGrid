import { IGetContestUseCase } from "../../interfaces/companyUser/get-contest.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { ContestProps } from "../../../DTOs/companyAdmin/company-contest.dto";
import { mapContestDTO } from "../../../mappers/companyAdmin/company-contest.mapper";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case for retrieving contest details before it starts.
 */
export class GetContestUseCase implements IGetContestUseCase {
  constructor(
    private readonly _contestRepository: IContestRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  /**
   * Get contest information if the user joined and contest is valid.
   */
  async execute(contestId: string, userId: string): Promise<ContestProps> {

    if (!contestId || !userId) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.INVALID_REQUEST
      );
    }

    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND
      );
    }

    const contest = await this._contestRepository.isJoined(contestId, userId);

    if (!contest) {
      throw new CustomError(
        HttpStatusCodes.FORBIDDEN,
        MESSAGES.USER_NOT_JOINED_CONTEST
      );
    }

    if (!["upcoming", "waiting"].includes(contest.status)) {
      throw new CustomError(
        HttpStatusCodes.FORBIDDEN,
        MESSAGES.GROUP_EXPIRED
      );
    }

    return mapContestDTO(contest, userId);
  }
}