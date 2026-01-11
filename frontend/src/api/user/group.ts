import { userAPI } from "../axios/userAPI";

export async function createGroupRoom() {
  return  userAPI.post("/group-play/groups")
}

export async function getGroupRoomDetails(joinLink:string) {
  return  userAPI.get(`/group-play/groups/${joinLink}`)
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
