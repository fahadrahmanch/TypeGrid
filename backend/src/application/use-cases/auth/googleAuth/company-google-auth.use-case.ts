import { ICompanyGoogleAuthUseCase } from "../../interfaces/auth/company-google-auth.interface";
import { AuthUserEntity } from "../../../../domain/entities";
import { IAuthRepository } from "../../../../domain/interfaces/repository/user/auth-repository.interface";
import { ICompanyRepository } from "../../../../domain/interfaces/repository/company/company-repository.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";
export class CompanyGoogleAuthUseCase implements ICompanyGoogleAuthUseCase {
    constructor(
        private readonly _authRepository: IAuthRepository,
        private readonly _companyRepository: ICompanyRepository,
    ){}

    async execute(name: string, email: string): Promise<AuthUserEntity> {
            const user = await this._authRepository.findByEmail(email);

            if(!user){
                throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
            }
            if(!user.googleId){
                throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GOOGLE_ID_NOT_FOUND);
            }
            if(user.role == "user" || user.role == "admin"){
                throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.AUTH_USER_NOT_AUTHORIZED);
            }
            if(!user?.CompanyId){
                throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.USER_NOT_PART_OF_ANY_COMPANY);
            }
            const company = await this._companyRepository.findById(user.CompanyId);
            if(!company){
                throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
            }
            if(company.status=="expired"){
                throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.COMPANY_EXPIRED);
            }
            if(company.status=="inactive"){
                throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.COMPANY_NOT_ACTIVE);
            }
            if(company.status=="pending"){  
                throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.COMPANY_PENDING);
            }
            if(company.status=="reject"){
                throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.COMPANY_NOT_FOUND);
            }
            if (user.status === "block") {
              throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.AUTH_ACCOUNT_BLOCKED);
            }
        
            return user as AuthUserEntity;
    }
}
