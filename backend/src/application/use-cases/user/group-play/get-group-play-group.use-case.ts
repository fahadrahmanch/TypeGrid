import { IGroupRepository } from "../../../../domain/interfaces/repository/user/group-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { groupDTO, mapGroupToDTO } from "../../../DTOs/user/group.dto";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { IGetGroupPlayGroupUseCase } from "../../interfaces/user/group-play/get-group-play-group.interface";
export class GetGroupPlayGroupUseCase implements IGetGroupPlayGroupUseCase {
  constructor(
    private groupRepository: IGroupRepository,
    private userRepository: IUserRepository,
  ) {}
  async execute(joinLink: string, userId: string): Promise<groupDTO> {
    const group = await this.groupRepository.findOne({
      joinLink: joinLink,
    });
    if (!group) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.GROUP_NOT_FOUND_WITH_JOIN_ID,
      );
    }

    group.members = await Promise.all(
      group.members.map(async (item: any) => {
        const memberId = item.toString();
        const member = await this.userRepository.findById(memberId);
        if (!member) return null;
        return {
          userId: (member as any)._id,
          name: (member as any).name,
          imageUrl: (member as any).imageUrl,
          isHost: (member as any)._id.toString() === group.ownerId.toString(),
        };
      }),
    );
    group.members = group.members.filter((m: any) => m !== null);
    group.currentUserId = userId;
    return mapGroupToDTO(group);
  }
}
