import { adminAPI } from "../axios/adminAPI";
export async function filterUsersAPI(search: string,status:string,page:number,limit:number) {
  return adminAPI.get(`/users?search=${search}&status=${status}&page=${page}&limit=${limit}`);
}
export async function updateUserStatus(userId: string) {
  return adminAPI.patch(`/users/${userId}/status`);
}

