import { adminAPI } from "../axios/adminAPI";

export const fetchChallenges = (searchText: string, filter: string, limit: number, page: number) => {
  return adminAPI.get("/challenges", {
    params: {
      search: searchText,
      filter,
      limit,
      page,
    },
  });
};

export const createChallenge = (data: any) => {
  return adminAPI.post("/challenges", data);
};

export const updateChallenge = (id: string, data: any) => {
  return adminAPI.put(`/challenges/${id}`, data);
};

export const deleteChallenge = (id: string) => {
  return adminAPI.delete(`/challenges/${id}`);
};

export const fetchChallengeById = (id: string) => {
  return adminAPI.get(`/challenges/${id}`);
};
