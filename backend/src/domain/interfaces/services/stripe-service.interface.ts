export interface IStripeService {
  createCheckoutSession(name: string, price: number, planId: string,type:string): Promise<string | null>;
}
