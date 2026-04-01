export type ChallengeStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "completed"
  | "waiting"
  | "ongoing";

export interface ICompanyChallenge {
  _id?: string;
  CompanyId: string;
  senderId: string;
  receiverId: string;
  // difficulty: "easy" | "medium" | "hard";
  status?: ChallengeStatus;
  competitionId?: string | null;
}

export class CompanyChallengeEntity {
  private _id?: string;
  private CompanyId: string;
  private senderId: string;
  private receiverId: string;
  // private difficulty: "easy" | "medium" | "hard";
  private status: ChallengeStatus;
  private competitionId?: string | null;

  constructor(data: ICompanyChallenge) {
    this._id = data._id;
    this.CompanyId = data.CompanyId;
    this.senderId = data.senderId;
    this.receiverId = data.receiverId;
    // this.difficulty = data.difficulty;
    this.CompanyId = data.CompanyId ?? null;
    this.status = data.status ?? "pending";
    this.competitionId = data.competitionId ?? null;

    this.validate();
  }

  setStatus(status: ChallengeStatus) {
    this.status = status;
  }

  private validate() {
    if (this.senderId === this.receiverId) {
      throw new Error("You cannot challenge yourself");
    }
  }

  getSenderId() {
    return this.senderId;
  }

  getReceiverId() {
    return this.receiverId;
  }
  

  getCompanyId() {
    return this.CompanyId;
  }

  accept() {
    if (this.status !== "pending") {
      throw new Error("Only pending challenge can be accepted");
    }

    this.status = "accepted";
  }

  decline() {
    if (this.status !== "pending") {
      throw new Error("Only pending challenge can be declined");
    }

    this.status = "declined";
  }

  complete() {
    if (this.status !== "ongoing") {
      throw new Error("Only ongoing challenge can be completed");
    }

    this.status = "completed";
  }

  start() {
    if (this.status !== "accepted") {
      throw new Error("Only accepted challenge can be started");
    }

    this.status = "ongoing";
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
      CompanyId: this.CompanyId,
      senderId: this.senderId,
      receiverId: this.receiverId,
      // difficulty: this.difficulty,
      status: this.status,
      competitionId: this.competitionId,
    };
  }
}
