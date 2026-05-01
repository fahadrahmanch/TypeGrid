export const calculateTrend = (current: number, previous: number) => {
  if (previous === 0) return { change: "+0%", isPositive: true };
  const change = ((current - previous) / previous) * 100;
  const isPositive = change >= 0;
  return {
    change: `${isPositive ? "+" : ""}${change.toFixed(1)}%`,
    isPositive,
  };
};
