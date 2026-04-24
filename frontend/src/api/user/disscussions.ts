import { userAPI } from "../axios/userAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const createPost = async (data: { title: string; content: string }) => {
    return userAPI.post(API_ROUTES.USER.CREATE_POST, data);
}
export const getAllDiscussions = async (page: number = 1, limit: number = 5) => {
    return userAPI.get(`${API_ROUTES.USER.GET_ALL_DISCUSSIONS}?page=${page}&limit=${limit}`);
}
export const getDiscussionById = async (id: string) => {
    return userAPI.get(`${API_ROUTES.USER.GET_ALL_DISCUSSIONS}/${id}`);
}
export const createComment = async (data: { discussionId: string; content: string }) => {
    return userAPI.post(API_ROUTES.USER.CREATE_COMMENT, data);
}
export const createReply = async (data: { commentId: string; content: string }) => {
    return userAPI.post(API_ROUTES.USER.CREATE_REPLY, data);
}