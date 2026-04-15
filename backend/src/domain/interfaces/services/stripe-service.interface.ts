export interface IStripeService {
    createCheckoutSession(name: string, price: number, planId: string): Promise<string | null>;
}
