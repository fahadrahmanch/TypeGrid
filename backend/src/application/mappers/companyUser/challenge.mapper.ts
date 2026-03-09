import { ICompanyChallengeDocument, IUserDocument, ICompetitionDocument, ILessonDocument } from "../../../infrastructure/db/types/documents";
import { SentChallengeDTO, OpponentDTO, ChallengeDTO, ChallengeGameDTO } from "../../DTOs/companyUser/challenge.dto";

export const mapSentChallengeToDTO = (challenge: ICompanyChallengeDocument): SentChallengeDTO => {
  return {
    challengeId: challenge._id!.toString(),
    receiverId: challenge.receiverId.toString(),
    status: challenge.status,
  };
};

export const mapOpponentToDTO = (user: IUserDocument): OpponentDTO => {
  return {
    id: user._id!.toString(),
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl || "",
    companyRole: user.CompanyRole ?? null,
  };
};

export type PopulatedChallengePayload = ICompanyChallengeDocument & { opponent: IUserDocument, type?: string };

export const mapChallengeToDTO = (challenge: PopulatedChallengePayload): ChallengeDTO => {
  return {
    id: challenge._id!.toString(),
    companyId: challenge.CompanyId.toString(),
    senderId: challenge.senderId.toString(),
    receiverId: challenge.receiverId.toString(),
    status: challenge.status,
    competitionId: challenge.competitionId ? challenge.competitionId.toString() : "",
    type: challenge.type as "sent" | "received" | "completed",
    opponent: mapOpponentToDTO(challenge.opponent),
    createdAt: challenge.createdAt!,
    updatedAt: challenge.updatedAt!,
  };
};

export interface ChallengeGamePayload {
  competition: ICompetitionDocument;
  lesson: ILessonDocument;
  players: IUserDocument[];
}

export const mapChallengeGameToDTO = (data: ChallengeGamePayload): ChallengeGameDTO => {
  return {
    id: data.competition._id!.toString(),
    startedAt: data.competition.startedAt!,
    status: data.competition.status,
    duration: data.competition.duration,
    companyId: data.competition.CompanyId ? data.competition.CompanyId.toString() : "",
    countDown: data.competition.countDown,
    lesson: {
      id: data.lesson._id!.toString(),
      title: data.lesson.title || "",
      text: data.lesson.text,
    },
    players: data.players.map((player) => ({
      id: player._id!.toString(),
      name: player.name,
      imageUrl: player.imageUrl || "",
      companyId: player.CompanyId ? player.CompanyId.toString() : "",
      companyRole: player.CompanyRole || null,
      bio: player.bio || null,
    })),
  };
};
