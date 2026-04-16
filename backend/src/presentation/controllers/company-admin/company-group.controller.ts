import { AuthRequest } from '../../../types/AuthRequest';
import logger from '../../../utils/logger';
import { Response } from 'express';
import { HttpStatus } from '../../constants/httpStatus';
import { IGetCompanyGroupsUseCase } from '../../../application/use-cases/interfaces/companyAdmin/get-company-groups.interface';
import { MESSAGES } from '../../../domain/constants/messages';
import { ICreateCompanyGroupAutoUseCase } from '../../../application/use-cases/interfaces/companyAdmin/create-company-group-auto.interface';
import { CreateCompanyGroupAutoDTO } from '../../../application/DTOs/companyAdmin/create-company-group-auto.dto';
import { IGetCompanyGroupByIdUseCase } from '../../../application/use-cases/interfaces/companyAdmin/get-company-group-by-id.interface';
import { IRemoveCompanyGroupMemberUseCase } from '../../../application/use-cases/interfaces/companyAdmin/remove-company-group-member.interface';
import { IAddCompanyGroupMemberUseCase } from '../../../application/use-cases/interfaces/companyAdmin/add-company-group-member.interface';
import { IDeleteCompanyGroupUseCase } from '../../../application/use-cases/interfaces/companyAdmin/delete-company-group.interface';

export class CompanyGroupController {
  constructor(
    private _createCompanyGroupUseCase: any,
    private _getCompanyGroupsUseCase: IGetCompanyGroupsUseCase,
    private _createCompanyGroupAutoUseCase: ICreateCompanyGroupAutoUseCase,
    private _getCompanyGroupByIdUseCase: IGetCompanyGroupByIdUseCase,
    private _removeCompanyGroupMemberUseCase: IRemoveCompanyGroupMemberUseCase,
    private _addCompanyGroupMemberUseCase: IAddCompanyGroupMemberUseCase,
    private _deleteCompanyGroupUseCase: IDeleteCompanyGroupUseCase
  ) {}

  createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }

    const groupData = req.body;

    await this._createCompanyGroupUseCase.execute(groupData, userId);

    logger.info('Company group created successfully', { userId });
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: MESSAGES.GROUP_CREATED_SUCCESS,
    });
  };

  createGroupAuto = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }

    const groupData: CreateCompanyGroupAutoDTO = req.body;

    await this._createCompanyGroupAutoUseCase.execute(groupData, userId);

    logger.info('Company group created successfully', { userId });

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: MESSAGES.GROUP_CREATED_SUCCESS,
    });
  };

  getCompanyGroups = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }

    const groups = await this._getCompanyGroupsUseCase.execute(userId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.GROUPS_FETCHED_SUCCESS,
      groups,
    });
  };

  getCompanyGroupById = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const groupId = req.params.id;

    if (!userId) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }

    const group = await this._getCompanyGroupByIdUseCase.execute(groupId, userId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.GROUPS_FETCHED_SUCCESS,
      group,
    });
  };

  removeMember = async (req: AuthRequest, res: Response): Promise<void> => {
    const adminUserId = req.user?.userId;
    const { groupId, memberId } = req.params;

    if (!adminUserId) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }

    await this._removeCompanyGroupMemberUseCase.execute(groupId, memberId, adminUserId);

    logger.info('Member removed from company group', {
      groupId,
      memberId,
      adminUserId,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.DELETE_SUCCESS,
    });
  };

  addMember = async (req: AuthRequest, res: Response): Promise<void> => {
    const adminUserId = req.user?.userId;
    const { groupId, memberId } = req.params;

    if (!adminUserId) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }

    await this._addCompanyGroupMemberUseCase.execute(groupId, memberId, adminUserId);

    logger.info('Member added to company group', {
      groupId,
      memberId,
      adminUserId,
    });

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.UPDATE_SUCCESS,
    });
  };

  deleteGroup = async (req: AuthRequest, res: Response): Promise<void> => {
    const adminUserId = req.user?.userId;
    const groupId = req.params.id;

    if (!adminUserId) {
      throw new Error(MESSAGES.UNAUTHORIZED);
    }

    await this._deleteCompanyGroupUseCase.execute(groupId, adminUserId);

    logger.info('Company group deleted successfully', { groupId, adminUserId });

    res.status(HttpStatus.OK).json({
      success: true,
      message: MESSAGES.DELETE_SUCCESS,
    });
  };
}
