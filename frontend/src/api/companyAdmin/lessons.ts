import { companyAPI } from "../axios/companyAPI";
import { AxiosResponse } from "axios";
import { API_ROUTES } from "../../constants/apiRoutes";

export async function createLesson(lessonData: any): Promise<AxiosResponse> {
  return companyAPI.post(API_ROUTES.LESSONS.ADMIN.LESSON, lessonData);
}

export async function getLesson() {
  return companyAPI.get(API_ROUTES.LESSONS.ADMIN.BASE);
}

export async function getLessonById(id: string) {
  return companyAPI.get(API_ROUTES.LESSONS.ADMIN.BY_ID(id));
}

export async function updateLesson(id: string, lessonData: any) {
  return companyAPI.put(API_ROUTES.LESSONS.ADMIN.BY_ID(id), lessonData);
}

export async function deleteLesson(id: string) {
  return companyAPI.delete(API_ROUTES.LESSONS.ADMIN.BY_ID(id));
}

export async function getCompanyUsers() {
  return companyAPI.get(API_ROUTES.ADMIN.USERS.COMPANY_USERS);
}

export async function getAdminLessons() {
  return companyAPI.get(API_ROUTES.LESSONS.ADMIN.ADMIN_ONLY);
}

export async function saveLessonResult(id: string, resultData: any) {
  return companyAPI.post(API_ROUTES.LESSONS.ADMIN.RESULT(id), resultData);
}

export async function assignLesson(selectedUsers: string[], selectedLessons: string[], deadline: string) {
  return companyAPI.post(API_ROUTES.LESSONS.ADMIN.ASSIGNMENTS, {
    users: selectedUsers,
    lessons: selectedLessons,
    deadline,
  });
}
export async function assignLessonToGroup(selectedGroups: string[], selectedLessons: string[], deadline: string) {
  return companyAPI.post(API_ROUTES.LESSONS.ADMIN.ASSIGNMENTS_LESSON_GROUP, {
    groups: selectedGroups,
    lessons: selectedLessons,
    deadline,
  });
}

export async function getPendingUsers() {
  return companyAPI.get(API_ROUTES.GET_PENDING_USERS);
}
