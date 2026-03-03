export type ContestMode = "open" | "group";
export type Difficulty = "easy" | "medium" | "hard";
export type TextSource = "manual" | "random";
export type ContestStatus = "upcoming" | "ongoing" | "completed"|"waiting";

export interface RewardProps {
  rank: number;
  prize: number;
}
export interface ParticipantProps {
  userId: string;
  // score: number;
  // joinedAt: Date;
  // completed: boolean;
}

export interface ContestProps {
  _id?: string;
  contestMode: ContestMode;
  title: string;
  description?: string;
  difficulty: Difficulty;
  groupId?: string | null;
  participants?: string[];
  textSource: TextSource;
  contestText?: string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  duration: number;
  maxParticipants: number;
  countDown:number
  rewards: RewardProps[];
  status?: ContestStatus;
  createdAt?: Date;
  updatedAt?: Date;
  CompanyId: string;
}

export class ContestEntity {
  private _id?: string;
  private contestMode: ContestMode;
  private title: string;
  private description?: string;
  private participants: string[];
  private difficulty: Difficulty;
  private groupId?: string | null;
  private textSource: TextSource;
  private contestText?: string;
  private date: Date;
  private startTime?: Date;
  private duration: number;
  private maxParticipants: number;
  private rewards: RewardProps[];
  private status: ContestStatus;
  private countDown?:number;
  private createdAt?: Date;
  private updatedAt?: Date;
  private CompanyId: string;
  constructor(props: ContestProps) {
    this._id = props._id;
    this.contestMode = props.contestMode;
    this.title = props.title;
    this.description = props.description;
    this.difficulty = props.difficulty;
    this.groupId = props.groupId ?? null;
    this.textSource = props.textSource;
    this.contestText = props.contestText;
    this.date = props.date;
    this.participants = props.participants ?? [];
    this.startTime = props.startTime;
    this.duration = props.duration;
    this.maxParticipants = props.maxParticipants;
    this.rewards = props.rewards;
    this.status = props.status ?? "upcoming";
    this.countDown=10
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.CompanyId = props.CompanyId;
    this.validate();
  }

  private validate() {
    if (this.contestMode === "group" && !this.groupId) {
      throw new Error("Group contest must have groupId");
    }

    if (this.textSource === "manual" && !this.contestText) {
      throw new Error("Manual contest must have contestText");
    }

    if (this.duration < 10) {
      throw new Error("Duration must be at least 10 seconds");
    }

    if (this.maxParticipants < 1) {
      throw new Error("Max participants must be at least 1");
    }
  }

  getTitle() {
    return this.title;
  }
  getParticipants() {
    return this.participants;
  }

  getMode() {
    return this.contestMode;
  }

  getRewards() {
    return this.rewards;
  }
  updateStatus(status: string) {
    this.status = status as ContestStatus;
  }
  getStatus(){
    return this.status;
  }

  startContest() {
    this.status = "ongoing";
    this.startTime = new Date();
  }
  joinContest(userId: string) {
    if (this.status !== "upcoming" && this.status !== "ongoing") {
      throw new Error("Contest is not open for joining");
    }

    if (this.participants.length >= this.maxParticipants) {
      throw new Error("Contest is full");
    }

    const alreadyJoined = this.participants.find(
      (p) => p.toString() === userId.toString()
    );

    if (alreadyJoined) {
      throw new Error("User already joined");
    }

    this.participants.push(userId);
  }
  unJoin(userId: string) {
    const alreadyJoined = this.participants.find(
      (p) => p.toString() === userId.toString()
    );

    if (!alreadyJoined) {
      throw new Error("User not joined");
    }

    this.participants = this.participants.filter(
      (p) => p.toString() !== userId.toString()
    );
  }

  completeContest() {
    this.status = "completed";
  }
  toObject(): ContestProps {
    return {
      _id: this._id,
      contestMode: this.contestMode,
      title: this.title,
      description: this.description,
      difficulty: this.difficulty,
      groupId: this.groupId,
      participants: this.participants,
      countDown:this.countDown||10,
      textSource: this.textSource,
      contestText: this.contestText,
      date: this.date,
      startTime: this.startTime,
      duration: this.duration,
      maxParticipants: this.maxParticipants,
      rewards: this.rewards,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      CompanyId: this.CompanyId,
    };
  }
}
