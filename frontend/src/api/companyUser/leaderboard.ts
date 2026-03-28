import { companyAPI } from "../axios/companyAPI";

export const getLeaderboard = (limit: number = 10) => {
  return companyAPI.get(`/leaderboard/${limit}`);
};
