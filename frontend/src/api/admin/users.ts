import { adminAPI } from "../axios/adminAPI";
export async function getAllUsers() {
  return adminAPI.get("/users");
}
