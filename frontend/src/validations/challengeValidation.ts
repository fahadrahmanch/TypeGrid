export function titleValidation(title: string) {
  if (!title.trim()) return "title is required";
  if (title.trim().length < 3) return "title must be at least 3 characters";
  return "";
}

export function difficultyValidation(difficulty: string) {
  if (!difficulty.trim()) return "difficulty is required";
  return "";
}

export function goalValidation(goal: string) {
  if (!goal.trim()) return "goal is required";
  return "";
}

export function rewardValidation(reward: string) {
  if (!reward.trim()) return "reward is required";
  return "";
}

export function durationValidation(duration: string) {
  if (!duration.trim()) return "duration is required";
  if (isNaN(Number(duration))) return "duration must be a number";
  return "";
}

export function descriptionValidation(description: string) {
  if (!description.trim()) return "description is required";
  if (description.trim().length < 10) return "description must be at least 10 characters";
  return "";
}
