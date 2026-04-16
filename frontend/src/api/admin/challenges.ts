import { adminAPI } from "../axios/adminAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const fetchChallenges = (searchText: string, limit: number, page: number) => {
  return adminAPI.get(API_ROUTES.CHALLENGE.ALL_CHALLENGES, {
    params: {
      search: searchText,
      limit,
      page,
    },
  });
};

export const createChallenge = (data: any) => {
  return adminAPI.post(API_ROUTES.CHALLENGE.ALL_CHALLENGES, data);
};

export const updateChallenge = (id: string, data: any) => {
  return adminAPI.put(API_ROUTES.CHALLENGE.BY_ID(id), data);
};

export const deleteChallenge = (id: string) => {
  return adminAPI.delete(API_ROUTES.CHALLENGE.BY_ID(id));
};

export const fetchChallengeById = (id: string) => {
  return adminAPI.get(API_ROUTES.CHALLENGE.BY_ID(id));
};
