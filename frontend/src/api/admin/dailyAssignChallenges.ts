import { adminAPI } from "../axios/adminAPI";
export const fetchAssignChallenges = (date:string,limit:number,page:number)=>{
 
    
    return adminAPI.get("/daily-assign-challenges", {
        params: {
            date,
            limit,
            page,
        },  
    });
};

export const createAssignChallenge = (data: any) => {
    console.log("datat",data);
    return adminAPI.post("/daily-assign-challenge", data);
};

export const updateAssignChallenge = (id: string, data: any) => {
    return adminAPI.put(`/daily-assign-challenge/${id}`, data);
};

export const deleteAssignChallenge = (id: string) => {
    return adminAPI.delete(`/daily-assign-challenge/${id}`);
};