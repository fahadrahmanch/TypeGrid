import { companyAPI } from "../axios/companyAPI";

export async function sendChallengeApi(userId: string) {
  return companyAPI.post("/challenge", { receiverId: userId });
}

export async function checkalreadySendChallenge() {
  return companyAPI.get(`/challenge/check-challenge-sent`);
}
export async function companyUsers() {
  return companyAPI.get("/company/users");
}
export async function getAllChallenges() {
  return companyAPI.get("/challenges");
}
export async function challengeAccept(challengeId: string) {
  return companyAPI.put(`/challenge/accept/${challengeId}`);
}
export async function getChallengeGameData(challengeId: string) {
  return companyAPI.get(`/challenge/game-data/${challengeId}`);
}
