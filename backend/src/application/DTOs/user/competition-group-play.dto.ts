export type CompetitionMember = {
  _id: string;
  name: string;
  imageUrl: string;
  isHost: boolean;
};

type Lesson = {
  id: string;
  text: string;
  category: string;
  level: string;
};

export interface CompetitionDTOGroupPlay {
  _id: string;
  mode: string;
  participants: CompetitionMember[];
  groupId?: string;
  status: string;
  lesson: Lesson;
  JoinLink?: string;
  duration: number;
  startedAt: string;
  countDown: number;
}
