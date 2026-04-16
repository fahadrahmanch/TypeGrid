import { GoalEntity } from '../../../../domain/entities/goal.entity';
import { IBaseRepository } from '../base-repository.interface';

export interface IGoalRepository extends IBaseRepository<GoalEntity> {
  getGoals(searchText: string, page: number, limit: number): Promise<{ goals: GoalEntity[]; total: number }>;
}
