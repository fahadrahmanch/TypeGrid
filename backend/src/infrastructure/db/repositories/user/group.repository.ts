import { Model } from 'mongoose';
import { BaseRepository } from '../../base/base.repository';
import { IGroupRepository } from '../../../../domain/interfaces/repository/user/group-repository.interface';
import { IGroupDocument } from '../../types/documents';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { GroupMapper } from '../../mappers/group.mapper';

export class GroupRepository extends BaseRepository<IGroupDocument, GroupEntity> implements IGroupRepository {
  constructor(model: Model<IGroupDocument>) {
    super(model, GroupMapper.toDomain);
  }
}
