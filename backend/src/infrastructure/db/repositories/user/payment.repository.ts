import { Model } from "mongoose";
import { BaseRepository } from "../../base/base.repository";
import { IPaymentRepository } from "../../../../domain/interfaces/repository/user/payment.repository.interface";
import { IPaymentDocument } from "../../types/documents";
import { PaymentEntity } from "../../../../domain/entities/user/payment.entity";
import { PaymentMapper } from "../../mappers/user/payment.mapper";

export class PaymentRepository extends BaseRepository<IPaymentDocument, PaymentEntity> implements IPaymentRepository {
  constructor(model: Model<IPaymentDocument>) {
    super(model, PaymentMapper.toDomain);
  }
}
