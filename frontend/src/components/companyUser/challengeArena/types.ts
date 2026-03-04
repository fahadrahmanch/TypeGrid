export type UserStatus = 'online' | 'offline';

export interface Teammate {
    _id: string;
    name: string;
    companyRole: string;
    avatar: string;
    online: boolean;
    avgWpm: number;
    accuracy: number;
}   

export type ChallengeStatus = 'pending' | 'accepted' | 'completed' | 'waiting';
export type ChallengeType = 'sent' | 'received' | 'completed';

export interface BaseChallenge {
    id: string;
    opponent: Teammate;
    difficulty: 'easy' | 'medium' | 'hard';
    durationSeconds: number;
    type: ChallengeType;
    senderId:string;
    status: ChallengeStatus;
}

export interface CompletedChallenge extends BaseChallenge {
    status: 'completed';
    result: 'won' | 'lost';
    yourWpm: number;
    theirWpm: number;
}
