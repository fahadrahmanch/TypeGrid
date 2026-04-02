import {
  SentChallengeDTO,
  OpponentDTO,
  ChallengeDTO,
  ChallengeGameDTO,
} from "../../DTOs/companyUser/challenge.dto";

export type ChallengeOpponentPayload = {
  _id: any;
  name: string;
  email: string;
  imageUrl?: string;
  CompanyRole?: string;
};

export type SentChallengePayload = {
  _id: any;
  receiverId: any;
  status: string;
};

export type ChallengePayload = {
  _id: any;
  CompanyId: any;
  senderId: any;
  receiverId: any;
  status: string;
  competitionId?: any;
  type?: string;
  opponent: ChallengeOpponentPayload;
  createdAt?: Date;
  updatedAt?: Date;
};

export const mapSentChallengeToDTO = (
  challenge: SentChallengePayload,
): SentChallengeDTO => {
  return {
    challengeId: challenge._id!.toString(),
    receiverId: challenge.receiverId.toString(),
    status: challenge.status,
  };
};

export const mapOpponentToDTO = (
  user: ChallengeOpponentPayload,
): OpponentDTO => {
  return {
    id: user._id!.toString(),
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl || "",
    companyRole: user.CompanyRole ?? null,
  };
};

export const mapChallengeToDTO = (
  challenge: ChallengePayload,
): ChallengeDTO => {
  return {
    id: challenge._id!.toString(),
    companyId: challenge.CompanyId.toString(),
    senderId: challenge.senderId.toString(),
    receiverId: challenge.receiverId.toString(),
    status: challenge.status,
    competitionId: challenge.competitionId
      ? challenge.competitionId.toString()
      : "",
    type: challenge.type as "sent" | "received" | "completed",
    opponent: mapOpponentToDTO(challenge.opponent),
    createdAt: challenge.createdAt!,
    updatedAt: challenge.updatedAt!,
  };
};

export interface ChallengeGamePayload {
  competition: {
    _id: any;
    startedAt?: Date;
    status: any;
    duration: number;
    CompanyId?: any;
    countDown: number;
  };
  lesson: {
    _id: any;
    title?: string;
    text: string;
  };
  players: {
    _id: any;
    name: string;
    imageUrl?: string;
    CompanyId?: any;
    CompanyRole?: string;
    bio?: string;
  }[];
}

export const mapChallengeGameToDTO = (
  data: ChallengeGamePayload,
): ChallengeGameDTO => {
  return {
    id: data.competition._id!.toString(),
    startedAt: data.competition.startedAt!,
    status: data.competition.status,
    duration: data.competition.duration,
    companyId: data.competition.CompanyId
      ? data.competition.CompanyId.toString()
      : "",
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
