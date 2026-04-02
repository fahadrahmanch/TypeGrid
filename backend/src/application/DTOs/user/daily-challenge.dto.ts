export interface DailyChallengeResponseDTO {
  _id: string;
  challengeId: {
    _id: string;
    title: string;
    description: string;
    duration: number;
    lesson: string;
    difficulty: string;
    startedAt: Date;
  };
  date: Date;
  goal: {
    _id: string;
    title: string;
    wpm: number;
    accuracy: number;
    description: string;
  };
  reward: {
    _id: string;
    xp: number;
    description: string;
  };
}
