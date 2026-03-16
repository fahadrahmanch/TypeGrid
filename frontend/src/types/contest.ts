export type ContestStatus = "waiting" | "ongoing" | "upcoming" | "completed";
export type ContestLevel = "easy" | "medium" | "hard";

export interface ContestProps {
  id: string;
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
