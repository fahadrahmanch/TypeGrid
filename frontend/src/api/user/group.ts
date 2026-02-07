import { userAPI } from "../axios/userAPI";

export async function createGroupRoom() {
  return  userAPI.post("/group-play/groups");
}

export async function getGroupRoomDetails(joinLink:string) {
  return  userAPI.get(`/group-play/groups/${joinLink}`);
}

export async function editGroupAPI(
  groupId: string,
    difficulty?: string,
    maxPlayers?: number,
) {
  return userAPI.patch(`/group-play/groups/${groupId}`, {
    difficulty,
    maxPlayers,
  });
}

export function joinGroupAPI(joinLink: string) {
  return userAPI.patch(`/group-play/groups/join/${joinLink}`);
}
export function removePlayerAPI(groupId?:string,playerId?:string){
  return userAPI.delete(`/group-play/groups/${groupId}/players/${playerId}`);
}
export function startGroupPlayAPI(gameId:string,startTime:number){
  return userAPI.post(`/group-play/groups/${gameId}/start`,{
    startTime
  });
}

export function newGameAPI(gameId:string,currentUsers:string[]){
  return userAPI.post(`/group-play/${gameId}/new-game`,{
    currentUsers
  });
}