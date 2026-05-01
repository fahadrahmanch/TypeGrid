import { UserProfileDTO } from "../../DTOs/user/user-profile.dto";
import { UserEntity } from "../../../domain/entities/user.entity";
import { AuthUserEntity } from "../../../domain/entities";
import { AnotherUserProfileDTO } from "../../DTOs/user/another-user-profile.dto";
import { StatsEntity } from "../../../domain/entities/stats.entity";
import { DiscussionEntity } from "../../../domain/entities/user/discussion.entity";

export const mapToUserProfileDTO = (user: UserEntity | AuthUserEntity, stats?: StatsEntity | null): UserProfileDTO => {
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
    level: stats?.getLevel() || 1,
    joinedAt: user.createdAt,
    performance: {
      averageSpeed: stats?.getWpm() || 0,
      accuracy: stats?.getAccuracy() || 0,
      competitions: stats?.getTotalCompetitions() || 0,
    },
  };
};

export const mapToAnotherUserProfileDTO = (
  user: UserEntity,
  stats: StatsEntity | null,
  discussions: DiscussionEntity[],
  achievements: { name: string; icon: string; unlockedAt: Date }[]
): AnotherUserProfileDTO => {
  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      bio: user.bio,
      level: stats?.getLevel() || 1,
      joinedAt: user.createdAt,
    },
    performance: {
      averageSpeed: stats?.getWpm() || 0,
      accuracy: stats?.getAccuracy() || 0,
      competitions: stats?.getTotalCompetitions() || 0,
    },
    discussions: discussions || [],
    achievements: achievements,
  };
};
