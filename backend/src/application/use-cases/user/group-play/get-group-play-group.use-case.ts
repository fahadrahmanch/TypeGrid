import { IGroupRepository } from "../../../../domain/interfaces/repository/user/group-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { groupDTO, mapGroupToDTO } from "../../../DTOs/user/group.dto";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { IGetGroupPlayGroupUseCase } from "../../interfaces/user/group-play/get-group-play-group.interface";

export class GetGroupPlayGroupUseCase implements IGetGroupPlayGroupUseCase {
  constructor(
    private readonly _groupRepository: IGroupRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(joinLink: string, userId: string): Promise<groupDTO> {
    const group = await this._groupRepository.findOne({ joinLink });
    if (!group) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND_WITH_JOIN_ID);
    }

    const members = await Promise.all(
      group.getMembers().map(async (memberId: string) => {
        const member = await this._userRepository.findById(memberId);
        if (!member) return null;
        return {
          userId: member._id?.toString() ?? memberId,
          name: member.name,
          imageUrl: member.imageUrl,
          isHost: member._id?.toString() === group.getOwnerId().toString(),
        };
      }),
    );

    return mapGroupToDTO({
      ...group.toObject(),
      members,
      currentUserId: userId,
    });
  }
}