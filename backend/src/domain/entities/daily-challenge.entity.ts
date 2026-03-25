export type DailyChallengeProps = {
  _id?: string;
  challengeId: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export class DailyAssignChallengeEntity {
  private _id?: string;
  private challengeId: string;
  private date: Date;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(attrs: DailyChallengeProps) {
    this._id = attrs._id;
    this.challengeId = attrs.challengeId;
    this.date = attrs.date;
    this.createdAt = attrs.createdAt;
    this.updatedAt = attrs.updatedAt;
  }

  getId(): string | undefined { return this._id; }
  getChallengeId(): string { return this.challengeId; }
  getDate(): Date { return this.date; }
  getCreatedAt(): Date | undefined { return this.createdAt; }
  getUpdatedAt(): Date | undefined { return this.updatedAt; }

  toObject() {
    return {
      _id: this._id,
      challengeId: this.challengeId,
      date: this.date,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
