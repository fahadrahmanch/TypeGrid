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

export interface CompetitionDTOGroupPlay {
  _id: string;
  mode: string;
  participants: CompetitionMember[];
  groupId?: string;
  status: string;
  lesson: Lesson;
  duration: number;
  startedAt:string;
  startTime:number;
}
export const mapCompetitionToDTOGroupPlay = (
  competition: any,
  
  hostUserId: string
): CompetitionDTOGroupPlay => {
  console.log("competition in dto",competition)
  return {
    _id: competition._id.toString(),
    mode: competition.mode,
    status: competition.status,
    duration: competition.duration,
    groupId: competition.groupId?.toString(),
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
      isHost: user._id.toString() === hostUserId.toString(),
    })),
  };
};
