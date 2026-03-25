import { adminAPI } from "../axios/adminAPI";

export const fetchRewards = (searchText: string, limit: number, page: number) => {
  return adminAPI.get("/rewards", {
    params: {
      search: searchText,
      limit,
      page,
    },
  });
};

export const createReward = (data: any) => {
  return adminAPI.post("/rewards", data);
};

export const updateReward = (id: string, data: any) => {
  return adminAPI.put(`/rewards/${id}`, data);
};

export const deleteReward = (id: string) => {
  return adminAPI.delete(`/rewards/${id}`);
};

export const fetchRewardById = (id: string) => {
  return adminAPI.get(`/rewards/${id}`);
};
