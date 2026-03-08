import { IRemoveMemberGroupPlayGroupUseCase } from "../../application/use-cases/interfaces/user/group-play/remove-member-group-play-group.interface";
import logger from "../../utils/logger";
import { IValidateGroupPlayMemberUseCase } from "../../application/use-cases/interfaces/user/group-play/validate-group-play-member.interface";
import { GroupPlayResult } from "../../application/DTOs/user/group-play.dto";
import { IFinishGroupPlayUseCase } from "../../application/use-cases/interfaces/user/group-play/finish-group-play.interface";

export class GroupSocketController {
  constructor(
    private _removeMemberGroupPlayGroupUseCase: IRemoveMemberGroupPlayGroupUseCase,
    private _validateGroupPlayMemberUseCase: IValidateGroupPlayMemberUseCase,
    private _finishGroupPlayUseCase: IFinishGroupPlayUseCase,
  ) {}

  async handleDisconnect(socket: any, io: any) {
    const { groupId, userId } = socket.data;
    if (!groupId || !userId) {
      return;
    }
    try {
      const updateGroup = await this._removeMemberGroupPlayGroupUseCase.execute(
        groupId,
        userId,
        "LEAVE",
      );

      const newHosrId = updateGroup.ownerId;
      io.to(groupId).emit("player-left", {
        userId: userId,
        newHostId: newHosrId,
        members: updateGroup.members,
      });
    } catch (error: any) {
      logger.error("Error in group socket handleDisconnect", {
        error: error.message,
        stack: error.stack,
        groupId: socket.data.groupId,
        userId: socket.data.userId,
      });
    }
  }

  async getGroup(gameId: string, userId: string): Promise<boolean | undefined> {
    try {
      const isMember = await this._validateGroupPlayMemberUseCase.execute(
        gameId,
        userId,
      );
      return isMember;
    } catch (error: any) {
      logger.error("Error in group socket getGroup validation", {
        error: error.message,
        stack: error.stack,
        gameId,
        userId,
      });
    }
  }

  async groupLeave(socket: any, io: any) {
    const { groupId, userId } = socket.data;
    if (!groupId || !userId) {
      return;
    }
    try {
      const updateGroup = await this._removeMemberGroupPlayGroupUseCase.execute(
        groupId,
        userId,
        "LEAVE",
      );
      const newHostId = updateGroup.ownerId;
      io.to(groupId).emit("player-left", {
        members: updateGroup.members,
        newHostId: newHostId,
      });
    } catch (error: any) {
      logger.error("Error in group socket groupLeave", {
        error: error.message,
        stack: error.stack,
        groupId: socket.data.groupId,
        userId: socket.data.userId,
      });
    }
  }

  async saveGroupPlayResult(
    gameId: string,
    resultArray: GroupPlayResult[],
  ): Promise<void> {
    try {
      await this._finishGroupPlayUseCase.execute(gameId, resultArray);
    } catch (error: any) {
      logger.error("Error in saveGroupPlayResult socket handler", {
        error: error.message,
        stack: error.stack,
        gameId,
      });
    }
  }
}
