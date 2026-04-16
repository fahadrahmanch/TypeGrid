import { Entity } from './entity';

export type LessonCategory = 'sentence' | 'paragraph';
// export type LessonLevel = "beginner" | "medium" | "hard";
export type LessonLevel = 'beginner' | 'intermediate' | 'advanced';

export type LessonCreator = 'admin' | 'company';
// export type AssignmentStatus = "active" | "completed" | "expired";

// export interface LessonAssignmentEntity {
//   userId: string;
//   assignedAt?: Date;
//   expiresAt?: Date;
//   status: AssignmentStatus;
// }

export class LessonEntity extends Entity<LessonEntity> {
  _id?: string;

  text!: string;
  category!: LessonCategory;
  level!: LessonLevel;
  title?: string;

  wpm!: number;
  accuracy!: number;

  createdBy!: LessonCreator;
  companyId?: string | null;

  // assignments?: LessonAssignmentEntity[];

  createdAt?: Date;
  updatedAt?: Date;
}
