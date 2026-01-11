
export interface IDeleteCompanyUserUseCase{
    deleteUser(companyUserId:string):Promise<void>
}