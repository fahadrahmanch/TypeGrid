export interface contestResultDTO {
  id: string;
  contestId: string;
  userId: string;
  name: string;
  imageUrl: string;
  wpm: number;
  accuracy: number;
  errors?: number;
  time?: number;
  rank: number;
  prize?: number;
}
