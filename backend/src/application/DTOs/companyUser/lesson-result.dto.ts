export interface LessonResultDTO {
  wpm: number;
  accuracy: number;
  errors: number;
  totalTyped?: number;
  status?: string;
}