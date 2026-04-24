import { Response } from 'express';
import { AuthRequest } from '../../../types/AuthRequest';
import { ICreatePostUseCase } from '../../../application/use-cases/interfaces/user/create-post.interface';
import { IGetAllDiscussionsUseCase } from '../../../application/use-cases/interfaces/user/get-all-discussions.interface';
import { IGetDiscussionByIdUseCase } from '../../../application/use-cases/interfaces/user/get-discussion-by-id.interface';
import { ICreateCommentUseCase } from '../../../application/use-cases/interfaces/user/create-comment.interface';
import { ICreateReplyUseCase } from '../../../application/use-cases/interfaces/user/create-reply.interface';
import { HttpStatus } from '../../constants/httpStatus';
import { CustomError } from '../../../domain/entities/custom-error.entity';
import { MESSAGES } from '../../../domain/constants/messages';

export class DiscussionController {
  constructor(
    private _createPostUseCase: ICreatePostUseCase,
    private _getAllDiscussionsUseCase: IGetAllDiscussionsUseCase,
    private _getDiscussionByIdUseCase: IGetDiscussionByIdUseCase,
    private _createCommentUseCase: ICreateCommentUseCase,
    private _createReplyUseCase: ICreateReplyUseCase
  ) {}

  createPost = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    const { title, content } = req.body;
    if (!title || !content) {
      throw new CustomError(HttpStatus.BAD_REQUEST, 'Title and content are required');
    }

    await this._createPostUseCase.execute(userId, { title, content });

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Post created successfully',
    });
  };
  getAllDiscussions = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const posts = await this._getAllDiscussionsUseCase.execute(page, limit);
    console.log(posts);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Posts fetched successfully',
      data: posts,
    });
  };

  getDiscussionById = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new CustomError(HttpStatus.BAD_REQUEST, 'Discussion ID is required');
    }

    const discussion = await this._getDiscussionByIdUseCase.execute(id);
    console.log("discussion in controller", discussion?.comments[0]);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Discussion fetched successfully',
      data: discussion,
    });
  };
  createComment = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const { discussionId, content } = req.body;
    if (!discussionId || !content) {
      throw new CustomError(HttpStatus.BAD_REQUEST, 'Discussion ID and content are required');
    }
    await this._createCommentUseCase.execute(userId, discussionId, content);
    
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Comment created successfully',
    });
  };
  createReply = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const { commentId, content } = req.body;
    if (!commentId || !content) {
      throw new CustomError(HttpStatus.BAD_REQUEST, 'Comment ID and content are required');
    }
    await this._createReplyUseCase.execute(userId, commentId, content);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Reply created successfully',
    });
  };
}
