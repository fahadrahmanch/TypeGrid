import { userAPI } from "../axios/userAPI";
import { API_ROUTES } from "../../constants/apiRoutes";
import { TypingResult } from "../../types/typing";

export async function createSoloRoom() {
  return await userAPI.post(API_ROUTES.SOLO_PLAY.START);
}

export async function saveSoloPlayResult(gameId: string, result: TypingResult) {
  return await userAPI.post(API_ROUTES.SOLO_PLAY.RESULT(gameId), result);
}
