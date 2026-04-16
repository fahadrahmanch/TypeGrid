import { ICreateCompanyGroupAutoUseCase } from '../../interfaces/companyAdmin/create-company-group-auto.interface';
import { IUserRepository } from '../../../../domain/interfaces/repository/user/user-repository.interface';
import { ICompanyGroupRepository } from '../../../../domain/interfaces/repository/company/company-group-repository.interface';
import { ICompanyUserStatsRepository } from '../../../../domain/interfaces/repository/company/company-user-stats-repository.interface';
import { CreateCompanyGroupAutoDTO } from '../../../DTOs/companyAdmin/create-company-group-auto.dto';
import { CompanyGroupEntity } from '../../../../domain/entities/company-group.entity';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';
import { MESSAGES } from '../../../../domain/constants/messages';
export class CreateCompanyGroupAutoUseCase implements ICreateCompanyGroupAutoUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly companyGroupRepo: ICompanyGroupRepository,
    private readonly companyUserStatsRepo: ICompanyUserStatsRepository
  ) {}
  async execute(groupData: CreateCompanyGroupAutoDTO, userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const companyId = user.CompanyId;
    if (!companyId) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
    }
    const users = await this.companyUserStatsRepo.getCompanyUserStatsBasedOnCriteria(
      companyId,
      Number(groupData.minWpm),
      Number(groupData.maxWpm),
      Number(groupData.minAccuracy),
      Number(groupData.maxAccuracy)
    );
    if (users.length === 0) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.NO_USERS_FOUND_FOR_CRITERIA);
    }
    const companyGroup = new CompanyGroupEntity({
      companyId: user.CompanyId!,
      name: groupData.groupName,
      type: groupData.groupType,
      members: users,
    });

    await this.companyGroupRepo.create(companyGroup.toObject());
  }
}
