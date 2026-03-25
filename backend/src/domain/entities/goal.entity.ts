type GoalProps = {
  _id?: string;
  title: string;
  wpm: number;
  accuracy: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class GoalEntity {
  private _id?: string;
  private title: string;
  private wpm: number;
  private accuracy: number;
  private description: string;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(attrs: GoalProps) {
    this._id = attrs._id;
    this.title = attrs.title;
    this.wpm = attrs.wpm;
    this.accuracy = attrs.accuracy;
    this.description = attrs.description;
    this.createdAt = attrs.createdAt;
    this.updatedAt = attrs.updatedAt;
  }

  getId(): string | undefined { return this._id; }
  getTitle(): string { return this.title; }
  getWpm(): number { return this.wpm; }
  getAccuracy(): number { return this.accuracy; }
  getDescription(): string { return this.description; }
  getCreatedAt(): Date | undefined { return this.createdAt; }
  getUpdatedAt(): Date | undefined { return this.updatedAt; }

  toObject() {
    return {
      _id: this._id,
      title: this.title,
      wpm: this.wpm,
      accuracy: this.accuracy,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
