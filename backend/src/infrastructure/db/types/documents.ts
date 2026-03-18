import { Types } from "mongoose";

// ────────────── User ──────────────
export interface IUserDocument {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  imageUrl?: string;
  bio?: string;
  age?: string;
  number?: string;
  CompanyId?: Types.ObjectId | null;
  CompanyRole?: string | null;
  KeyBoardLayout: "QWERTY" | "AZERTY" | "DVORAK";
  status?: "active" | "block";
  contactNumber?: number;
  gender?: string;
  googleId?: string | null;
  role: "user" | "admin" | "companyUser" | "companyAdmin";
  createdAt?: Date;
  updatedAt?: Date;
}

// ────────────── Company ──────────────
export interface ICompanyDocument {
  _id?: Types.ObjectId;
  companyName?: string;
  email?: string;
  address?: string;
  number?: string;
  OwnerId?: Types.ObjectId;
  description?: string;
  rejectionReason?: string;
  status?: "active" | "inactive" | "pending" | "reject";
  createdAt?: Date;
  updatedAt?: Date;
}

// ────────────── Lesson ──────────────
export interface ILessonDocument {
  _id: Types.ObjectId
  title: string;       
  text: string;
  category: "sentence" | "paragraph";
  level: "beginner" | "intermediate" | "advanced";
  wpm: number;
  accuracy: number;
  createdBy: "admin" | "company";
  companyId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

// ────────────── Group (user group play) ──────────────
export interface IGroupDocument {
  _id?: Types.ObjectId;
  name: string;
  ownerId: Types.ObjectId;
  members: Types.ObjectId[];
  maximumPlayers: number;
  difficulty: "easy" | "medium" | "hard";
  joinLink?: string | null;
  status: "waiting" | "started" | "completed";
  kickedUsers: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

// ────────────── Competition ──────────────
export interface ICompetitionDocument {
  _id?: Types.ObjectId;
  type: "quick" | "solo" | "group" | "oneToOne" | "company";
  mode: "global" | "company";
  participants: Types.ObjectId[];
  groupId?: Types.ObjectId | null;
  startedAt?: Date | null;
  status: "pending" | "ongoing" | "completed";
  textId?: Types.ObjectId;
  duration: number;
  countDown: number;
  reward?: Array<{ rank?: number; prize?: number }>;
  CompanyId?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// ────────────── Result ──────────────
export interface IResultDocument {
  _id?: Types.ObjectId;
  type: "quick" | "solo" | "group" | "contest";
  competitionId?: Types.ObjectId | null;
  contestId?: Types.ObjectId | null;
  userId: Types.ObjectId;
  result: {
    wpm: number;
    accuracy: number;
    errors: number;
    time: number;
    rank?: number;
    prize?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// ────────────── Contest ──────────────
export interface IContestDocument {
  _id?: Types.ObjectId;
  contestMode: "open" | "group";
  title: string;
  description?: string;
  difficulty: "easy" | "medium" | "hard";
  groupId?: Types.ObjectId | null;
  textSource: "manual" | "random";
  participants: Types.ObjectId[];
  contestText?: string;
  date: Date;
  startTime?: Date;
  duration: number;
  maxParticipants: number;
  rewards: Array<{ rank: number; prize: number }>;
  status: "upcoming" | "ongoing" | "completed" | "waiting";
  countDown?: number;
  startedAt?: Date;
  CompanyId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// ────────────── Company Group ──────────────
export interface ICompanyGroupDocument {
  _id?: Types.ObjectId;
  companyId: Types.ObjectId;
  name: string;
  type: "beginner" | "intermidate" | "advanced";
  members: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

// ────────────── Company Challenge ──────────────
export interface ICompanyChallengeDocument {
  _id?: Types.ObjectId;
  CompanyId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  status: "pending" | "accepted" | "declined" | "completed" | "waiting";
  competitionId?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// ────────────── Lesson Assignment ──────────────
export interface ILessonAssignmentDocument {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  lessonId: Types.ObjectId;
  status: "assigned" | "progress" | "completed" | "expired";
  assignedAt?: Date;
  deadlineAt: Date;
  companyId: Types.ObjectId;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// ────────────── Lesson Result ──────────────
export interface ILessonResultDocument {
  _id?: Types.ObjectId;
  companyId: Types.ObjectId;
  assignmentId: Types.ObjectId;
  userId: Types.ObjectId;
  lessonId: Types.ObjectId;
  wpm: number;
  accuracy: number;
  errors: number;
  status: "assigned" | "progress" | "completed" | "expired";
  createdAt?: Date;
}
export interface IResultDocument {
  _id?: Types.ObjectId;
  type: "quick" | "solo" | "group" | "contest";
  competitionId?: Types.ObjectId | null;
  contestId?: Types.ObjectId | null;
  userId: Types.ObjectId;
  result: {
    wpm: number;
    accuracy: number;
    errors: number;
    time: number;
    rank?: number;
    prize?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
