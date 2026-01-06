import { adminAPI } from "../axios/adminAPI";
export async function getAlllessons() {
  return adminAPI.get("/lessons");
}
export async function createLesson(lessonData: any) {
  return adminAPI.post("/create/lesson", lessonData);
}
export async function deleteLesson(_id: string) {
  return adminAPI.delete("/delete/lesson", { data: { _id } });
}
export async function updateLesson(lessonData: any) {
  return adminAPI.put("/update/lesson", lessonData);
}
