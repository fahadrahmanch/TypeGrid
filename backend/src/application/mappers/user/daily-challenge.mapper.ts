// application/mappers/daily-challenge.mapper.ts

import { DailyChallengeResponseDTO } from "../../DTOs/user/daily-challenge.dto";

type DailyChallengeObject = {
  _id?: string;
  challengeId: string;
  date: Date;
};

type ChallengeObject = {
  _id?: string;
  title: string;
  description: string;
  duration: number;
  lesson?: string;
  difficulty: string;
};

type GoalObject = {
  _id?: string;
  title: string;
  wpm: number;
  accuracy: number;
  description: string;
};

type RewardObject = {
  _id?: string;
  xp: number;
  description: string;
};

export function mapToGoalResponseDTO(
  dailyChallenge: DailyChallengeObject,
  challenge: ChallengeObject,
  goal: GoalObject,
  reward: RewardObject
): DailyChallengeResponseDTO {
  return {
    _id: dailyChallenge._id!,
    challengeId: {
      _id: challenge._id!,
      title: challenge.title,
      description: challenge.description,
      duration: challenge.duration,
      lesson: challenge.lesson || "",
      difficulty: challenge.difficulty,
      startedAt: new Date(),
    },
    date: dailyChallenge.date,
    goal: {
      _id: goal._id!,
      title: goal.title,
      wpm: goal.wpm,
      accuracy: goal.accuracy,
      description: goal.description,
    },
    reward: {
      _id: reward._id!,
      xp: reward.xp,
      description: reward.description,
    },
  };
}
