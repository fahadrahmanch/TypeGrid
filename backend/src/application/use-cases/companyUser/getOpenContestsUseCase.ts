import { IGetOpenContestsUseCase } from "../interfaces/companyUser/IGetOpenContestsUseCase";
import { IContestRepository } from "../../../domain/interfaces/repository/company/IContestRepository";
import { IUserRepository } from "../../../domain/interfaces/repository/user/IUserRepository";
import { MESSAGES } from "../../../domain/constants/messages";
import { openContestDTO } from "../../DTOs/companyAdmin/CompanyContestDTO";
import { mapOpenContestDTO } from "../../DTOs/companyAdmin/CompanyContestDTO";
export class getOpenContestsUseCase implements IGetOpenContestsUseCase {
  constructor(
    private readonly contestRepository: IContestRepository,
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(userId: string): Promise<openContestDTO[]> {
    if (!userId) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const contests = await this.contestRepository.find({
      CompanyId: user.CompanyId,
      status: "upcoming",
      contestMode: "open",
      date: {
        $gt: new Date(),
      },
    });

    return mapOpenContestDTO(contests as any, userId);
  }
}
