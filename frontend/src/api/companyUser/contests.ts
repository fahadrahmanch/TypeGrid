import { companyAPI } from "../axios/companyAPI";

export async function openContestApi(){
    return companyAPI.get("/open-contests");
}
export async function joinOrLeaveContestApi(contestId:string,action:string){
    return companyAPI.put(`/join-or-leave-contest/${contestId}`,{action});
}

export async function groupContestApi(){
    return companyAPI.get("/group-contests");
}