import { UserProfileDTO } from '../../DTOs/user/user-profile.dto';
import { UserEntity } from '../../../domain/entities/user.entity';
import { AuthUserEntity } from '../../../domain/entities';

export const mapToUserProfileDTO = (user: UserEntity | AuthUserEntity): UserProfileDTO => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl,
    bio: user.bio,
    age: user.age,
    number: user.number,
    KeyBoardLayout: user.KeyBoardLayout,
    status: user.status,
    contactNumber: user.contactNumber,
    gender: user.gender,
    role: user.role,
  };
};
