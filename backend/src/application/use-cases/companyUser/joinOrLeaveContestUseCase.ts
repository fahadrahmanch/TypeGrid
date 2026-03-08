import { IJoinOrLeaveContestUseCase } from "../interfaces/companyUser/IoinOrLeaveContestUseCase";
import { IContestRepository } from "../../../domain/interfaces/repository/company/IContestRepository";
import { IUserRepository } from "../../../domain/interfaces/repository/user/IUserRepository";
import { MESSAGES } from "../../../domain/constants/messages";
import { ContestEntity } from "../../../domain/entities/companyContestEntity";
import { openContestDTO } from "../../../application/DTOs/companyAdmin/CompanyContestDTO";
import { mapContestDTO } from "../../../application/DTOs/companyAdmin/CompanyContestDTO";
export class joinOrLeaveContestUseCase implements IJoinOrLeaveContestUseCase {
  constructor(
    private readonly contestRepository: IContestRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(
    userId: string,
    contestId: string,
    action: string,
  ): Promise<openContestDTO> {
    if (!userId) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const contest = await this.contestRepository.findById(contestId);
    if (!contest) {
      throw new Error(MESSAGES.CONTEST_NOT_FOUND);
    }
    const contestEntity = contest;
    if (action == "join") {
      contestEntity.joinContest(userId);
    } else if (action == "cancel") {
      contestEntity.unJoin(userId);
    }
    const Object = contestEntity.toObject();
    const contests = await this.contestRepository.update(contestEntity);
    return mapContestDTO(contests as any, userId);
  }
}
