import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

// Settings table should have a single row with all settings as JSON
// Table: settings, Columns: id (PK), data (JSONB)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Fetch settings
    const { data, error } = await supabase
      .from('settings')
      .select('data')
      .eq('id', 1)
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data?.data || {});
  }
  if (req.method === 'POST') {
    // Save settings
    const { data: settings } = req.body;
    const { error } = await supabase
      .from('settings')
      .upsert([{ id: 1, data: settings }], { onConflict: ['id'] });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
