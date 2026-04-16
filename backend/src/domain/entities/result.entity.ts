type Result = {
  wpm: number;
  accuracy: number;
  errors: number;
  time: number;
  rank?: number;
  prize?: number;
};

type CompetitionType = 'solo' | 'group' | 'quick' | 'contest' | 'oneToOne';

type ResultProps = {
  _id?: string;
  userId: string;
  type: CompetitionType;
  competitionId?: string;
  contestId?: string;
  result: Result;
};

export class ResultEntity {
  private _id?: string;
  private userId: string;
  private type: CompetitionType;
  private competitionId?: string;
  private contestId?: string;
  private result: Result;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(attrs: ResultProps) {
    this._id = attrs._id;
    this.userId = attrs.userId;
    this.type = attrs.type;
    this.competitionId = attrs.competitionId;
    this.contestId = attrs.contestId;
    this.result = attrs.result;
  }
  getWpm(): number {
    return this.result.wpm;
  }

  getAccuracy(): number {
    return this.result.accuracy;
  }

  getErrors(): number {
    return this.result.errors;
  }

  getTime(): number {
    return this.result.time;
  }

  toObject() {
    return {
      _id: this._id,
      userId: this.userId,
      type: this.type,
      competitionId: this.competitionId,
      contestId: this.contestId,
      result: this.result,
      createdAt: this.createdAt,

      updatedAt: this.updatedAt,
    };
  }
}
