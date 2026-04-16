export interface SentChallengeDTO {
  challengeId: string;
  receiverId: string;
  status: string;
}

export interface OpponentDTO {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  companyRole: string | null;
}

export interface ChallengeDTO {
  id: string;
  companyId: string;
  senderId: string;
  receiverId: string;
  status: string;
  competitionId: string;
  type: 'sent' | 'received' | 'completed';
  opponent: OpponentDTO;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChallengeGameDTO {
  id: string;
  startedAt: Date;
  status: string;
  duration: number;
  companyId: string;
  countDown: number;

  lesson: {
    id: string;
    title: string;
    text: string;
  };

  players: {
    id: string;
    name: string;
    imageUrl: string;
    companyId: string;
    companyRole: string | null;
    bio: string | null;
  }[];
}
