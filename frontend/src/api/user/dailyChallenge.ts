import { userAPI } from "../axios/userAPI";
export const TodayChallenge = async()=>{
    return userAPI.get("/today-challenge");
}

export const challengeFinished = async(data:any)=>{
    return userAPI.post("/daily-challenge-finished",data);
}

export const ChallengeStatistics = async()=>{
    return userAPI.get("/daily-challenge/statistics");
}