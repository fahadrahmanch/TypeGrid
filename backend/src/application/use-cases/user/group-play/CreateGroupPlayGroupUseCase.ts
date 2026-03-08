import { ICreateGroupPlayRoomUseCase } from "../../interfaces/user/groupplayUseCases/ICreateGroupPlayRoomUseCase";
import { GroupEntity } from "../../../../domain/entities/GroupEntity";
import { IGroupRepository } from "../../../../domain/interfaces/repository/user/IGroupRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import crypto from "crypto";
import { groupDTO, mapGroupToDTO } from "../../../DTOs/user/groupDto";

function generateJoinCode(): string {
  return crypto.randomBytes(4).toString("hex");
}

export class CreateGroupPlayRoomUseCase implements ICreateGroupPlayRoomUseCase {
  constructor(
    private groupRepository: IGroupRepository,
    private userRepository: IUserRepository,
  ) {}
  async execute(hostUserId: string): Promise<groupDTO> {
    if (!hostUserId) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }
    const joinCode = await generateJoinCode();
    const group = new GroupEntity({
      name: "Group Play Room",
      ownerId: hostUserId,
      difficulty: "easy",
      joinLink: joinCode,
    });
    const groupCreated = await this.groupRepository.create(group);
    groupCreated.members = await Promise.all(
      groupCreated.members.map(async (item: any) => {
        const memberId = item.toString();
        const member = await this.userRepository.findById(memberId);
        if (!member) return null;
        return {
          userId: (member as any)._id,
          name: (member as any).name,
          imageUrl: (member as any).imageUrl,
          isHost:
            (member as any)._id.toString() == groupCreated.ownerId.toString(),
        };
      }),
    );
    groupCreated.members = groupCreated.members.filter((m: any) => m !== null);
    return mapGroupToDTO(groupCreated);
  }
}
