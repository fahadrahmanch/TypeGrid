import { Entity } from "./Entity";

export type LessonCategory = "sentence" | "paragraph";
export type LessonLevel = "easy" | "medium" | "hard";
export type LessonCreator = "admin" | "company";
// export type AssignmentStatus = "active" | "completed" | "expired";

// export interface LessonAssignmentEntity {
//   userId: string;
//   assignedAt?: Date;
//   expiresAt?: Date;
//   status: AssignmentStatus;
// }

export class LessonEntity extends Entity<LessonEntity> {
  id?: string;

  text!: string;
  category!: LessonCategory;
  level!: LessonLevel;

  wpm!: number;
  accuracy!: number;

  createdBy!: LessonCreator;
  companyId?: string | null;

  // assignments?: LessonAssignmentEntity[];

  createdAt?: Date;
  updatedAt?: Date;
}
