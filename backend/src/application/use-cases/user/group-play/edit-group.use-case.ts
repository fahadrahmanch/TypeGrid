import { IEditGroupPlayUseCase } from '../../interfaces/user/group-play/edit-group-play.interface';
import { IGroupRepository } from '../../../../domain/interfaces/repository/user/group-repository.interface';
import { MESSAGES } from '../../../../domain/constants/messages';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';
import { GroupEntity } from '../../../../domain/entities/group.entity';
import { mapGroupToDTO } from '../../../DTOs/user/group.dto';
import { groupDTO } from '../../../DTOs/user/group.dto';
type Difficulty = 'easy' | 'medium' | 'hard';
export class EditGroupUseCase implements IEditGroupPlayUseCase {
  constructor(private groupRepository: IGroupRepository) {}
  async execute(groupId: string, difficulty: Difficulty, maxPlayers: number, userId: string): Promise<groupDTO> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND);
    }
    const groupEntity = new GroupEntity(group as any);
    if (groupEntity.getOwnerId() != userId) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.ONLY_HOST_CAN_EDIT_GROUP);
    }
    groupEntity.changeDifficulty(difficulty);
    groupEntity.changeMaximumPlayers(maxPlayers);
    const groupObject = groupEntity.toObject();
    const updatedGroup = await this.groupRepository.update(groupObject);

    return mapGroupToDTO({
      ...updatedGroup,
      currentUserId: userId,
    });
  }
}
