import { Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/httpStatus";
import { getIO } from "../../../infrastructure/socket/socket";
import logger from "../../../utils/logger";

import { ICreateGroupPlayRoomUseCase } from "../../../application/use-cases/interfaces/user/group-play/create-group-play-room.interface";
import { IGetGroupPlayGroupUseCase } from "../../../application/use-cases/interfaces/user/group-play/get-group-play-group.interface";
import { AuthRequest } from "../../../types/AuthRequest";
import { MESSAGES } from "../../../domain/constants/messages";
import { IEditGroupPlayUseCase } from "../../../application/use-cases/interfaces/user/group-play/edit-group-play.interface";
import { IJoinGroupPlayGroupUseCase } from "../../../application/use-cases/interfaces/user/group-play/join-group-play-group.interface";
import { IRemoveMemberGroupPlayGroupUseCase } from "../../../application/use-cases/interfaces/user/group-play/remove-member-group-play-group.interface";
import { IStartGameGroupPlayGroupUseCase } from "../../../application/use-cases/interfaces/user/group-play/start-game-group-play-group.interface";
import { IChangeGroupStatusUseCase } from "../../../application/use-cases/interfaces/user/group-play/change-group-status.interface";
import { INewGroupPlayUseCase } from "../../../application/use-cases/interfaces/user/group-play/new-group-play.interface";
export class GroupPlayController {
  constructor(
    private _createGroupPlayRoomUseCase: ICreateGroupPlayRoomUseCase,
    private _getGroupPlayGroupUseCase: IGetGroupPlayGroupUseCase,
    private _editGroupPlayGroupUseCase: IEditGroupPlayUseCase,
    private _joinGroupPlayGroupUseCase: IJoinGroupPlayGroupUseCase,
    private _removeMemberGroupPlayGroupUseCase: IRemoveMemberGroupPlayGroupUseCase,
    private _startGameGroupPlayGroupUseCase: IStartGameGroupPlayGroupUseCase,
    private _changeGroupStatusUseCase: IChangeGroupStatusUseCase,
    private _newGroupPlayUseCase: INewGroupPlayUseCase,
  ) { }

  async createGroup(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const hostUserId = req.user?.userId;
      if (!hostUserId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED,
        });
        return;
      }
      const group = await this._createGroupPlayRoomUseCase.execute(hostUserId);

      if (!group) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGES.GROUP_PLAY_ROOM_CREATE_FAILED,
        });
        return;
      }

      logger.info("Room created successfully", { groupId: group.id, hostId: hostUserId });
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Room created successfully",
        group,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getGroup(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const joinLink = req.params.joinLink;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      if (!joinLink) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.JOIN_ID_REQUIRED_FOR_GROUP_DETAILS,
        });
        return;
      }

      const group = await this._getGroupPlayGroupUseCase.execute(
        joinLink,
        userId,
      );

      if (!group) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: MESSAGES.GROUP_NOT_FOUND_WITH_JOIN_ID,
        });
        return;
      }

      logger.info("Group fetched successfully", { groupId: group.id, userId });
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Group fetched successfully",
        group,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async editGroup(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { difficulty, maxPlayers } = req.body;
      const groupId = req.params.groupId;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      if (!groupId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.GROUP_ID_REQUIRED_TO_EDIT,
        });
        return;
      }

      if (!difficulty && !maxPlayers) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.DIFFICULTY_AND_MAX_PLAYERS_REQUIRED,
        });
        return;
      }

      const group = await this._editGroupPlayGroupUseCase.execute(
        groupId,
        difficulty,
        maxPlayers,
        userId,
      );

      getIO().to(group.id).emit("change-difficulty", {
        difficulty: group.difficulty,
        maximumPlayers: group.maximumPlayers,
      });
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Group edited successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  async joinGroup(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const joinLink = req.params.joinLink;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      if (!joinLink) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.JOIN_ID_REQUIRED_TO_JOIN,
        });
        return;
      }

      const group = await this._joinGroupPlayGroupUseCase.execute(
        joinLink,
        userId,
      );

      getIO().to(group.id).emit("fetchGroupDetails", {
        group,
      });
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Joined group successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  async removeMember(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const groupId = req.params.groupId;
      const userId = req.params.playerId;

      if (!groupId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.GROUP_ID_REQUIRED_TO_REMOVE_MEMBER,
        });
        return;
      }

      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.UNAUTHORIZED,
        });
        return;
      }

      const group = await this._removeMemberGroupPlayGroupUseCase.execute(
        groupId,
        userId,
        "KICK",
      );

      getIO().to(groupId).emit("remove-player", {
        group,
      });
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Member removed successfully",
        group,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async startGame(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const groupId = req.params.groupId;
      const { countDown } = req.body;

      if (!groupId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.GROUP_ID_REQUIRED_TO_START_GAME,
        });
        return;
      }

      const startCompetition = await this._startGameGroupPlayGroupUseCase.execute(groupId, countDown);

      if (!startCompetition) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGES.SOMETHING_WENT_WRONG,
        });
        return;
      }

      await this._changeGroupStatusUseCase.changeGroupStatus(
        groupId,
        "started",
      );

      getIO().to(groupId).emit("game-started", {
        competition: startCompetition,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Game started successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  async newGame(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const gameId = req.params.gameId;
      const users = req.body.currentUsers;

      if (!gameId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.GAME_ID_REQUIRED_TO_START_NEW_GAME,
        });
        return;
      }

      if (!users || users.length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.AT_LEAST_ONE_USER_REQUIRED,
        });
        return;
      }

      const startCompetition = await this._newGroupPlayUseCase.execute(
        gameId,
        users,
      );

      if (!startCompetition) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: MESSAGES.SOMETHING_WENT_WRONG,
        });
        return;
      }

      getIO().to(startCompetition.groupId!).emit("new-game-started", {
        competition: startCompetition,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "New Game started successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }
}
