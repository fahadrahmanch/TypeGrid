import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export async function sendChallengeApi(userId: string) {
  return companyAPI.post(API_ROUTES.CHALLENGE.SEND, { receiverId: userId });
}

export async function checkalreadySendChallenge() {
  return companyAPI.get(API_ROUTES.CHALLENGE.CHECK_SENT);
}

export async function companyUsers(searchText: string) {
  return companyAPI.get(API_ROUTES.CHALLENGE.COMPANY_USERS, { params: { search: searchText } });
}

export async function getAllChallenges() {
  return companyAPI.get(API_ROUTES.CHALLENGE.ALL_CHALLENGES);
}

export async function challengeAccept(challengeId: string) {
  return companyAPI.put(API_ROUTES.CHALLENGE.ACCEPT(challengeId));
}

export async function getChallengeGameData(challengeId: string) {
  return companyAPI.get(API_ROUTES.CHALLENGE.GAME_DATA(challengeId));
}

export async function challengeReject(challengeId: string) {
  return companyAPI.put(API_ROUTES.CHALLENGE.REJECT(challengeId));
}

