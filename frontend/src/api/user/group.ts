import { userAPI } from "../axios/userAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export async function createGroupRoom() {
  return userAPI.post(API_ROUTES.GROUP_PLAY.GROUPS);
}

export async function getGroupRoomDetails(joinLink: string) {
  return userAPI.get(API_ROUTES.GROUP_PLAY.GROUP_DETAILS(joinLink));
}

export async function editGroupAPI(
  groupId: string,
  difficulty?: string,
  maxPlayers?: number,
) {
  return userAPI.patch(API_ROUTES.GROUP_PLAY.EDIT_GROUP(groupId), {
    difficulty,
    maxPlayers,
  });
}

export function joinGroupAPI(joinLink: string) {
  return userAPI.patch(API_ROUTES.GROUP_PLAY.JOIN_GROUP(joinLink));
}

export function removePlayerAPI(groupId: string, playerId: string) {
  return userAPI.delete(API_ROUTES.GROUP_PLAY.REMOVE_PLAYER(groupId, playerId));
}

export function startGroupPlayAPI(gameId: string, countDown: number) {
  return userAPI.post(API_ROUTES.GROUP_PLAY.START_GAME(gameId), {
    countDown,
  });
}

export function newGameAPI(gameId: string, currentUsers: string[]) {
  return userAPI.post(API_ROUTES.GROUP_PLAY.NEW_GAME(gameId), {
    currentUsers,
  });
}

