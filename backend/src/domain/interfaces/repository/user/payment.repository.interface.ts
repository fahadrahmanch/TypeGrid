import { IBaseRepository } from '../base-repository.interface';
import { PaymentEntity } from '../../../entities/user/payment.entity';

export interface IPaymentRepository extends IBaseRepository<PaymentEntity> {}
