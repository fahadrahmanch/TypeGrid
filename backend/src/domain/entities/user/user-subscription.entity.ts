export type UserSubscriptionStatus = "active" | "expired" | "pending";

export type UserSubscriptionProps = {
  id?: string;
  userId: string;
  subscriptionPlanId: string;
  planType: "normal" | "company";
  status: UserSubscriptionStatus;
  startDate?: Date;
  endDate?: Date;
  paymentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserSubscriptionEntity {
  private id?: string;
  private userId: string;
  private subscriptionPlanId: string;
  private planType: "normal" | "company";
  private status: UserSubscriptionStatus;
  private startDate?: Date;
  private endDate?: Date;
  private paymentId?: string;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(props: UserSubscriptionProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.subscriptionPlanId = props.subscriptionPlanId;
    this.planType = props.planType;
    this.status = props.status;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.paymentId = props.paymentId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getSubscriptionPlanId(): string {
    return this.subscriptionPlanId;
  }

  public getStatus(): UserSubscriptionStatus {
    return this.status;
  }
  public getPlanType(): "normal" | "company" {
    return this.planType;
  }

  public getStartDate(): Date | undefined {
    return this.startDate;
  }

  public getEndDate(): Date | undefined {
    return this.endDate;
  }

  public getPaymentId(): string | undefined {
    return this.paymentId;
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
      userId: this.userId,
      subscriptionPlanId: this.subscriptionPlanId,
      planType: this.planType,
      status: this.status,
      startDate: this.startDate,
      endDate: this.endDate,
      paymentId: this.paymentId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
