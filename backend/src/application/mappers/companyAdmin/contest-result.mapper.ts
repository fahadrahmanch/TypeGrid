import { contestResultDTO } from "../../DTOs/companyAdmin/contest-result.dto";
export function contestResultMapper(result:any):contestResultDTO{
    return {
        id:result._id,
        contestId:result.contestId,
        userId:result.userId._id,
        name:result.userId.name,
        imageUrl:result.userId.imageUrl,
        wpm:result.result.wpm,
        accuracy:result.result.accuracy,
        rank:result.result.rank,
        time:result.result.time,
        prize:result.result.prize,
        errors:result.result.errors,
    }
}
    