export interface AssignedLessonDTO {
  id: string;
  status: string;
  deadlineAt: Date;

  lesson: {
    id: string;
    title: string;
    text: string;
    level: string;
    wpm: number;
    accuracy: number;
  };
}
