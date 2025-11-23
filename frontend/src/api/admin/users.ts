import API from "../axios/axios";
export async function getAllUsers(){
    console.log("hello")
    return API.get('/admin/users')
}