export type ContestMode = 'group' | 'open';
export type TextSource = 'manual' | 'random';

export interface RewardDTO {
  rank: number;
  prize: number;
}
export interface ParticipantDTO {
  userId: string;
  // score: number;
  // joinedAt: string;
}
export interface ContestProps {
  contestMode: ContestMode;
  _id: string;
  title: string;
  description: string;
  startTime: Date;

  targetGroup?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  textSource: TextSource;
  contestText?: string;
  date: string;

  countDown?: number;
  status: string;
  participants: ParticipantDTO[];
  duration: number;
  maxParticipants: number;

  rewards: RewardDTO[];
}
export interface CreateContestDTO {
  contestMode: ContestMode;
  title: string;
  description: string;
  targetGroup?: string;
  startTime: Date | string;
  difficulty: 'easy' | 'medium' | 'hard';
  textSource: TextSource;
  contestText?: string;
  date: string;
  countDown?: number;
  duration: number;
  maxParticipants: number;
  groupId?: string;
  rewards: RewardDTO[];
}
export interface openContestDTO {
  _id: string;
  contestMode: ContestMode;
  title: string;
  description: string;
  targetGroup?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  textSource: TextSource;
  contestText?: string;
  status: string;
  countDown?: number;
  startTime: Date;
  date: string;
  joined?: boolean;
  duration: number;
  participants: ParticipantDTO[];
  maxParticipants: number;
  rewards: RewardDTO[];
}
export interface groupContestDTO {
  _id: string;
  contestMode: ContestMode;
  title: string;
  description: string;
  targetGroup?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  textSource: TextSource;
  contestText?: string;
  status: string;
  countDown: number;
  startTime: Date;
  date: string;
  duration: number;
  participants: ParticipantDTO[];
  maxParticipants: number;
  rewards: RewardDTO[];
}

export interface ParticipantsDTO {
  userId?: string;
  email: string;
  name?: string;

  // score: number;
  // joinedAt: string;
}
export interface GetGroupContestDTO {
  _id?: string;
  contestMode: 'open' | 'group';
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  groupId?: string;
  textSource: 'manual' | 'random';
  participants: string[];
  contestText?: string;
  date: Date;
  startTime?: Date;
  duration: number;
  maxParticipants: number;
  rewards: Array<{ rank: number; prize: number }>;
  status: 'upcoming' | 'ongoing' | 'completed' | 'waiting';
  countDown?: number;
  startedAt?: Date;
  CompanyId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
