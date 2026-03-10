import { ContestProps, openContestDTO } from "../../DTOs/companyAdmin/company-contest.dto";

export type ContestPayload= {
  _id: any;
  contestMode: any;
  title: string;
  description?: string;
  groupId?: any;
  difficulty: any;
  textSource: any;
  contestText?: string;
  status: any;
  date: Date | string;
  startTime?: Date;
  countDown?: number;
  duration: number;
  maxParticipants: number;
  participants: any[];
  rewards: Array<{ rank: number; prize: any }>;
}

export const mapContestDTO = (contest: ContestPayload, userId: string): openContestDTO => {
  return {
    _id: contest._id.toString(),
    contestMode: contest.contestMode,
    title: contest.title,
    description: contest.description || "",
    difficulty: contest.difficulty,
    textSource: contest.textSource,
    contestText: contest.contestText,
    status: contest.status,
    date: new Date(contest.date).toString(),
    startTime: contest.startTime!,
    countDown: contest.countDown ?? 10,
    duration: contest.duration,
    maxParticipants: contest.maxParticipants,
    participants: contest.participants.map(p => ({ userId: p.toString() })),
    rewards: contest.rewards.map(r => ({ rank: r.rank, prize: r.prize })),
  };
};

export const mapOpenContestDTO = (contests: ContestPayload[], userId: string): ContestProps[] => {
  return contests.map((data) => ({
    _id: data._id.toString(),
    contestMode: data.contestMode,
    title: data.title,
    description: data.description || "",
    difficulty: data.difficulty,
    countDown: data.countDown ?? 10,
    textSource: data.textSource,
    contestText: data.contestText,
    status: data.status,
    date: new Date(data.date).toString(),
    startTime: data.startTime!,
    duration: data.duration,
    maxParticipants: data.maxParticipants,
    participants: data.participants.map(p => ({ userId: p.toString() })),
    joined: data.participants.some(p => p.toString() === userId.toString()),
    rewards: data.rewards.map(r => ({ rank: r.rank, prize: r.prize })),
  }));
};

export const mapGroupContestDTO = (contests: ContestPayload[], userId: string) => {
  return contests.map((data) => ({
    _id: data._id.toString(),
    contestMode: data.contestMode,
    title: data.title,
    description: data.description || "",
    targetGroup: data.groupId?.toString() || "",
    difficulty: data.difficulty,
    textSource: data.textSource,
    contestText: data.contestText,
    status: data.status,
    date: new Date(data.date).toString(),
    startTime: data.startTime!,
    countDown: data.countDown ?? 10,
    duration: data.duration,
    maxParticipants: data.maxParticipants,
    participants: data.participants.map(p => ({ userId: p.toString() })),
    joined: data.participants.some(p => p.toString() === userId.toString()),
    rewards: data.rewards.map(r => ({ rank: r.rank, prize: r.prize })),
  }));
};

export const mapCompanyContestDTO = (contests: ContestPayload[]): ContestProps[] => {
  return contests.map((data) => ({
    _id: data._id.toString(),
    contestMode: data.contestMode,
    title: data.title,
    description: data.description || "",
    targetGroup: data.groupId?.toString() || "",
    difficulty: data.difficulty,
    textSource: data.textSource,
    contestText: data.contestText,
    status: data.status,
    date: new Date(data.date).toString(),
    startTime: data.startTime!,
    duration: data.duration,
    countDown: data.countDown ?? 10,
    maxParticipants: data.maxParticipants,
    participants: data.participants.map(p => ({ userId: p.toString() })),
    rewards: data.rewards.map(r => ({ rank: r.rank, prize: r.prize })),
  }));
};

export const mapContestDTOAdmin = (contest: ContestPayload) => {
  return {
    _id: contest._id.toString(),
    contestMode: contest.contestMode,
    title: contest.title,
    description: contest.description || "",
    targetGroup: contest.groupId?.toString() || "",
    difficulty: contest.difficulty,
    textSource: contest.textSource,
    contestText: contest.contestText,
    status: contest.status,
    date: new Date(contest.date).toString(),
    startTime: contest.startTime!,
    countDown: contest.countDown ?? 10,
    duration: contest.duration,
    maxParticipants: contest.maxParticipants,
    participants: contest.participants.map(p => ({ userId: p.toString() })),
    rewards: contest.rewards.map(r => ({ rank: r.rank, prize: r.prize })),
  };
};
