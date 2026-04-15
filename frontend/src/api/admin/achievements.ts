import { adminAPI } from "../axios/adminAPI";

export const fetchAchievements = (search: string = "", limit: number = 5, page: number = 1) => {
  return adminAPI.get(`/acheivements`, {
    params: { search, limit, page },
  });
};

export const fetchAchievementById = (id: string) => {
  return adminAPI.get(`/acheivement/${id}`);
};

export const createAchievement = (data: any) => {
  return adminAPI.post("/acheivement", data);
};

export const updateAchievement = (id: string, data: any) => {
  return adminAPI.put(`/acheivement/${id}`, data);
};

export const deleteAchievement = (id: string) => {
  return adminAPI.delete(`/acheivement/${id}`);
};
