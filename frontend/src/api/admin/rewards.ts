import { adminAPI } from "../axios/adminAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const fetchRewards = (
  searchText: string,
  limit: number,
  page: number,
) => {
  return adminAPI.get(API_ROUTES.ADMIN.REWARDS.BASE, {
    params: {
      search: searchText,
      limit,
      page,
    },
  });
};

export const createReward = (data: any) => {
  return adminAPI.post(API_ROUTES.ADMIN.REWARDS.BASE, data);
};

export const updateReward = (id: string, data: any) => {
  return adminAPI.put(API_ROUTES.ADMIN.REWARDS.BY_ID(id), data);
};

export const deleteReward = (id: string) => {
  return adminAPI.delete(API_ROUTES.ADMIN.REWARDS.BY_ID(id));
};

export const fetchRewardById = (id: string) => {
  return adminAPI.get(API_ROUTES.ADMIN.REWARDS.BY_ID(id));
};
