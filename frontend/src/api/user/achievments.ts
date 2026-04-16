import { userAPI } from "../axios/userAPI";
import { API_ROUTES } from "../../constants/apiRoutes";
export async function getAllAchievements() {
    return userAPI.get(API_ROUTES.USER.ACHIEVEMENTS.GET_ALL);
}

export async function getUserAchievements() {
    return userAPI.get(API_ROUTES.USER.ACHIEVEMENTS.GET_USER_ACHIEVEMENTS);
}