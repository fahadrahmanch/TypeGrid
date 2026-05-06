export interface IDiscussionDTO {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  postedAt: string;
  commentCount: number;
}
