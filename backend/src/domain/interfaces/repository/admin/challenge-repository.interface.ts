import { ChallengeEntity } from "../../../../domain/entities/challenge.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IChallengeRepository extends IBaseRepository<ChallengeEntity> {
  getChallenges(
    searchText: string,
    page: number,
    limit: number
  ): Promise<{ challenges: ChallengeEntity[]; total: number }>;
}
