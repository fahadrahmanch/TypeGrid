
export type LessonResultStatus =
  | "assigned"
  | "progress"
  | "completed"
  | "expired";

export class LessonResult {
  private readonly companyId: string;
  private readonly assignmentId: string;
  private readonly userId: string;
  private readonly lessonId: string;

  private wpm: number;
  private accuracy: number;
  private errors: number;

  private status: LessonResultStatus;

  private readonly createdAt: Date;

  constructor(params: {
    companyId: string;
    assignmentId: string;
    userId: string;
    lessonId: string;
    wpm: number;
    accuracy: number;
    errors: number;
    totalTyped: number;
    takeTime: number;
    status: LessonResultStatus;
    createdAt?: Date;
  }) {
    if (params.wpm < 0) throw new Error("WPM cannot be negative");
    if (params.accuracy < 0 || params.accuracy > 100)
      throw new Error("Accuracy must be between 0 and 100");

    this.companyId = params.companyId;
    this.assignmentId = params.assignmentId;
    this.userId = params.userId;
    this.lessonId = params.lessonId;

    this.wpm = params.wpm;
    this.accuracy = params.accuracy;
    this.errors = params.errors;
    this.status = params.status;

    this.createdAt = params.createdAt ?? new Date();
  }

  getCompanyId() {
    return this.companyId;
  }

  getAssignmentId() {
    return this.assignmentId;
  }

  getUserId() {
    return this.userId;
  }

  getLessonId() {
    return this.lessonId;
  }

  getWpm() {
    return this.wpm;
  }

  getAccuracy() {
    return this.accuracy;
  }

  getErrors() {
    return this.errors;
  }



  getStatus() {
    return this.status;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  markCompleted() {
    this.status = "completed";
  }

  markExpired() {
    this.status = "expired";
  }

  toPersistence() {
    return {
      companyId: this.companyId,
      assignmentId: this.assignmentId,
      userId: this.userId,
      lessonId: this.lessonId,
      wpm: this.wpm,
      accuracy: this.accuracy,
      errors: this.errors,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
