import { IGetContestUseCase } from "../interfaces/companyUser/get-contest.interface";
import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { IContestRepository } from "../../../domain/interfaces/repository/company/contest-repository.interface";
import { MESSAGES } from "../../../domain/constants/messages";
import { ContestProps } from "../../DTOs/companyAdmin/company-contest.dto";
import { mapContestDTO } from "../../mappers/companyAdmin/company-contest.mapper";
export class GetContestUseCase implements IGetContestUseCase {
  constructor(
    private readonly contestRepository: IContestRepository,
    private readonly userRepository: IUserRepository,
    private readonly _contestRepository: IContestRepository,
  ) {}
  async execute(contestId: string, userId: string): Promise<ContestProps> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const isJoined = await this._contestRepository.isJoined(contestId, userId);
    if (!isJoined) {
      throw new Error(MESSAGES.USER_NOT_JOINED_CONTEST);
    }
    const allowedStatuses = ["upcoming", "waiting"];

    if (!allowedStatuses.includes((isJoined as any).status)) {
      throw new Error(MESSAGES.GROUP_EXPIRED);
    }
    return mapContestDTO(isJoined, userId);
  }
}
