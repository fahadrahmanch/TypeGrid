export function xpPointsValidation(xp: string) {
  if (!xp.toString().trim()) return "XP points are required";
  if (isNaN(Number(xp))) return "XP points must be a number";
  if (Number(xp) <= 0) return "XP points must be greater than 0";
  return "";
}

export function rewardDescriptionValidation(description: string) {
  if (!description.trim()) return "Description is required";
  if (description.trim().length < 5)
    return "Description must be at least 5 characters";
  return "";
}
