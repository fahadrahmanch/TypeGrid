import { CompetitionDTOGroupPlay } from '../../DTOs/user/competition-group-play.dto';

export interface PopulatedGroupCompetitionPayload {
  _id: any;
  mode: string;
  status: any;
  duration: number;
  groupId?: any;
  startedAt?: Date | string;
  countDown: number;
  joinLink?: string;
  lesson: {
    id: any;
    text: string;
    category: string;
    level: string;
  };
  participants: {
    _id: any;
    name: string;
    imageUrl?: string;
  }[];
}

export const mapCompetitionToDTOGroupPlay = (
  competition: PopulatedGroupCompetitionPayload,
  hostUserId: string
): CompetitionDTOGroupPlay => {
  return {
    _id: competition._id!.toString(),
    mode: competition.mode,
    status: competition.status,
    duration: competition.duration,
    groupId: competition.groupId?.toString(),
    startedAt: competition.startedAt ? competition.startedAt.toString() : '',
    countDown: competition.countDown,
    JoinLink: competition.joinLink,
    lesson: {
      id: competition.lesson.id!.toString(),
      text: competition.lesson.text,
      category: competition.lesson.category,
      level: competition.lesson.level,
    },
    participants: competition.participants.map((user) => ({
      _id: user._id!.toString(),
      name: user.name,
      imageUrl: user.imageUrl || '',
      isHost: user._id!.toString() === hostUserId.toString(),
    })),
  };
};
