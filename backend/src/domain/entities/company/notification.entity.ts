export interface NotificationProps {
  _id?: string;
  companyId: string;
  senderId: string;
  type: "individual" | "group" | "all";
  targetId?: string | null;
  title: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class NotificationEntity {
  private _id?: string;
  private companyId: string;
  private senderId: string;
  private type: "individual" | "group" | "all";
  private targetId?: string | null;
  private title: string;
  private message: string;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(props: NotificationProps) {
    this._id = props._id;
    this.companyId = props.companyId;
    this.senderId = props.senderId;
    this.type = props.type;
    this.targetId = props.targetId;
    this.title = props.title;
    this.message = props.message;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  getId() {
    return this._id;
  }

  getCompanyId() {
    return this.companyId;
  }

  getSenderId() {
    return this.senderId;
  }

  getType() {
    return this.type;
  }

  getTargetId() {
    return this.targetId;
  }

  getTitle() {
    return this.title;
  }

  getMessage() {
    return this.message;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  toObject(): NotificationProps {
    return {
      _id: this._id,
      companyId: this.companyId,
      senderId: this.senderId,
      type: this.type,
      targetId: this.targetId,
      title: this.title,
      message: this.message,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
