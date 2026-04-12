export interface NotificationReceiptProps {
  _id?: string;
  notificationId: string;
  userId: string;
  isRead?: boolean;
  readAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class NotificationReceiptEntity {
  private _id?: string;
  private notificationId: string;
  private userId: string;
  private isRead: boolean;
  private readAt?: Date | null;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(props: NotificationReceiptProps) {
    this._id = props._id;
    this.notificationId = props.notificationId;
    this.userId = props.userId;
    this.isRead = props.isRead ?? false;
    this.readAt = props.readAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  getId() {
    return this._id;
  }

  getNotificationId() {
    return this.notificationId;
  }

  getUserId() {
    return this.userId;
  }

  getIsRead() {
    return this.isRead;
  }

  getReadAt() {
    return this.readAt;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  markAsRead() {
    this.isRead = true;
    this.readAt = new Date();
  }

  toObject(): NotificationReceiptProps {
    return {
      _id: this._id,
      notificationId: this.notificationId,
      userId: this.userId,
      isRead: this.isRead,
      readAt: this.readAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
