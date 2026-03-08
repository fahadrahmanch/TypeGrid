import { IEditGroupPlayUseCase } from "../../interfaces/user/groupplayUseCases/IEditGroupPlayUseCase";
import { IGroupRepository } from "../../../../domain/interfaces/repository/user/IGroupRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
import { GroupEntity } from "../../../../domain/entities/GroupEntity";
import { mapGroupToDTO } from "../../../DTOs/user/groupDto";
import { groupDTO } from "../../../DTOs/user/groupDto";
type Difficulty = "easy" | "medium" | "hard";
export class editGroupUseCase implements IEditGroupPlayUseCase {
  constructor(private groupRepository: IGroupRepository) {}
  async execute(
    groupId: string,
    difficulty: Difficulty,
    maxPlayers: number,
    userId: string,
  ): Promise<groupDTO> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.GROUP_NOT_FOUND,
      );
    }
    const groupEntity = new GroupEntity(group as any);
    if (groupEntity.getOwnerId() != userId) {
      throw new CustomError(
        HttpStatusCodes.FORBIDDEN,
        MESSAGES.ONLY_HOST_CAN_EDIT_GROUP,
      );
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
