import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IGetContestResultUseCase } from "../../interfaces/companyUser/get-contest-result.interface";
import { ContestProps } from "../../../DTOs/companyAdmin/company-contest.dto";
import { IResultRepository } from "../../../../domain/interfaces/repository/result-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { contestResultMapper } from "../../../mappers/companyAdmin/contest-result.mapper";
import { contestResultDTO } from "../../../DTOs/companyAdmin/contest-result.dto";
/**
 * use case for get contest result
 */
export class GetContestResultUseCase implements IGetContestResultUseCase {
    constructor(
        private readonly _contestRepository: IContestRepository,
        private readonly _resultRepository: IResultRepository,
    ) {}

    async execute(contestId: string): Promise<contestResultDTO[]> {
        const contest = await this._contestRepository.findById(contestId);
        if(!contest){
            throw new Error(MESSAGES.CONTEST_NOT_FOUND);
        }
        const result = await this._resultRepository.find({contestId}, {
            populate: {
                path: "userId",
                select: "name imageUrl "
            }
        })
        if(!result){
            throw new Error("Result not found");
        }
        const mappedResult = result.map((item:any)=>contestResultMapper(item));
        return mappedResult
   
    }
}

    