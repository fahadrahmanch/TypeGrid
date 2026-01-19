
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
  startedAt:string;
  startTime:number;
}
export const mapCompetitionToDTOSoloPlay = (
  competition: any,
  
 ): CompetitionDTOSoloPlay => {
  return {
    _id: competition._id.toString(),
    mode: competition.mode,
    status: competition.status,
    duration: competition.duration,
    startedAt:competition.startedAt,
    startTime:competition.startTime,
    lesson: {
  id: competition.lesson.id,
  text: competition.lesson.text,
  category: competition.lesson.category,
  level: competition.lesson.level,
},

    participants: competition.participants.map((user: any) => ({
      _id: user._id.toString(),
      name: user.name,
      imageUrl: user.imageUrl,
        })),
  };
};