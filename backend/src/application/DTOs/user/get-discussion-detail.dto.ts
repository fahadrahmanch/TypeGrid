import { IDiscussionDTO } from "./get-discussions.dto";

export interface ICommentDTO {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  postedAt: string;
}

export interface IDiscussionDetailDTO extends IDiscussionDTO {
  comments: ICommentDTO[];
}
