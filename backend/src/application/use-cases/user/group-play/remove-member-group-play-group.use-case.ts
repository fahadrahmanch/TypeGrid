import { IGroupRepository } from "../../../../domain/interfaces/repository/user/group-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IRemoveMemberGroupPlayGroupUseCase } from "../../interfaces/user/group-play/remove-member-group-play-group.interface";
import { GroupEntity } from "../../../../domain/entities/group.entity";
import { groupDTO, mapGroupToDTO } from "../../../DTOs/user/group.dto";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
export class RemoveMemberGroupPlayGroupUseCase implements IRemoveMemberGroupPlayGroupUseCase {
  constructor(
    private groupRepository: IGroupRepository,
    private userRepository: IUserRepository,
  ) {}
  async execute(
    groupId: string,
    userId: string,
    reason: "KICK" | "LEAVE",
  ): Promise<groupDTO> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.GROUP_NOT_FOUND,
      );
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        "User not found",
      );
    }
    const groupEntity = new GroupEntity(group as any);
    groupEntity.removeMember(userId);
    if (group.ownerId.toString() == userId) {
      const pickOnehoster = groupEntity
        .getMembers()
        .find((memberId: string) => memberId != userId);
      if (pickOnehoster) {
        groupEntity.setOwner(pickOnehoster.toString());
      }
    }
    if (reason === "KICK") {
      groupEntity.kickUser(userId);
    }

    const kickedUsers = groupEntity.getKickedUsers();
    const updatedGroup = await this.groupRepository.updateById(groupId, {
      members: groupEntity.getMembers(),
      kickedUsers,
      ownerId: groupEntity.getOwnerId(),
    });
    const members = await Promise.all(
      updatedGroup.members.map(async (memberId: any) => {
        const member = await this.userRepository.findById(memberId);
        if (!member) return null;
        return {
          userId: member._id?.toString(),
          name: member.name,
          imageUrl: member.imageUrl,
          isHost: member._id?.toString() === updatedGroup.ownerId?.toString(),
        };
      }),
    );
    return mapGroupToDTO({
      ...updatedGroup.toObject(),
      members,
    });
  }
}
