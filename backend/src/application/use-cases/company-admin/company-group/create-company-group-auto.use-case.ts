import { ICreateCompanyGroupAutoUseCase } from "../../interfaces/companyAdmin/create-company-group-auto.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/company-group-repository.interface";
import { ICompanyUserStatsRepository } from "../../../../domain/interfaces/repository/company/company-user-stats-repository.interface";
import { CreateCompanyGroupAutoDTO } from "../../../DTOs/companyAdmin/create-company-group-auto.dto";
import { CompanyGroupEntity } from "../../../../domain/entities/company-group.entity";
export class CreateCompanyGroupAutoUseCase implements ICreateCompanyGroupAutoUseCase {
   constructor(
    private readonly userRepo: IUserRepository,
    private readonly companyGroupRepo: ICompanyGroupRepository,
    private readonly companyUserStatsRepo: ICompanyUserStatsRepository,
   ){}
   async execute(groupData: CreateCompanyGroupAutoDTO, userId: string):Promise<void>{
    const user = await this.userRepo.findById(userId);
    if(!user){
        throw new Error("User not found");
    }
    const companyId = user.CompanyId;
    if(!companyId){
        throw new Error("Company not found");
    }
    const users=await this.companyUserStatsRepo.getCompanyUserStatsBasedOnCriteria(companyId,Number(groupData.minWpm),Number(groupData.maxWpm),Number(groupData.minAccuracy),Number(groupData.maxAccuracy));
    if(users.length===0){
        throw new Error("No users found based on the criteria");
    }
      const companyGroup = new CompanyGroupEntity({
          companyId: user.CompanyId!,
          name: groupData.groupName,
          type: groupData.groupType,
          members: users,
        });
    
        await this.companyGroupRepo.create(companyGroup.toObject());
   
   }
}