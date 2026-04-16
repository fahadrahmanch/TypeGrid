type Difficulty = 'easy' | 'medium' | 'hard';
type ActivityType = 'quick' | 'solo' | 'group';

const difficultyMultiplier: Record<Difficulty, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
};

const activityMultiplier: Record<ActivityType, number> = {
  solo: 1.0,
  quick: 1.2,
  group: 1.5,
};

export async function updateUserStats(
  wpm: number,
  accuracy: number,
  difficulty: Difficulty,
  activityType: ActivityType
) {
  const score = Math.round(
    wpm * (accuracy / 100) * difficultyMultiplier[difficulty] * activityMultiplier[activityType]
  );
  return score;
}
