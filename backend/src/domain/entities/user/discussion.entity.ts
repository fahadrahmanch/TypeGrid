interface DiscussionProps {
  id?: string;
  title: string;
  content: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DiscussionEntity {
  private id?: string;
  private title: string;
  private content: string;
  private userId: string;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(props: DiscussionProps) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  getTitle(): string {
    return this.title;
  }
  getContent(): string {
    return this.content;
  }
  getUserId(): string {
    return this.userId;
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
}
