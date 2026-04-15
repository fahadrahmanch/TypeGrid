export interface LeaderboardDTO {
  userId: string;
  name: string;
  imageUrl: string;
  wpm: number;
  accuracy: number;
  totalScore: number;
  weeklyScore: number;
  monthlyScore: number;
  totalCompetitions: number;
  level: number;
}
