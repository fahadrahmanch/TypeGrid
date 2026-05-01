import { IGroupRepository } from "../../../../domain/interfaces/repository/user/group-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IJoinGroupPlayGroupUseCase } from "../../interfaces/user/group-play/join-group-play-group.interface";
import { mapGroupToDTO, groupDTO } from "../../../DTOs/user/group.dto";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

export class JoinGroupPlayGroupUseCase implements IJoinGroupPlayGroupUseCase {
  constructor(
    private readonly _groupRepository: IGroupRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(joinLink: string, userId: string): Promise<groupDTO> {
    if (!joinLink || !userId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.JOIN_LINK_AND_USER_ID_REQUIRED);
    }

    const group = await this._groupRepository.findOne({ joinLink });
    if (!group) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND);
    }

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    group.addMember(userId);

    const updatedGroup = await this._groupRepository.updateById(group.getId()!, {
      members: group.getMembers(),
    });

    if (!updatedGroup) {
      throw new CustomError(HttpStatusCodes.INTERNAL_SERVER_ERROR, MESSAGES.GROUP_UPDATE_FAILED);
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
      })
    );

    return mapGroupToDTO({
      ...updatedGroup.toObject(),
      members,
      currentUserId: userId,
    });
  }
}
