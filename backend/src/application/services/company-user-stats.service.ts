type Difficulty = "easy" | "medium" | "hard";
type ActivityType = "lesson" | "oneToOne" | "contest";

const difficultyMultiplier: Record<Difficulty, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
};

const activityMultiplier: Record<ActivityType, number> = {
  lesson: 1.0,
  oneToOne: 1.2,
  contest: 1.5,
};

export async function updateCompanyUserStats(
  wpm: number,
  accuracy: number,
  difficulty: Difficulty,
  activityType: ActivityType
) {
  const score = Math.round(
    wpm * (accuracy / 100) * difficultyMultiplier[difficulty] * activityMultiplier[activityType]
  );
  return score;
  //   await CompanyUserStats.findOneAndUpdate(
  //     { userId, companyId },
  //     {
  //       $inc: {
  //         totalScore:      score,
  //         weeklyScore:     score,
  //         monthlyScore:    score,
  //         totalActivities: 1,
  //       },
  //       $max: {
  //         accuracy: accuracy,
  //       },
  //     },
  //     { upsert: true, new: true }
  //   );
}
