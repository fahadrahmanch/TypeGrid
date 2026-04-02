import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export async function openContestApi() {
  return companyAPI.get(API_ROUTES.CONTESTS.OPEN);
}

export async function joinOrLeaveContestApi(contestId: string, action: string) {
  return companyAPI.put(API_ROUTES.CONTESTS.JOIN_LEAVE(contestId), { action });
}

export async function groupContestApi() {
  return companyAPI.get(API_ROUTES.CONTESTS.GROUP);
}
