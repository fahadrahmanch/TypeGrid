import { IGetOpenContestsUseCase } from "../../interfaces/companyUser/get-open-contests.interface";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { openContestDTO } from "../../../DTOs/companyAdmin/company-contest.dto";
import { mapOpenContestDTO } from "../../../mappers/companyAdmin/company-contest.mapper";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
export class GetOpenContestsUseCase implements IGetOpenContestsUseCase {
  constructor(
    private readonly contestRepository: IContestRepository,
    private readonly userRepository: IUserRepository,
  ) { }
  async execute(userId: string): Promise<openContestDTO[]> {
    if (!userId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const contests = await this.contestRepository.find({
      CompanyId: user.CompanyId,
      status: "upcoming",
      contestMode: "open",
      date: {
        $gt: new Date(),
      },
    });

    return mapOpenContestDTO(contests, userId);
  }
}
