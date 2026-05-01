import { DiscussionEntity } from "../../../domain/entities/user/discussion.entity";

export interface AnotherUserProfileDTO {
  user: {
    _id?: string;
    name: string;
    email: string;
    imageUrl?: string;
    bio?: string;
    level: number;
    joinedAt?: Date;
  };
  performance: {
    averageSpeed: number;
    accuracy: number;
    competitions: number;
  };
  discussions: DiscussionEntity[];
  achievements: {
    name: string;
    icon: string;
    unlockedAt: Date;
  }[];
}
