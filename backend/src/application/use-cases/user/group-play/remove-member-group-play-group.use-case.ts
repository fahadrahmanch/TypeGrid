import { IGroupRepository } from "../../../../domain/interfaces/repository/user/group-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IRemoveMemberGroupPlayGroupUseCase } from "../../interfaces/user/group-play/remove-member-group-play-group.interface";
import { groupDTO, mapGroupToDTO } from "../../../DTOs/user/group.dto";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

export class RemoveMemberGroupPlayGroupUseCase
  implements IRemoveMemberGroupPlayGroupUseCase
{
  constructor(
    private readonly _groupRepository: IGroupRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(
    groupId: string,
    userId: string,
    reason: "KICK" | "LEAVE",
  ): Promise<groupDTO> {
    const groupEntity = await this._groupRepository.findById(groupId);
    if (!groupEntity) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND);
    }

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    if (groupEntity.getOwnerId().toString() === userId) {
      const newOwner = groupEntity
        .getMembers()
        .find((memberId: string) => memberId !== userId);
      if (newOwner) {
        groupEntity.setOwner(newOwner);
      }
    }

    if (reason === "KICK") {
      groupEntity.kickUser(userId);
    } else {
      groupEntity.removeMember(userId);
    }

    const updatedGroup = await this._groupRepository.updateById(groupId, {
      members: groupEntity.getMembers(),
      kickedUsers: groupEntity.getKickedUsers(),
      ownerId: groupEntity.getOwnerId(),
    });

    if (!updatedGroup) {
      throw new CustomError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        MESSAGES.SOMETHING_WENT_WRONG,
      );
    }

    const members = await Promise.all(
      updatedGroup.getMembers().map(async (memberId: string) => {
        const member = await this._userRepository.findById(memberId);
        if (!member) return null;
        return {
          userId: member._id?.toString() ?? memberId,
          name: member.name,
          imageUrl: member.imageUrl,
          isHost: member._id?.toString() === updatedGroup.getOwnerId().toString(),
        };
      }),
    );

    return mapGroupToDTO({
      ...updatedGroup.toObject(),
      members: members.filter(Boolean),
    });
  }
}