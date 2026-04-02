import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export async function myLessons() {
  return companyAPI.get(API_ROUTES.LESSONS.MY_LESSONS);
}

export async function getAssignedLessonByAssignmentId(assignmentId: string) {
  return companyAPI.get(API_ROUTES.LESSONS.MY_LESSON_BY_ID(assignmentId));
}
