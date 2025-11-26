export interface ITokenService{
    generateAccessToken(email:string,role:string):Promise<string>
    generateRefreshToken(email:string,role:string):Promise<string>
    verifyAccessToken(token:string):Promise<any>
    verifyRefreshToken(refresToken:string):Promise<any>
}