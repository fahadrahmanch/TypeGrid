import { adminAPI } from "../axios/adminAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const fetchAssignChallenges = (
  date: string,
  limit: number,
  page: number,
) => {
  return adminAPI.get(API_ROUTES.ADMIN.DAILY_ASSIGN.CHALLENGES, {
    params: {
      date,
      limit,
      page,
    },
  });
};

export const createAssignChallenge = (data: any) => {
  return adminAPI.post(API_ROUTES.ADMIN.DAILY_ASSIGN.CHALLENGE, data);
};

export const updateAssignChallenge = (id: string, data: any) => {
  return adminAPI.put(API_ROUTES.ADMIN.DAILY_ASSIGN.BY_ID(id), data);
};

export const deleteAssignChallenge = (id: string) => {
  return adminAPI.delete(API_ROUTES.ADMIN.DAILY_ASSIGN.BY_ID(id));
};
