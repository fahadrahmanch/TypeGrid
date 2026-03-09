type CompetitionMember = {
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

export interface CompetitionDTOSoloPlay {
  _id: string;
  mode: string;
  participants: CompetitionMember[];
  status: string;
  lesson: Lesson;
  duration: number;
  startedAt: string;
  countDown: number;
}
