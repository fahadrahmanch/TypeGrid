import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const individualNotification = async (data: any) => {
    return companyAPI.post(API_ROUTES.NOTIFICATION.INDIVIDUAL, data);
}

export const groupNotification = async (data: any) => {
    return companyAPI.post(API_ROUTES.NOTIFICATION.GROUP, data);
}

export const allNotification = async (data: any) => {
    return companyAPI.post(API_ROUTES.NOTIFICATION.ALL, data);
}

export const getNotificationHistory = async () => {
    return companyAPI.get(API_ROUTES.NOTIFICATION.GET_NOTIFICATION_HISTORY);
}