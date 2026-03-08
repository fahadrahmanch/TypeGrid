import { IGroupRepository } from "../../../../domain/interfaces/repository/user/IGroupRepository";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { IRemoveMemberGroupPlayGroupUseCase } from "../../interfaces/user/groupplayUseCases/IRemoveMemberGroupPlayGroupUseCase";
import { GroupEntity } from "../../../../domain/entities/GroupEntity";
import { groupDTO, mapGroupToDTO } from "../../../DTOs/user/groupDto";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
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
