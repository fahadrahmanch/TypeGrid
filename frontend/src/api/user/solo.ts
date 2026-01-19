import { userAPI } from "../axios/userAPI";

interface resultType{
    wpm:number,
    accuracy:number,
    errors:number,
    time:number
}
export async function createSoloRoom() {
    try {
        const response = await userAPI.post("/solo-play");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export async function saveSoloPlayResult(gameId:string,result:resultType){
    try{
    return await userAPI.post(`/solo-result${gameId}`,result)
    }catch(error){
        console.log(error)
    }
}