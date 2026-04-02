import { adminAPI } from "../axios/adminAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export async function filterUsersAPI(
  search: string,
  status: string,
  page: number,
  limit: number,
) {
  return adminAPI.get(
    API_ROUTES.ADMIN.USERS.FILTER(search, status, page, limit),
  );
}

export async function updateUserStatus(userId: string) {
  return adminAPI.patch(API_ROUTES.ADMIN.USERS.STATUS(userId));
}
