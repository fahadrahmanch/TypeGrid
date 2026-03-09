import { ICompetitionDocument, IUserDocument } from "../../../infrastructure/db/types/documents";
import { CompetitionDTOSoloPlay } from "../../DTOs/user/competition-solo-play.dto";

export interface PopulatedSoloCompetitionPayload extends Omit<ICompetitionDocument, "participants" | "textId"> {
  lesson: {
    id: string;
    text: string;
    category: string;
    level: string;
  };
  participants: IUserDocument[];
}

export const mapCompetitionToDTOSoloPlay = (
  competition: PopulatedSoloCompetitionPayload,
): CompetitionDTOSoloPlay => {
  return {
    _id: competition._id!.toString(),
    mode: competition.mode,
    status: competition.status,
    duration: competition.duration,
    startedAt: competition.startedAt ? competition.startedAt.toString() : "",
    countDown: competition.countDown,
    lesson: {
      id: competition.lesson.id,
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
