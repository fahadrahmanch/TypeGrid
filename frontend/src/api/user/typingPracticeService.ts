import { userAPI } from "../axios/userAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export async function getTypingPracticeContent(
  level: string,
  category: string,
) {
  return userAPI.get(API_ROUTES.TYPING.PRACTICE(level, category));
}

export async function getTypiingPracticeLessonById(lessonId: string) {
  return userAPI.get(API_ROUTES.TYPING.LESSON_BY_ID(lessonId));
}
