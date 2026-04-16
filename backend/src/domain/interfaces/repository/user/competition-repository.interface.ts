import { IBaseRepository } from '../base-repository.interface';
import { CompetitionEntity } from '../../../entities/competition.entity';

export interface ICompetitionRepository extends IBaseRepository<CompetitionEntity> {}
