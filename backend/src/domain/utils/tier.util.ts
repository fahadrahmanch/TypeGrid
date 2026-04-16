export const calculateTier = (wpm: number): string => {
  if (wpm >= 65) return 'Master Tier';
  if (wpm >= 50) return 'Platinum';
  if (wpm >= 35) return 'Gold';
  if (wpm >= 20) return 'Silver';
  return 'Bronze';
};
