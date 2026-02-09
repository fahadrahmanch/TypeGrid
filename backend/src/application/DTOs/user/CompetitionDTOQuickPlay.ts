type CompetitionMember = {
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
  startTime: number;
}
export const mapCompetitionToDTOQuickPlay = (
  competition: any,
): CompetitionDTOQuickPlay => {
  return {
    _id: competition._id.toString(),
    mode: competition.mode,
    status: competition.status,
    duration: competition.duration,
    startedAt: competition.startedAt,
    startTime: competition.startTime,
    lesson: {
      id: competition.lesson._id,
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


export const mapQuickMemberToDTO = (user: any): CompetitionMember => {
  return {
    _id: user._id.toString(),
    name: user.name,
    imageUrl: user.imageUrl,
  };
};

export interface QuickPlayMemberDTO{  
    _id:string,
    name:string,
    imageUrl:string,
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
