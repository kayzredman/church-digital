import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { Sermon } from '@/types/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Sermon[] | Sermon | { message: string } | { error: string }>
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
      // Get all sermons
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data as Sermon[]);
    }

    if (req.method === 'POST') {
      // Create sermon (admin only)
      const { title, description, speaker, category, videoUrl, audioUrl, date } = req.body;

      if (!title || !speaker || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { data, error } = await supabase
        .from('sermons')
        .insert([
          {
            title,
            description,
            speaker,
            category,
            videoUrl,
            audioUrl,
            date,
            published: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data as Sermon);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
