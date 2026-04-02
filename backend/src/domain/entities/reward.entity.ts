type RewardProps = {
  _id?: string;
  xp: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class RewardEntity {
  private _id?: string;
  private xp: number;
  private description: string;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(attrs: RewardProps) {
    this._id = attrs._id;
    this.xp = attrs.xp;
    this.description = attrs.description;
    this.createdAt = attrs.createdAt;
    this.updatedAt = attrs.updatedAt;
  }

  getId(): string | undefined {
    return this._id;
  }
  getXp(): number {
    return this.xp;
  }
  getDescription(): string {
    return this.description;
  }
  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }
  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  toObject() {
    return {
      _id: this._id,
      xp: this.xp,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
