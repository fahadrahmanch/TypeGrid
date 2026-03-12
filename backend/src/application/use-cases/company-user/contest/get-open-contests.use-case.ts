import { IGetOpenContestsUseCase } from "../../interfaces/companyUser/get-open-contests.interface";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { openContestDTO } from "../../../DTOs/companyAdmin/company-contest.dto";
import { mapOpenContestDTO } from "../../../mappers/companyAdmin/company-contest.mapper";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case for retrieving open contests available to the user.
 */
export class GetOpenContestsUseCase implements IGetOpenContestsUseCase {
  constructor(
    private readonly _contestRepository: IContestRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  /**
   * Get upcoming open contests for the user's company.
   */
  async execute(userId: string): Promise<openContestDTO[]> {

    if (!userId) {
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

    const now = new Date();

    const contests = await this._contestRepository.find({
      companyId: user.companyId,
      status: "upcoming",
      contestMode: "open",
      date: { $gt: now },
    });

    return mapOpenContestDTO(contests, userId);
  }
}