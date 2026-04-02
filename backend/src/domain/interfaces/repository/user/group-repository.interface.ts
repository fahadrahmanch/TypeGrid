import { IBaseRepository } from "../base-repository.interface";
import { GroupEntity } from "../../../entities/group.entity";

export interface IGroupRepository extends IBaseRepository<GroupEntity> {}
