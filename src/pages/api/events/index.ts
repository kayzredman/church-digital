import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Event[] | Event | { message: string } | { error: string }>
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
    if (req.method === 'GET') {
      // Get all events
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .order('startDate', { ascending: true });

      if (error) throw error;
      return res.status(200).json(data as Event[]);
    }

    if (req.method === 'POST') {
      // Create event (admin only)
      const { title, description, startDate, endDate, location, category, capacity } = req.body;

      if (!title || !startDate || !location) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title,
            description,
            startDate,
            endDate,
            location,
            category,
            capacity: capacity || 500,
            registered: 0,
            published: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data as Event);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
