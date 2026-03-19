import { IGroupRepository } from "../../../../domain/interfaces/repository/user/group-repository.interface";
import { IChangeGroupStatusUseCase } from "../../interfaces/user/group-play/change-group-status.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

export class ChangeGroupStatusUseCase implements IChangeGroupStatusUseCase {
  constructor(private readonly _groupRepository: IGroupRepository) {}

  async changeGroupStatus(groupId: string, status: string): Promise<void> {
    const group = await this._groupRepository.findById(groupId);
    if (!group) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND);
    }

    group.setStatus(status);
    await this._groupRepository.update(group.toObject());
  }
}