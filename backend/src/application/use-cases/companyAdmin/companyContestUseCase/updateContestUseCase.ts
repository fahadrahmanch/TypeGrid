import { CreateContestDTO } from "../../../DTOs/companyAdmin/CompanyContestDTO";
import { IUpdateContestUseCase } from "../../interfaces/companyAdmin/IUpdateContestUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { ContestEntity } from "../../../../domain/entities/companyContestEntity";
import { MESSAGES } from "../../../../domain/constants/messages";
import { mapContestDTOAdmin } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export class updateContestUse implements IUpdateContestUseCase{
    constructor(
    private _baseRepoContest:IBaseRepository<any>,
    ){}
    async execute(constestId: string, data: CreateContestDTO): Promise<CreateContestDTO> {
        const contest=await this._baseRepoContest.findById(constestId)
        
        if(!contest){
            throw new Error(MESSAGES.CONTEST_NOT_FOUND)
        }
          if (data.date && data.startTime) {
    data.startTime = new Date(`${data.date}T${data.startTime}:00`);
  }
          const mergedData = {
    ...contest,
    ...data,
  };
        const contestEntity=new ContestEntity(mergedData)
       const inObject=contestEntity.toObject()
        const updatedContest=await this._baseRepoContest.update({_id:constestId,...inObject})
        return mapContestDTOAdmin(updatedContest)
    }
}