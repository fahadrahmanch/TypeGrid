import { IGetPendingUsersUseCase } from '../../interfaces/companyAdmin/get-pending-users.interface';
import { IUserRepository } from '../../../../domain/interfaces/repository/user/user-repository.interface';
import { ILessonAssignmentRepository } from '../../../../domain/interfaces/repository/company/lesson-assignment-repository.interface';
import { IPendingUserDTO } from '../../../DTOs/companyAdmin/get-pending-users.dto';
import { pendingUserMapper } from '../../../mappers/companyAdmin/pending-user.mapper';
/**
 * Use case for retrieving pending lesson completions.
 * [Skeleton - Logic removed as requested]
 */
export class GetPendingUsersUseCase implements IGetPendingUsersUseCase {
  constructor(
    private _assignLessonRepository: ILessonAssignmentRepository,
    private _userRepository: IUserRepository,
  ) { }

  async execute(userId: string): Promise<{ total: number; users: IPendingUserDTO[], userIds: string[] }> {
    // Logic will be implemented here
    console.log('GetPendingUsersUseCase.execute called for userId:', userId);
    const companyAdmin = await this._userRepository.findById(userId);
    if (!companyAdmin) {
      throw new Error('Company admin not found');
    }
    const companyId = companyAdmin.CompanyId;
    if (!companyId) {
      throw new Error('Company not found');
    }
    const pendingUsers = await this._assignLessonRepository.getPendingUsers(companyId);
    const userIds = [...new Set(pendingUsers.map((item) => item.getUserId()))]
    const users = await Promise.all(
      userIds.map(async (item) => {
        const user = await this._userRepository.findById(item)
        const length = pendingUsers.filter((item) => item.getUserId() == user?._id).length
        return pendingUserMapper(user!,length)
      })
    )
    return {
      total: pendingUsers.length,
      users,
      userIds
    }
  }
}
