export type SubscriptionPlanProps = {
  id?: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  type: 'normal' | 'company';
  userLimit?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class SubscriptionPlanEntity {
  private id?: string;
  private name: string;
  private price: number;
  private duration: number;
  private features: string[];
  private type: 'normal' | 'company';
  private userLimit?: number;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(props: SubscriptionPlanProps) {
    this.id = props.id;
    this.name = props.name;
    this.price = props.price;
    this.duration = props.duration;
    this.features = props.features;
    this.type = props.type;
    this.userLimit = props.userLimit;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getFeatures(): string[] {
    return this.features;
  }

  public getType(): 'normal' | 'company' {
    return this.type;
  }

  public getUserLimit(): number | undefined {
    return this.userLimit;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  public toObject() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      duration: this.duration,
      features: this.features,
      type: this.type,
      userLimit: this.userLimit,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
