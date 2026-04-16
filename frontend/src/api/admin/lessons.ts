import { adminAPI } from "../axios/adminAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export async function LessonsAPI(searchText: string, filter: string, limit: number, page: number) {
  return adminAPI.get(API_ROUTES.LESSONS.ADMIN.BASE, {
    params: { searchText, filter, limit, page },
  });
}

// create lesson
export async function createLesson(lessonData: any) {
  return adminAPI.post(API_ROUTES.LESSONS.ADMIN.BASE, lessonData);
}

export async function deleteLesson(id: string) {
  return adminAPI.delete(API_ROUTES.LESSONS.ADMIN.BY_ID(id));
}

export async function fetchLesson(id: string) {
  return adminAPI.get(API_ROUTES.LESSONS.ADMIN.BY_ID(id));
}

export async function updateLesson(id: string, lessonData: any) {
  return adminAPI.put(API_ROUTES.LESSONS.ADMIN.BY_ID(id), lessonData);
}
