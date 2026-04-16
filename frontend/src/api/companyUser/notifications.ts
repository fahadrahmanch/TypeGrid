import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const fetchUserNotifications = async () => {
  return companyAPI.get(API_ROUTES.NOTIFICATION.GET_USER_NOTIFICATIONS);
};

export const markNotificationAsRead = async (id: string) => {
  return companyAPI.put(API_ROUTES.NOTIFICATION.MARK_AS_READ(id));
};
