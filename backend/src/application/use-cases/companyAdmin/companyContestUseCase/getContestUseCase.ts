import { MESSAGES } from "../../../../domain/constants/messages";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/IContestRepository";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { ContestProps } from "../../../DTOs/companyAdmin/CompanyContestDTO";
import { IGetContestUseCase } from "../../interfaces/companyAdmin/IGetContestUseCase";
import { mapContestDTOAdmin } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export class getContestUseCase implements IGetContestUseCase {
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

    return mapContestDTOAdmin(contest as any);
  }
}
