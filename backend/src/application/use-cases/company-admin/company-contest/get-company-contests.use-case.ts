import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { IGetCompanyContestsUsecase } from "../../interfaces/companyAdmin/get-company-contests.interface";
import { ContestProps } from "../../../DTOs/companyAdmin/company-contest.dto";
import { mapCompanyContestDTO } from "../../../mappers/companyAdmin/company-contest.mapper";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case for retrieving all contests associated with a company.
 *
 * This class fetches contests for a company by first validating that the user exists,
 * then retrieving all contests linked to the user's company ID.
 */
export class GetCompanyContestsUseCase implements IGetCompanyContestsUsecase {
  constructor(
    private readonly _contestRepository: IContestRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<ContestProps[]> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }

    const contests = await this._contestRepository.find({
      CompanyId: user.CompanyId,
    });

    if (!contests || contests.length === 0) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.CONTESTS_NOT_FOUND,
      );
    }

    return mapCompanyContestDTO(contests.map((c) => c.toObject()));
  }
}
