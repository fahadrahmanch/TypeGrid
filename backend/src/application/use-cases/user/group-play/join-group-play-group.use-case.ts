import { IGroupRepository } from "../../../../domain/interfaces/repository/user/group-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IJoinGroupPlayGroupUseCase } from "../../interfaces/user/group-play/join-group-play-group.interface";
import { GroupEntity } from "../../../../domain/entities/group.entity";
import { mapGroupToDTO } from "../../../DTOs/user/group.dto";
import { groupDTO } from "../../../DTOs/user/group.dto";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
export class JoinGroupPlayGroupUseCase implements IJoinGroupPlayGroupUseCase {
  constructor(
    private groupRepository: IGroupRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(joinLink: string, userId: string): Promise<groupDTO> {
    if (!joinLink || !userId) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.JOIN_LINK_AND_USER_ID_REQUIRED,
      );
    }

    const group = await this.groupRepository.findOne({ joinLink });
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
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }

    const groupEntity = new GroupEntity(group);
    groupEntity.addMember(userId);

    const updatedGroup = await this.groupRepository.updateById(group._id, {
      members: groupEntity.getMembers(),
    });

    if (!updatedGroup) {
      throw new CustomError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        MESSAGES.GROUP_UPDATE_FAILED,
      );
    }

    const populatedMembers = await Promise.all(
      updatedGroup.members.map(async (memberId: any) => {
        const member = await this.userRepository.findById(memberId.toString());
        if (!member) return null;

        return {
          userId: member._id,
          name: member.name,
          imageUrl: member.imageUrl,
          isHost: member._id.toString() === group.ownerId.toString(),
        };
      }),
    );

    return mapGroupToDTO({
      ...updatedGroup.toObject(),
      members: populatedMembers.filter((m) => m !== null),
      currentUserId: userId,
    });
  }
}
