export type ChallengeStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "completed";

export interface ICompanyChallenge {
  _id?: string;
  companyId: string;
  senderId: string;
  receiverId: string;
  difficulty: "easy" | "medium" | "hard";
  status?: ChallengeStatus;
  competitionId?: string | null;
}

export class CompanyChallengeEntity {
  private _id?: string;
  private companyId: string;
  private senderId: string;
  private receiverId: string;
  private difficulty: "easy" | "medium" | "hard";
  private status: ChallengeStatus;
  private competitionId?: string | null;

  constructor(data: ICompanyChallenge) {
    this._id = data._id;
    this.companyId = data.companyId;
    this.senderId = data.senderId;
    this.receiverId = data.receiverId;
    this.difficulty = data.difficulty;
    this.status = data.status ?? "pending";
    this.competitionId = data.competitionId ?? null;

    this.validate();
  }

  private validate() {
    if (this.senderId === this.receiverId) {
      throw new Error("You cannot challenge yourself");
    }
  }

  accept(competitionId: string) {
    if (this.status !== "pending") {
      throw new Error("Only pending challenge can be accepted");
    }

    this.status = "accepted";
    this.competitionId = competitionId;
  }

  decline() {
    if (this.status !== "pending") {
      throw new Error("Only pending challenge can be declined");
    }

    this.status = "declined";
  }

  complete() {
    if (this.status !== "accepted") {
      throw new Error("Only accepted challenge can be completed");
    }

    this.status = "completed";
  }

  getStatus() {
    return this.status;
  }

  getCompetitionId() {
    return this.competitionId;
  }

  toObject() {
    return {
      _id: this._id,
      companyId: this.companyId,
      senderId: this.senderId,
      receiverId: this.receiverId,
      difficulty: this.difficulty,
      status: this.status,
      competitionId: this.competitionId,
    };
  }
}