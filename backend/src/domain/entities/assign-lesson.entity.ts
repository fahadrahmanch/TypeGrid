export type LessonAssignmentStatus =
  | "assigned"
  | "progress"
  | "completed"
  | "expired";

interface LessonAssignmentProps {
  id?: string;
  userId: string;
  lessonId: string;
  companyId: string;
  status?: LessonAssignmentStatus;
  assignedAt?: Date;
  deadlineAt: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class LessonAssignmentEntity {
  private id?: string;
  private userId: string;
  private lessonId: string;
  private companyId: string;
  private status: LessonAssignmentStatus;
  private assignedAt: Date;
  private deadlineAt: Date;
  private completedAt?: Date;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(props: LessonAssignmentProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.lessonId = props.lessonId;
    this.companyId = props.companyId;
    this.status = props.status ?? "assigned";
    this.assignedAt = props.assignedAt ?? new Date();
    this.deadlineAt = props.deadlineAt;
    this.completedAt = props.completedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  // getters

  getId(): string | undefined {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getLessonId(): string {
    return this.lessonId;
  }

  getCompanyId(): string {
    return this.companyId;
  }

  getStatus(): LessonAssignmentStatus {
    return this.status;
  }

  getAssignedAt(): Date {
    return this.assignedAt;
  }

  getDeadlineAt(): Date {
    return this.deadlineAt;
  }

  getCompletedAt(): Date | undefined {
    return this.completedAt;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  // business methods

  markAsProgress(): void {
    this.status = "progress";
  }

  markAsCompleted(): void {
    this.status = "completed";
    this.completedAt = new Date();
  }

  markAsExpired(): void {
    this.status = "expired";
  }

  toObject() {
    return {
      id: this.id,
      userId: this.userId,
      lessonId: this.lessonId,
      companyId: this.companyId,
      status: this.status,
      assignedAt: this.assignedAt,
      deadlineAt: this.deadlineAt,
      completedAt: this.completedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
