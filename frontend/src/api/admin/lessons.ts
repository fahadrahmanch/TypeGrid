import { adminAPI } from "../axios/adminAPI";

export async function getAllLessons() {
  return adminAPI.get("/lessons");
}
// create lesson
export async function createLesson(lessonData: any) {
  return adminAPI.post("/lessons", lessonData);
}
export async function deleteLesson(id: string) {
  return adminAPI.delete(`/lesson/${id}`);
}
export async function fetchLesson(id: any) {
  return adminAPI.get(`/lesson/${id}`);
}
export async function updateLesson(id:string,lessonData:any){
  return adminAPI.put(`/lesson/${id}`,lessonData)
}


