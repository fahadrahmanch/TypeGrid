export type UserStatus = "online" | "offline";

export interface Teammate {
  _id: string;
  name: string;
  companyRole: string;
  avatar: string;
  online: boolean;
  avgWpm: number;
  accuracy: number;
}

export type ChallengeStatus = "pending" | "accepted" | "completed" | "waiting";
export type ChallengeType = "sent" | "received" | "completed";


