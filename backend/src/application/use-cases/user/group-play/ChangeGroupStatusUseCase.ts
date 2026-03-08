import { IGroupRepository } from "../../../../domain/interfaces/repository/user/IGroupRepository";
import { IChangeGroupStatusUseCase } from "../../interfaces/user/groupplayUseCases/IChangeGroupStatusUseCase";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
export class ChangeGroupStatusUseCase implements IChangeGroupStatusUseCase {
  constructor(private groupRepository: IGroupRepository) {}
  async changeGroupStatus(groupId: string, status: string) {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.GROUP_NOT_FOUND,
      );
    }
    group.status = status;
    await this.groupRepository.update(group);
  }
}
