import { adminAPI } from "../axios/adminAPI";
export async function getAllUsers() {
  return adminAPI.get("/users");
}
export async function updateUserStatus(userId:string){
  return adminAPI.patch(`/users/${userId}/status`);
}
