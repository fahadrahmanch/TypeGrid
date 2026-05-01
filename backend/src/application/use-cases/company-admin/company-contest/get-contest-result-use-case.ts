import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IGetContestResultUseCase } from "../../interfaces/companyUser/get-contest-result.interface";
import { IResultRepository } from "../../../../domain/interfaces/repository/result-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { contestResultMapper } from "../../../mappers/companyAdmin/contest-result.mapper";
import { contestResultDTO } from "../../../DTOs/companyAdmin/contest-result.dto";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
/**
 * use case for get contest result
 */
export class GetContestResultUseCase implements IGetContestResultUseCase {
  constructor(
    private readonly _contestRepository: IContestRepository,
    private readonly _resultRepository: IResultRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(contestId: string): Promise<contestResultDTO[]> {
    const contest = await this._contestRepository.findById(contestId);
    if (!contest) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.CONTEST_NOT_FOUND);
    }
    const result = await this._resultRepository.find({ contestId });
    const mappedResult = await Promise.all(
      result.map(async (item: any) => {
        const user = await this._userRepository.findById(item.userId);
        return contestResultMapper({
          ...item.toObject(),
          userId: {
            _id: user?._id,
            name: user?.name,
            imageUrl: user?.imageUrl,
          },
        });
      })
    );
    if (!result) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.RESULT_NOT_FOUND);
    }
    return mappedResult;
  }
}
