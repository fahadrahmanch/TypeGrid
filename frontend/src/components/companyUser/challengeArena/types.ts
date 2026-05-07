export type Teammate = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: "online" | "offline";
  avgWpm: number;
  accuracy: number;
};

export type BaseChallenge = {
  id: string;
  opponent: Teammate;
  difficulty: "easy" | "medium" | "hard";
  durationSeconds: number;
  type: "sent" | "received" | "completed";
  status: "pending" | "accepted" | "waiting" | "completed";
};

export type CompletedChallenge = BaseChallenge & {
  result: "won" | "lost" | "draw";
  yourWpm: number;
  theirWpm: number;
};
