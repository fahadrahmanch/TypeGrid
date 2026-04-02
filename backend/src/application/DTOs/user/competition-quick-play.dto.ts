export type CompetitionMember = {
  _id: string;
  name: string;
  imageUrl: string;
};

type Lesson = {
  id: string;
  text: string;
  category: string;
  level: string;
};

export interface CompetitionDTOQuickPlay {
  _id: string;
  mode: string;
  participants: CompetitionMember[];
  status: string;
  lesson: Lesson;
  duration: number;
  startedAt: string;
  countDown: number;
}

export interface QuickPlayMemberDTO {
  _id: string;
  name: string;
  imageUrl: string;
}

export interface QuicKPlayResult {
  userId: string;
  name: string;
  imageUrl: string;

  wpm: number;
  accuracy: number | null;
  errors: number;
  typedLength: number;
  rank?: number;
  status: "FINISHED" | "TIMES_UP" | "PLAYING";
  timeTaken: number;
  updatedAt: number;
}
