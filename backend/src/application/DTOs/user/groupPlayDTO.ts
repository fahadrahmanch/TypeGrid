export interface GroupPlayResult {
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
