import { companyAPI } from "../axios/companyAPI";

export async function myLessons(){
    return companyAPI.get('/my-lessons')
}
export async function getAssignedLessonByAssignmentId(assignmentId: string) {
  return companyAPI.get(`/my-lessons/${assignmentId}`);
}
