export interface IStripeService {
  createCheckoutSession(userId:string,name: string, price: number, planId: string,type:string): Promise<string | null>;
}
