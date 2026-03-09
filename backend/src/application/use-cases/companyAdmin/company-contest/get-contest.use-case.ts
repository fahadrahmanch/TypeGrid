import { MESSAGES } from "../../../../domain/constants/messages";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ContestProps } from "../../../DTOs/companyAdmin/company-contest.dto";
import { IGetContestUseCase } from "../../interfaces/companyAdmin/get-contest.interface";
import { mapContestDTOAdmin } from "../../../mappers/companyAdmin/company-contest.mapper";
export class GetContestUseCase implements IGetContestUseCase {
  constructor(
    private readonly contestRepository: IContestRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(contestId: string, userId: string): Promise<ContestProps> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const contest = await this.contestRepository.findById(contestId);
    if (!contest) {
      throw new Error(MESSAGES.CONTEST_NOT_FOUND);
    }

    return mapContestDTOAdmin(contest);
  }
}
