export interface IOtpService{
    createOtp():Promise<string>
}