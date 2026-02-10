import { AuthRequest } from "../../../types/AuthRequest"
import { Response } from "express"
import { IGetCompanyGroupsUseCase } from "../../../application/use-cases/interfaces/companyAdmin/IGetCompanyGroupsUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
export class CompanyGroupController{
    constructor(
        private _createCompanyGroupUseCase:any,
        private _getCompanyGroupsUseCase:IGetCompanyGroupsUseCase
    ){}

  async createGroup(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    const groupData = req.body;

    await this._createCompanyGroupUseCase.execute(groupData, userId);

    res.status(201).json({
      success: true,
      message: MESSAGES.GROUP_CREATED_SUCCESS,
    });

  } catch (error) {
    console.error("Create Group Error:", error);

    res.status(500).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
}

async getCompanyGroups(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: MESSAGES.UNAUTHORIZED,
      });
      return;
    }

    const groups = await this._getCompanyGroupsUseCase.execute(userId);
    console.log("groups in controller",groups)
    res.status(200).json({
      success: true,
      message: MESSAGES.GROUPS_FETCHED_SUCCESS,
      groups,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
}

}