import { userAPI } from "../axios/userAPI";
import { API_ROUTES } from "../../constants/apiRoutes";
import { TypingResult } from "../../types/typing";

export async function createSoloRoom() {
  try {
    const response = await userAPI.post(API_ROUTES.SOLO_PLAY.START);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function saveSoloPlayResult(gameId: string, result: TypingResult) {
  try {
    return await userAPI.post(API_ROUTES.SOLO_PLAY.RESULT(gameId), result);
  } catch (error) {
    console.log(error);
  }
}
