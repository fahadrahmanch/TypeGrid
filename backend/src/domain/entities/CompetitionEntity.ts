import { ObjectId } from "mongoose";
export type CompetitionType =
  | "quick"
  | "solo"
  | "group"
  | "oneToOne"
  | "company";

export type CompetitionMode = "global" | "company";

export type CompetitionStatus = "pending" | "ongoing" | "completed";

type Reward = {
  rank: number;
  prize: string;
};

type CompetitionProps = {
  id?: string;
  type: CompetitionType;
  mode: CompetitionMode;
  participants?: string[];
  groupId?: string | null;
  status?: CompetitionStatus;
  textId: string;
  duration: number;
  reward?: Reward[];
  startTime:number
  startedAt?: Date;
};

export class CompetitionEntity {
  private id?: string;
  private type!: CompetitionType;
  private mode!: CompetitionMode;
  private participants!: string[];
  private groupId!: string | null;
  private status!: CompetitionStatus;
  private textId!: string;
  private duration!: number;
  private reward!: Reward[];
  private startTime!:number
  private startedAt?:Date

  constructor(props: CompetitionProps) {
    this.id = props.id;
    this.type = props.type;
    this.mode = props.mode;
    this.participants = props.participants ?? [];
    this.groupId = props.groupId ?? null;
    this.status = props.status ?? "pending";
    this.textId = props.textId;
    this.duration = props.duration;
    this.reward = props.reward ?? [];
    this.startTime=props?.startTime||10;
     this.startedAt = props.startedAt ?? new Date();
  }


  getId() {
    return this.id;
  }

  getStatus() {
    return this.status;
  }

  getParticipants() {
    return this.participants;
  }


  addParticipant(userId: string) {
    if (this.participants.includes(userId)) {
      throw new Error("User already joined this competition");
    }
    this.participants.push(userId);
  }

  startCompetition() {
    if (this.status !== "pending") {
      throw new Error("Competition cannot be started");
    }
    this.status = "ongoing";
  }
  endCompetition(){
    if (this.status !== "ongoing") {
      throw new Error("Competition is not running");
    }
    this.status = "completed";
  }

  completeCompetition() {
    if (this.status !== "ongoing") {
      throw new Error("Competition is not running");
    }
    this.status = "completed";
  }


  toObject() {
    return {
      _id: this.id,
      type: this.type,
      mode: this.mode,
      participants: this.participants,
      groupId: this.groupId,
      status: this.status,
      textId: this.textId,
      duration: this.duration,
      reward: this.reward,
      startTime:this.startTime,
      startedAt: this.startedAt 
    };
  }
}
