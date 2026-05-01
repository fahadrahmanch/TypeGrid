import { CompetitionDTOSoloPlay } from "../../DTOs/user/competition-solo-play.dto";

export type PopulatedSoloCompetitionPayload = {
  _id: any;
  mode: string;
  status: any;
  duration: number;
  startedAt?: Date | string;
  countDown: number;
  lesson: {
    _id?: string;
    text: string;
    category: string;
    level: string;
  };
  participants: {
    _id: any;
    name: string;
    imageUrl?: string;
  }[];
};

export const mapCompetitionToDTOSoloPlay = (competition: PopulatedSoloCompetitionPayload): CompetitionDTOSoloPlay => {
  return {
    _id: competition._id!.toString(),
    mode: competition.mode,
    status: competition.status,
    duration: competition.duration,
    startedAt: competition.startedAt ? competition.startedAt.toString() : "",
    countDown: competition.countDown,
    lesson: {
      _id: competition.lesson._id ?? "",
      text: competition.lesson.text,
      category: competition.lesson.category,
      level: competition.lesson.level,
    },
    participants: competition.participants.map((user) => ({
      _id: user._id!.toString(),
      name: user.name,
      imageUrl: user.imageUrl || "",
      isHost: false,
    })),
  };
};
