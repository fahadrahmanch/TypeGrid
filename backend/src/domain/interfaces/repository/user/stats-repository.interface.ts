import { IBaseRepository } from "../base-repository.interface";
import { StatsEntity } from "../../../../domain/entities/stats.entity";
export interface IStatsRepository extends IBaseRepository<StatsEntity> {
    findByUserId(userId: string): Promise<StatsEntity | null>;
}
