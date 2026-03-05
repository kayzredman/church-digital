import type { NextApiRequest, NextApiResponse } from 'next';
import { payment } from '@/lib/payment';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';
import { email } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature'] as string;
  const body = req.body as string;

  try {
    const event = payment.verifyStripeWebhook(body, signature);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const donationId = paymentIntent.metadata?.donationId;

        if (donationId) {
          // Update donation record
          await supabase
            .from('donations')
            .update({
              status: 'completed',
              transactionId: paymentIntent.id,
            })
            .eq('id', donationId);

          // Send donation receipt email
          const { data: donation } = await supabase
            .from('donations')
            .select('*')
            .eq('id', donationId)
            .single();

          if (donation?.email) {
            await email.sendDonationReceipt(
              donation.email,
              donation.name,
              `$${donation.amount}`,
              new Date().toLocaleDateString()
            );
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const donationId = paymentIntent.metadata?.donationId;

        if (donationId) {
          // Update donation record
          await supabase
            .from('donations')
            .update({
              status: 'failed',
            })
            .eq('id', donationId);
        }
        break;
      }

      default:
        // Unhandled event type
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}
