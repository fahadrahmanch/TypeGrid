export interface ITokenService{
    generateAccessToken(email:string):Promise<string>
    generateRefreshToken(email:string):Promise<string>
    verifyAccessToken(token:string):Promise<any>
    verifyRefreshToken(refresToken:string):Promise<any>
}