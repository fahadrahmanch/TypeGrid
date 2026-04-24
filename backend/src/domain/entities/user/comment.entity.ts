interface CommentProps {
  id?: string;
  DiscussionpostId: string;
  userId: string;
  content: string;
  replies?: Array<{
    userId: string;
    content: string;
    createdAt: Date;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CommentEntity {
  private id?: string;
  private DiscussionpostId: string;
  private userId: string;
  private content: string;
  private replies: Array<{
    userId: string;
    content: string;
    createdAt: Date;
  }>;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(props: CommentProps) {
    this.id = props.id;
    this.DiscussionpostId = props.DiscussionpostId;
    this.userId = props.userId;
    this.content = props.content;
    this.replies = props.replies || [];
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  getDiscussionpostId(): string {
    return this.DiscussionpostId;
  }
  getUserId(): string {
    return this.userId;
  }
  getContent(): string {
    return this.content;
  }
  getReplies(): Array<{ userId: string; content: string; createdAt: Date }> {
    return this.replies;
  }
  getId(): string | undefined {
    return this.id;
  }
  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }
  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
  addReply(userId: string, content: string) {
    this.replies.push({
      userId,
      content,
      createdAt: new Date(),
    });
  }

  toObject() {
    return {
      id: this.id,
      DiscussionpostId: this.DiscussionpostId,
      userId: this.userId,
      content: this.content,
      replies: this.replies,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
