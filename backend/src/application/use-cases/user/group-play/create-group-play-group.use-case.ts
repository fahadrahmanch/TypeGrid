import { ICreateGroupPlayRoomUseCase } from "../../interfaces/user/group-play/create-group-play-room.interface";
import { GroupEntity } from "../../../../domain/entities/group.entity";
import { IGroupRepository } from "../../../../domain/interfaces/repository/user/group-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import crypto from "crypto";
import { groupDTO, mapGroupToDTO } from "../../../DTOs/user/group.dto";

function generateJoinCode(): string {
  return crypto.randomBytes(4).toString("hex");
}

export class CreateGroupPlayRoomUseCase implements ICreateGroupPlayRoomUseCase {
  constructor(
    private readonly _groupRepository: IGroupRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(hostUserId: string): Promise<groupDTO> {
    if (!hostUserId) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    const joinCode = generateJoinCode(); // no need for await — not async

    const group = new GroupEntity({
      name: "Group Play Room",
      ownerId: hostUserId,
      difficulty: "easy",
      joinLink: joinCode,
    });

    const groupCreated = await this._groupRepository.create(group.toObject());

    const members = await Promise.all(
      groupCreated.getMembers().map(async (memberId: string) => {
        const member = await this._userRepository.findById(memberId);
        if (!member) return null;
        return {
          userId: member._id?.toString() ?? memberId,
          name: member.name,
          imageUrl: member.imageUrl,
          isHost: member._id?.toString() === groupCreated.getOwnerId().toString(),
        };
      })
    );

    return mapGroupToDTO({
      ...groupCreated.toObject(),
      members: members.filter((m): m is NonNullable<typeof m> => m !== null),
    });
  }
}
