import { CompetitionDTOQuickPlay, CompetitionMember } from "../../DTOs/user/competition-quick-play.dto";

export interface PopulatedQuickCompetitionPayload {
  _id: any;
  mode: string;
  status: any;
  duration: number;
  startedAt?: Date | string;
  countDown: number;
  lesson: {
    _id: any;
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

export const mapCompetitionToDTOQuickPlay = (
  competition: PopulatedQuickCompetitionPayload
): CompetitionDTOQuickPlay => {
  return {
    _id: competition._id!.toString(),
    mode: competition.mode,
    status: competition.status,
    duration: competition.duration,
    startedAt: competition.startedAt ? competition.startedAt.toString() : "",
    countDown: competition.countDown,
    lesson: {
      id: competition.lesson._id!.toString(),
      text: competition.lesson.text,
      category: competition.lesson.category,
      level: competition.lesson.level,
    },
    participants: competition.participants.map((user) => ({
      _id: user._id!.toString(),
      name: user.name,
      imageUrl: user.imageUrl || "",
    })),
  };
};

export const mapQuickMemberToDTO = (user: { _id: any; name: string; imageUrl?: string }): CompetitionMember => {
  return {
    _id: user._id,
    name: user.name,
    imageUrl: user.imageUrl || "",
  };
};
