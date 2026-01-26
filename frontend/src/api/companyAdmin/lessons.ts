import { companyAPI } from "../axios/companyAPI"
import { AxiosResponse } from "axios";

export async function createLesson(lessonData:any): Promise<AxiosResponse> {
    return companyAPI.post('/lesson',lessonData)
}


export async function getLesson(){
    return companyAPI.get('/lessons')
}

export async function getLessonById(id:string){
    return companyAPI.get(`/lesson/${id}`)
}

export async function updateLesson(id:string,lessonData:any){
    return companyAPI.put(`/lesson/${id}`,lessonData)
}
export async function deleteLesson(id:string){
    return companyAPI.delete(`/lesson/${id}`)
}
export async function getCompanyUsers(){
    return companyAPI.get('/users')
}
export async function getAdminLessons(){
    return companyAPI.get('/admin-lessons')
}
export async function assignLesson(selectedUsers:string[],selectedLessons:string[],deadline:string){
return companyAPI.post("/lesson-assignments", {
    users: selectedUsers,
    lessons: selectedLessons,
    deadline,
  });
}