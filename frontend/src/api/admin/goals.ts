import { adminAPI } from "../axios/adminAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const fetchGoals = (searchText: string, limit: number, page: number) => {
  return adminAPI.get(API_ROUTES.ADMIN.GOALS.BASE, {
    params: {
      search: searchText,
      limit,
      page,
    },
  });
};

export const createGoal = (data: any) => {
  return adminAPI.post(API_ROUTES.ADMIN.GOALS.BASE, data);
};

export const updateGoal = (id: string, data: any) => {
  return adminAPI.put(API_ROUTES.ADMIN.GOALS.BY_ID(id), data);
};

export const deleteGoal = (id: string) => {
  return adminAPI.delete(API_ROUTES.ADMIN.GOALS.BY_ID(id));
};

export const fetchGoalById = (id: string) => {
  return adminAPI.get(API_ROUTES.ADMIN.GOALS.BY_ID(id));
};
