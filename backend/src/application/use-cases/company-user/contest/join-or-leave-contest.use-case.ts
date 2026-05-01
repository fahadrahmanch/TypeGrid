import { IJoinOrLeaveContestUseCase } from "../../interfaces/companyUser/join-or-leave-contest.interface";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { openContestDTO } from "../../../DTOs/companyAdmin/company-contest.dto";
import { mapContestDTO } from "../../../mappers/companyAdmin/company-contest.mapper";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case for joining or leaving a contest.
 */
export class JoinOrLeaveContestUseCase implements IJoinOrLeaveContestUseCase {
  constructor(
    private readonly _contestRepository: IContestRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  /**
   * Join or cancel participation in a contest.
   */
  async execute(userId: string, contestId: string, action: "join" | "cancel"): Promise<openContestDTO> {
    if (!userId || !contestId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    const contest = await this._contestRepository.findById(contestId);
    if (!contest) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.CONTEST_NOT_FOUND);
    }

    if (action === "join") {
      contest.joinContest(userId);
    } else {
      contest.unJoin(userId);
    }

    const updatedContest = await this._contestRepository.update(contest.toObject());
    if (!updatedContest) {
      throw new CustomError(HttpStatusCodes.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG);
    }

    return mapContestDTO(updatedContest.toObject(), userId);
  }
}
