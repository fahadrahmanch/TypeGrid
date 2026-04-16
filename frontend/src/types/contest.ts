export type ContestStatus = "waiting" | "ongoing" | "upcoming" | "completed" | "active";
export type ContestLevel = "easy" | "medium" | "hard";

export interface ContestProps {
  id: string;
  _id?: string;
  title: string;
  status: ContestStatus;
  participants: number[];
  maxParticipants: number;
  duration: number; // in minutes
  level: ContestLevel;
  targetWpm: number;
  prize?: string;
  rewards?: { rank: number; prize: string | number }[];
  startTime?: string;
  type?: "open" | "group";
  setContests: React.Dispatch<React.SetStateAction<ContestProps[]>>;
}

export type PlayerStatus = "PLAYING" | "DISCONNECTED" | "FINISHED" | "LEFT";

export interface LivePlayer {
  userId: string;
  name: string;
  imageUrl: string;
  progress: number;
  wpm: number;
  accuracy: number | null;
  errors: number;
  timeTaken: number;
  status: PlayerStatus;
}

export type GamePlayerResult = {
  userId: string;
  wpm: number;
  accuracy: number | null;
  errors: number;
  typedLength: number;
  status: "times-up" | "finished" | "playing";
  updatedAt: number;
  name: string;
  imageUrl: string;
  timeTaken: number;
  prize: number;
  rank?: number;
};

export interface ContestResult {
  id: string;
  contestId: string;
  userId: string;
  name: string;
  imageUrl: string;
  wpm: number;
  accuracy: number;
  rank: number;
  time: number;
  prize: number;
  errors: number;
}
