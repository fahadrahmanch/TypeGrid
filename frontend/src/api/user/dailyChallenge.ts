import { userAPI } from "../axios/userAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const TodayChallenge = async () => {
  return userAPI.get(API_ROUTES.DAILY_CHALLENGE.TODAY);
};

export const challengeFinished = async (data: any) => {
  return userAPI.post(API_ROUTES.DAILY_CHALLENGE.FINISHED, data);
};

export const ChallengeStatistics = async () => {
  return userAPI.get(API_ROUTES.DAILY_CHALLENGE.STATISTICS);
};