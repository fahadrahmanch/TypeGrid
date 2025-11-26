import API from "../axios/userAPI";
export async function getAllUsers(){
    console.log("hello");
    return API.get("/admin/users");
}