import { IGetGroupContestsUseCase } from '../../interfaces/companyUser/get-group-contest.interface';
import { ICompanyGroupRepository } from '../../../../domain/interfaces/repository/company/company-group-repository.interface';
import { IContestRepository } from '../../../../domain/interfaces/repository/company/contest-repository.interface';
import { groupContestDTO } from '../../../DTOs/companyAdmin/company-contest.dto';
import { mapGroupContestDTO } from '../../../mappers/companyAdmin/company-contest.mapper';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';
import { MESSAGES } from '../../../../domain/constants/messages';
import { ContestEntity } from '../../../../domain/entities/company-contest.entity';
/**
 * Use case for retrieving contests belonging to the user's groups.
 */
export class GetGroupContestUseCase implements IGetGroupContestsUseCase {
  constructor(
    private readonly _contestRepository: IContestRepository,
    private readonly _companyGroupRepository: ICompanyGroupRepository
  ) {}

  /**
   * Get contests for groups the user belongs to.
   */
  async execute(userId: string): Promise<groupContestDTO[]> {
    if (!userId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    const groups = await this._companyGroupRepository.getGroup(userId);

    if (!groups?.length) return [];

    const groupIds = groups.map((group) => group.id);

    const groupContests = await this._contestRepository.getGroupContests(groupIds);

    if (!groupContests.length) return [];

    return mapGroupContestDTO(
      groupContests.map((c: ContestEntity) => c.toObject()),
      userId
    );
  }
}
