import { Response } from "express";
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
import { CustomError } from "../../../domain/entities/custom-error.entity";
export class GroupPlayController {
  constructor(
    private _createGroupPlayRoomUseCase: ICreateGroupPlayRoomUseCase,
    private _getGroupPlayGroupUseCase: IGetGroupPlayGroupUseCase,
    private _editGroupPlayGroupUseCase: IEditGroupPlayUseCase,
    private _joinGroupPlayGroupUseCase: IJoinGroupPlayGroupUseCase,
    private _removeMemberGroupPlayGroupUseCase: IRemoveMemberGroupPlayGroupUseCase,
    private _startGameGroupPlayGroupUseCase: IStartGameGroupPlayGroupUseCase,
    private _changeGroupStatusUseCase: IChangeGroupStatusUseCase,
    private _newGroupPlayUseCase: INewGroupPlayUseCase
  ) {}

  createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
    const hostUserId = req.user?.userId;
    if (!hostUserId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }
    const group = await this._createGroupPlayRoomUseCase.execute(hostUserId);

    if (!group) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.GROUP_PLAY_ROOM_CREATE_FAILED);
    }

    logger.info(MESSAGES.ROOM_CREATED_SUCCESS, {
      groupId: group.id,
      hostId: hostUserId,
    });
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: MESSAGES.ROOM_CREATED_SUCCESS,
      group,
    });
  };

  getGroup = async (req: AuthRequest, res: Response): Promise<void> => {
    const joinLink = req.params.joinLink;
    const userId = req.user?.userId;

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    if (!joinLink) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.JOIN_ID_REQUIRED_FOR_GROUP_DETAILS);
    }

    const group = await this._getGroupPlayGroupUseCase.execute(joinLink, userId);

    if (!group) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND_WITH_JOIN_ID);
    }

    logger.info(MESSAGES.GROUP_FETCHED_SUCCESS, { groupId: group.id, userId });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.GROUP_FETCHED_SUCCESS,
      group,
    });
  };

  editGroup = async (req: AuthRequest, res: Response): Promise<void> => {
    const { difficulty, maxPlayers } = req.body;
    const groupId = req.params.groupId;
    const userId = req.user?.userId;

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    if (!groupId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.GROUP_ID_REQUIRED_TO_EDIT);
    }

    if (!difficulty && !maxPlayers) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.DIFFICULTY_AND_MAX_PLAYERS_REQUIRED);
    }

    const group = await this._editGroupPlayGroupUseCase.execute(groupId, difficulty, maxPlayers, userId);

    getIO().to(group.id).emit("change-difficulty", {
      difficulty: group.difficulty,
      maximumPlayers: group.maximumPlayers,
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.GROUP_EDITED_SUCCESS,
    });
  };

  joinGroup = async (req: AuthRequest, res: Response): Promise<void> => {
    const joinLink = req.params.joinLink;
    const userId = req.user?.userId;

    if (!userId) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, MESSAGES.UNAUTHORIZED);
    }

    if (!joinLink) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.JOIN_ID_REQUIRED_TO_JOIN);
    }

    const group = await this._joinGroupPlayGroupUseCase.execute(joinLink, userId);

    getIO().to(group.id).emit("fetchGroupDetails", {
      group,
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.JOIN_GROUP_SUCCESS,
    });
  };

  removeMember = async (req: AuthRequest, res: Response): Promise<void> => {
    const groupId = req.params.groupId;
    const userId = req.params.playerId;

    if (!groupId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.GROUP_ID_REQUIRED_TO_REMOVE_MEMBER);
    }

    if (!userId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.UNAUTHORIZED);
    }

    const group = await this._removeMemberGroupPlayGroupUseCase.execute(groupId, userId, "KICK");

    getIO().to(groupId).emit("remove-player", {
      group,
    });
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.MEMBER_REMOVED_SUCCESS,
      group,
    });
  };

  startGame = async (req: AuthRequest, res: Response): Promise<void> => {
    const groupId = req.params.groupId;
    const { countDown } = req.body;

    if (!groupId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.GROUP_ID_REQUIRED_TO_START_GAME);
    }

    const startCompetition = await this._startGameGroupPlayGroupUseCase.execute(groupId, countDown);

    if (!startCompetition) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG);
    }

    await this._changeGroupStatusUseCase.changeGroupStatus(groupId, "started");

    getIO().to(groupId).emit("game-started", {
      competition: startCompetition,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.GAME_STARTED_SUCCESS,
    });
  };

  newGame = async (req: AuthRequest, res: Response): Promise<void> => {
    const gameId = req.params.gameId;
    const users = req.body.currentUsers;

    if (!gameId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.GAME_ID_REQUIRED_TO_START_NEW_GAME);
    }

    if (!users || users.length === 0) {
      throw new CustomError(HttpStatus.BAD_REQUEST, MESSAGES.AT_LEAST_ONE_USER_REQUIRED);
    }

    const startCompetition = await this._newGroupPlayUseCase.execute(gameId, users);

    if (!startCompetition) {
      throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG);
    }

    getIO().to(startCompetition.groupId!).emit("new-game-started", {
      competition: startCompetition,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.NEW_GAME_STARTED_SUCCESS,
    });
  };
}
