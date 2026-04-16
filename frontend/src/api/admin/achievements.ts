import { adminAPI } from "../axios/adminAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const fetchAchievements = (search: string = "", limit: number = 5, page: number = 1) => {
  return adminAPI.get(API_ROUTES.ADMIN.ACHIEVEMENTS.ALL, {
    params: { search, limit, page },
  });
};

export const fetchAchievementById = (id: string) => {
  // alert(id);
  // alert(API_ROUTES.ADMIN.ACHIEVEMENTS.BY_ID(id));
  return adminAPI.get(API_ROUTES.ADMIN.ACHIEVEMENTS.BY_ID(id));
};

export const createAchievement = (data: any) => {
  return adminAPI.post(API_ROUTES.ADMIN.ACHIEVEMENTS.BASE, data);
};

export const updateAchievement = (id: string, data: any) => {
      // DELETE: (id: string) => `/achievement/${id}`,

  return adminAPI.put(API_ROUTES.ADMIN.ACHIEVEMENTS.BY_ID(id), data);
};

export const deleteAchievement = (id: string) => {
 
  return adminAPI.delete(API_ROUTES.ADMIN.ACHIEVEMENTS.DELETE(id));
};
