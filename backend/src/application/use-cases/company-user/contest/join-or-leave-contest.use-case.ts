import { IJoinOrLeaveContestUseCase } from "../../interfaces/companyUser/join-or-leave-contest.interface";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { ContestEntity } from "../../../../domain/entities/company-contest.entity";
import { openContestDTO } from "../../../DTOs/companyAdmin/company-contest.dto";
import { mapContestDTO } from "../../../mappers/companyAdmin/company-contest.mapper";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
export class JoinOrLeaveContestUseCase implements IJoinOrLeaveContestUseCase {
  constructor(
    private readonly contestRepository: IContestRepository,
    private readonly userRepository: IUserRepository,
  ) { }
  async execute(
    userId: string,
    contestId: string,
    action: string,
  ): Promise<openContestDTO> {
    if (!userId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const contest = await this.contestRepository.findById(contestId);
    if (!contest) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.CONTEST_NOT_FOUND);
    }
    const contestEntity = new ContestEntity(contest);
    if (action == "join") {
      contestEntity.joinContest(userId);
    } else if (action == "cancel") {
      contestEntity.unJoin(userId);
    }
    const Object = contestEntity.toObject();
    const contests = await this.contestRepository.update(Object);
    return mapContestDTO(contests, userId);
  }
}
