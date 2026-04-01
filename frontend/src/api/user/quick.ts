import { userAPI } from "../axios/userAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export async function createQuick() {
  return userAPI.post(API_ROUTES.QUICK_PLAY.START);
}

export async function statusChange(competitionId: string, status: string) {
  return userAPI.post(API_ROUTES.QUICK_PLAY.STATUS(competitionId), { status });
}

