import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { payment, paystackPayment } from '@/lib/payment';
import { Donation } from '@/types/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Donation | { clientSecret?: string } | { authorizationUrl?: string } | { error: string }>
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      const { amount, currency = 'USD', paymentMethod, email, name, message } = req.body;

      if (!amount || !paymentMethod) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create donation record
      const { data: donationRecord, error: dbError } = await supabase
        .from('donations')
        .insert([
          {
            amount: parseFloat(amount),
            currency,
            paymentMethod,
            status: 'pending',
            email: email || null,
            name: name || 'Anonymous',
            message: message || null,
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      // Process payment based on method
      if (paymentMethod === 'stripe') {
        const paymentIntent = await payment.createStripePaymentIntent(
          parseFloat(amount),
          currency,
          {
            donationId: donationRecord.id,
            email,
            name,
          }
        );

        return res.status(200).json({
          clientSecret: paymentIntent.clientSecret || '',
        });
      }

      if (paymentMethod === 'paystack') {
        const paystackInitialize = await paystackPayment.initializePayment(
          email,
          parseFloat(amount),
          donationRecord.id,
          {
            donationId: donationRecord.id,
            name,
          }
        );

        return res.status(200).json({
          authorizationUrl: paystackInitialize.authorizationUrl,
        });
      }

      return res.status(200).json(donationRecord as Donation);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
