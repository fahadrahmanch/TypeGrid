import { userAPI } from "../axios/userAPI";

import { TypingResult } from "../../types/typing";

export async function createSoloRoom() {
  try {
    const response = await userAPI.post("/solo-play");
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
export async function saveSoloPlayResult(gameId: string, result: TypingResult) {
  try {
    return await userAPI.post(`/solo-result${gameId}`, result);
  } catch (error) {
    console.log(error);
  }
}
