import { IPaymentDocument } from '../../types/documents';
import { PaymentEntity } from '../../../../domain/entities/user/payment.entity';

export class PaymentMapper {
  static toDomain(doc: IPaymentDocument): PaymentEntity {
    return new PaymentEntity({
      id: doc._id?.toString(),
      userId: doc.userId.toString(),
      amount: doc.amount,
      currency: doc.currency,
      status: doc.status,
      provider: doc.provider,
      providerTransactionId: doc.providerTransactionId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
