export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export type PaymentProps = {
  id?: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  providerTransactionId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class PaymentEntity {
  private id?: string;
  private userId: string;
  private amount: number;
  private currency: string;
  private status: PaymentStatus;
  private provider: string;
  private providerTransactionId: string;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(props: PaymentProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.amount = props.amount;
    this.currency = props.currency;
    this.status = props.status;
    this.provider = props.provider;
    this.providerTransactionId = props.providerTransactionId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public getStatus(): PaymentStatus {
    return this.status;
  }

  public getProvider(): string {
    return this.provider;
  }

  public getProviderTransactionId(): string {
    return this.providerTransactionId;
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
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      provider: this.provider,
      providerTransactionId: this.providerTransactionId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
