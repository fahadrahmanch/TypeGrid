import { userAPI } from "../axios/userAPI";
export async function getTypingPracticeContent(level:string,category:string){
  return userAPI.get(`/typing/practice?level=${level}&category=${category}`);
}

export async function getTypiingPracticeLessonById(lessonId:string){
  return userAPI.get(`/typing/practice/${lessonId}`);
}