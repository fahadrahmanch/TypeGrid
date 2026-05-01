import Stripe from "stripe";
import { IStripeService } from "../../domain/interfaces/services/stripe-service.interface";

export class StripeService implements IStripeService {
  private stripe: any;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    if (!process.env.CLIENT_URL) {
      throw new Error("CLIENT_URL is not defined in the environment variables");
    }
  }

  async createCheckoutSession(name: string, price: number, planId: string,type:string): Promise<string | null> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      success_url: `${process.env.CLIENT_URL}/success?planId=${planId}&type=${type}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    return session.url;
  }
}
