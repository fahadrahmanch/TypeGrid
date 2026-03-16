export interface Lesson {
  id: string;
  title: string;
  difficulty: string;
  assigned?: number;
  completed?: number;
  avgWpm?: number;
  level?: string;
  completionRate: number;
}
