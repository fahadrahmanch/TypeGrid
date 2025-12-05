import { adminAPI } from "../axios/adminAPI";
export async function getAllUsers() {
  return adminAPI.get("/users");
}
export async function blockUser(userId:string){
  return adminAPI.post("/block/user",{userId})
}