import { userAPI } from "../axios/userAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const getGlobalLeaderboard = (filter: string = "all", limit: number = 100) => {
  return userAPI.get(`${API_ROUTES.USER.LEADERBOARD}?filter=${filter}&limit=${limit}`);
};
