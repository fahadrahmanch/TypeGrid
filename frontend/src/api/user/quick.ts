import { userAPI } from "../axios/userAPI";

export async function createQuick() {
  return  userAPI.post("/quick-play/start");
}

export async function startGame(competitionId: string,status:string) {
  return  userAPI.post(`/quick-play/start/${competitionId}`,{status});
}