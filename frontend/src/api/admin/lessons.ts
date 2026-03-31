import { adminAPI } from "../axios/adminAPI";

export async function LessonsAPI(searchText: string, filter: string, limit: number, page: number) {
  console.log("filter in api",filter)
  return adminAPI.get("/lessons", { params: { searchText, filter, limit, page } });
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
export async function updateLesson(id: string, lessonData: any) {
  return adminAPI.put(`/lesson/${id}`, lessonData);
}
