import { CompanyEntity } from "../../../domain/entities";
import { CompanyDTO } from "../../DTOs/user/company.dto";

export const mapToCompanyDTO = (company: CompanyEntity): CompanyDTO => {
  return {
    _id: company._id,
    companyName: company.companyName,
    email: company.email,
    address: company.address,
    number: company.number,
    OwnerId: company.OwnerId,
    planId: company.planId,
    status: company.status,
    startDate: company.startDate,
    endDate: company.endDate,
  };
};
