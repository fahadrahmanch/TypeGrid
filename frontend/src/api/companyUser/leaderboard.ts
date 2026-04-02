import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const getLeaderboard = (limit: number = 10) => {
  return companyAPI.get(API_ROUTES.LEADERBOARD.GET(limit));
};
