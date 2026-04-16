import { MESSAGES } from '../../../../domain/constants/messages';
import { IContestRepository } from '../../../../domain/interfaces/repository/company/contest-repository.interface';
import { IUserRepository } from '../../../../domain/interfaces/repository/user/user-repository.interface';
import { ContestProps } from '../../../DTOs/companyAdmin/company-contest.dto';
import { IGetContestUseCase } from '../../interfaces/companyAdmin/get-contest.interface';
import { mapContestDTOAdmin } from '../../../mappers/companyAdmin/company-contest.mapper';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';

/**
 * Use case for retrieving a contest by ID with admin-level details.
 *
 * Validates that both the user and contest exist before returning the contest data.
 */
export class GetContestUseCase implements IGetContestUseCase {
  constructor(
    private readonly _contestRepository: IContestRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(contestId: string, userId: string): Promise<ContestProps> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    const contest = await this._contestRepository.findById(contestId);

    if (!contest) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.CONTEST_NOT_FOUND);
    }

    return mapContestDTOAdmin(contest.toObject());
  }
}
