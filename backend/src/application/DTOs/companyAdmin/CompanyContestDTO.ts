export type ContestMode = "group" | "open";
export type TextSource = "manual" | "random";

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
  _id:string;
  title: string;
  description: string;
      startTime:Date,

  targetGroup?: string;
  difficulty: "easy" | "medium" | "hard";
  textSource: TextSource;
  contestText?: string;
  date:string;
  status:string;
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
  startTime:Date|string;
  difficulty: "easy" | "medium" | "hard";
  textSource: TextSource;
  contestText?: string;
  date: string;
  duration: number;
  maxParticipants: number;
  groupId?:string
  rewards: RewardDTO[];
}
export interface openContestDTO {
  _id:string;
  contestMode: ContestMode;
  title: string;
  description: string;
  targetGroup?: string; 
  difficulty: "easy" | "medium" | "hard";
  textSource: TextSource;
  contestText?: string;
  status:string;
  startTime: Date
  date: string;
  duration: number;
  participants: ParticipantDTO[];
  maxParticipants: number;
  rewards: RewardDTO[];
}
export const mapContestDTO = (
  contest: openContestDTO,
  userId:string
) => {
  return {
    _id:contest._id.toString(),
    contestMode: contest.contestMode,
    title: contest.title,
    description: contest.description,
    targetGroup: contest.targetGroup,
    difficulty: contest.difficulty,
   
    textSource: contest.textSource,
    contestText: contest.contestText,
    status:contest.status,
    // string → Date
    date: new Date(contest.date).toString(),
    startTime:contest.startTime,
    duration: contest.duration,
    maxParticipants: contest.maxParticipants,
  participants: contest.participants,
    joined: contest.participants.some((p) => p.toString() === userId.toString()),
    rewards: contest.rewards.map((reward) => ({
      rank: reward.rank,
      prize: reward.prize,
    })),
  };
};
export const mapOpenContestDTO = (
  contests: openContestDTO[],
  userId:string
): ContestProps[] => {
  return contests.map((data) => ({
    _id:data._id.toString(),
    contestMode: data.contestMode,
    title: data.title,
    description: data.description,
    targetGroup: data.targetGroup,
    difficulty: data.difficulty,
   
    textSource: data.textSource,
    contestText: data.contestText,
    status:data.status,
    // string → Date
    date: new Date(data.date).toString(),
    startTime:data.startTime,
    duration: data.duration,
    maxParticipants: data.maxParticipants,
  participants: data.participants,
    joined: data.participants.some((p) => p.toString() === userId.toString()),
    rewards: data.rewards.map((reward) => ({
      rank: reward.rank,
      prize: reward.prize,
    })),
  }));
};


export interface groupContestDTO {
  _id:string;
  contestMode: ContestMode;
  title: string;
  description: string;
  targetGroup?: string; 
  difficulty: "easy" | "medium" | "hard";
  textSource: TextSource;
  contestText?: string;
  status:string;
  startTime: Date
  date: string;
  duration: number;
  participants: ParticipantDTO[];
  maxParticipants: number;
  rewards: RewardDTO[];
}

export const mapGroupContestDTO=(
  contests:groupContestDTO[],
  userId:string
)=>{
  return contests.map((data) => ({
    _id:data._id.toString(),
    contestMode: data.contestMode,
    title: data.title,
    description: data.description,
    targetGroup: data.targetGroup,
    difficulty: data.difficulty,
   
    textSource: data.textSource,
    contestText: data.contestText,
    status:data.status,
    // string → Date
    date: new Date(data.date).toString(),
    startTime:data.startTime,
    duration: data.duration,
    maxParticipants: data.maxParticipants,
  participants: data.participants,
    joined: data.participants.some((p) => p.toString() === userId.toString()),
    rewards: data.rewards.map((reward) => ({
      rank: reward.rank,
      prize: reward.prize,
    })),
}));};

export const mapCompanyContestDTO = (
  contests: openContestDTO[],
 
): ContestProps[] => {
  return contests.map((data) => ({
    _id:data._id.toString(),
    contestMode: data.contestMode,
    title: data.title,
    description: data.description,
    targetGroup: data.targetGroup,
    difficulty: data.difficulty,
   
    textSource: data.textSource,
    contestText: data.contestText,
    status:data.status,
    // string → Date
    date: new Date(data.date).toString(),
    startTime:data.startTime,
    duration: data.duration,
    maxParticipants: data.maxParticipants,
  participants: data.participants,
    rewards: data.rewards.map((reward) => ({
      rank: reward.rank,
      prize: reward.prize,
    })),
  }));
};