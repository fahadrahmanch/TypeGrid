import { userAPI } from "../axios/userAPI";
export async function getTypingPracticeContent(level:string,category:string){
  return userAPI.get(`/practice/typing/content?level=${level}&category=${category}`);
}

export async function getTypiingPracticeLessonById(lessonId:string){
  return userAPI.get(`/practice/typing/${lessonId}`);
}