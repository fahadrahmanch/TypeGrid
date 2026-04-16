import { IGroupDocument } from '../types/documents';
import { GroupEntity } from '../../../domain/entities/group.entity';

export class GroupMapper {
  static toDomain(doc: IGroupDocument): GroupEntity {
    return new GroupEntity({
      _id: doc._id?.toString(),
      name: doc.name,
      ownerId: doc.ownerId?.toString(),
      members: doc.members?.map((m) => m.toString()) ?? [],
      maximumPlayers: doc.maximumPlayers,
      difficulty: doc.difficulty,
      joinLink: doc.joinLink ?? null,
      status: doc.status,
      kickedUsers: doc.kickedUsers?.map((u) => u.toString()) ?? [],
    });
  }
}
