import { IPendingUserDTO } from '../../DTOs/companyAdmin/get-pending-users.dto';
import { UserEntity } from '../../../domain/entities/user.entity';

export const pendingUserMapper = (user: UserEntity, pendingCount: number): IPendingUserDTO => {
  return {
    id: user._id || '',
    name: user.name,
    email: user.email,
    pendingLessons: pendingCount,
  };
};
