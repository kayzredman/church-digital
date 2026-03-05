import Stripe from 'stripe';

// Initialize Stripe (without specifying a specific API version - use latest)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Payment utility functions
export const payment = {
  // Create Stripe payment intent
  createStripePaymentIntent: async (
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, any>
  ) => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: metadata || {},
      });

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      };
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${error}`);
    }
  },

  // Verify Stripe webhook
  verifyStripeWebhook: (body: string, signature: string) => {
    try {
      return stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error}`);
    }
  },

  // Create Stripe customer
  createStripeCustomer: async (
    email: string,
    name: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: metadata || {},
      });

      return customer.id;
    } catch (error) {
      throw new Error(`Failed to create customer: ${error}`);
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentIntentId: string) => {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      throw new Error(`Failed to get payment status: ${error}`);
    }
  },
};

// Paystack payment utilities
export const paystackPayment = {
  // Initialize payment
  initializePayment: async (
    email: string,
    amount: number,
    reference: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100), // Convert to lowest currency unit
          reference,
          metadata,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        }),
      });

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.message);
      }

      return {
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        reference: data.data.reference,
      };
    } catch (error) {
      throw new Error(`Failed to initialize Paystack payment: ${error}`);
    }
  },

  // Verify payment
  verifyPayment: async (reference: string) => {
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.message);
      }

      return {
        status: data.data.status,
        amount: data.data.amount / 100,
        reference: data.data.reference,
        customer: data.data.customer,
        metadata: data.data.metadata,
      };
    } catch (error) {
      throw new Error(`Failed to verify Paystack payment: ${error}`);
    }
  },
};
