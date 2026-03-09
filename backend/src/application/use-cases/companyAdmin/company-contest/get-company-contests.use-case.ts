import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { IGetCompanyContestsUsecase } from "../../interfaces/companyAdmin/get-company-contests.interface";
import { ContestProps } from "../../../DTOs/companyAdmin/company-contest.dto";
import { mapCompanyContestDTO } from "../../../mappers/companyAdmin/company-contest.mapper";
export class GetCompanyContestsUseCase implements IGetCompanyContestsUsecase {
  constructor(
    private contestRepository: IContestRepository,
    private userRepository: IUserRepository,
  ) { }
  async execute(userId: string): Promise<ContestProps[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const contests = await this.contestRepository.find({
      CompanyId: user.CompanyId,
    });
    if (!contests) {
      throw new Error(MESSAGES.CONTESTS_NOT_FOUND);
    }
    return mapCompanyContestDTO(contests);
  }
}
