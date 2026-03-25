import { RewardResponseDTO } from "../../../DTOs/admin/reward.dto";
export interface IGetRewardsUseCase {
    execute(searchText:string,page:number,limit:number): Promise<{rewards:RewardResponseDTO[],total:number}>;
}