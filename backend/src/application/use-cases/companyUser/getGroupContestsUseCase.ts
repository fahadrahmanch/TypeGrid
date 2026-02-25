
import { IGetGroupContestsUseCase } from "../interfaces/companyUser/IGetGroupContestUseCase";
import { IBaseRepository } from "../../../domain/interfaces/repository/IBaseRepository";
import { ICompanyGroupRepository } from "../../../domain/interfaces/repository/companyUser/ICompanyGroupRepository";
import { IContestRepository } from "../../../domain/interfaces/repository/companyUser/IContestRepository";
import { groupContestDTO } from "../../DTOs/companyAdmin/CompanyContestDTO";
import { mapGroupContestDTO } from "../../DTOs/companyAdmin/CompanyContestDTO";
export class getGroupConstestsUsecase implements IGetGroupContestsUseCase{
    constructor(
        private readonly _baseRepoContest:IBaseRepository<any>,
        private readonly _baseRepoUser:IBaseRepository<any>,
        private readonly _companyGroupRepository:ICompanyGroupRepository<any>,
        private readonly _contestRepository:IContestRepository<any>
    ){}
    async execute(userId:string):Promise<groupContestDTO[]|null>{ 
        const groups=await this._companyGroupRepository.getGroup(userId);
        const groupsId=groups?.map(obj => obj._id.toString());
        if(!groupsId?.length)return [];
        const groupContests=await this._contestRepository.getGroupContests(groupsId);
        if(!groupContests.length)return [];
        return mapGroupContestDTO(groupContests,userId);

    }
}