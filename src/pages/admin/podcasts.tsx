
import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Save, X } from 'lucide-react';
import { Card, Button } from '@/components';
import { supabase } from '@/lib/supabase';
interface Podcast {
  id: string;
  title: string;
  description: string;
  speaker: string;
  audio_url: string;
  cover_image: string;
  published_at: string;
  duration?: string;
}

export default function AdminPodcasts() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    speaker: '',
    audio_url: '',
    cover_image: '',
    published_at: '',
    duration: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    speaker: '',
    audio_url: '',
    cover_image: '',
    published_at: '',
    duration: '',
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editErrorMsg, setEditErrorMsg] = useState('');

  // Edit handlers
  const handleEdit = (podcast: Podcast) => {
    setEditingId(podcast.id);
    setEditForm({
      title: podcast.title || '',
      description: podcast.description || '',
      speaker: podcast.speaker || '',
      audio_url: podcast.audio_url || '',
      cover_image: podcast.cover_image || '',
      published_at: podcast.published_at ? podcast.published_at.slice(0, 16) : '',
      duration: podcast.duration || '',
    });
    setEditErrorMsg('');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (podcastId: string) => {
    setEditSubmitting(true);
    setEditErrorMsg('');
    if (!editForm.title || !editForm.audio_url || !editForm.published_at) {
      setEditErrorMsg('Title, audio URL, and published date are required.');
      setEditSubmitting(false);
      return;
    }
    const { error } = await supabase.from('podcasts').update({
      title: editForm.title,
      description: editForm.description,
      speaker: editForm.speaker,
      audio_url: editForm.audio_url,
      cover_image: editForm.cover_image,
      published_at: editForm.published_at,
      duration: editForm.duration,
    }).eq('id', podcastId);
    if (!error) {
      setPodcasts(prev => prev.map(p =>
        p.id === podcastId ? { ...p, ...editForm } : p
      ));
      setEditingId(null);
    } else {
      setEditErrorMsg('Failed to update podcast.');
    }
    setEditSubmitting(false);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditErrorMsg('');
  };

  const handleDelete = async (podcastId: string) => {
    if (!window.confirm('Are you sure you want to delete this podcast?')) return;
    const { error } = await supabase.from('podcasts').delete().eq('id', podcastId);
    if (!error) {
      setPodcasts(prev => prev.filter(p => p.id !== podcastId));
    } else {
      alert('Failed to delete podcast.');
    }
  };

  useEffect(() => {
    const fetchPodcasts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('published_at', { ascending: false });
      if (!error && data) {
        setPodcasts(data);
      } else {
        setPodcasts([]);
      }
      setLoading(false);
    };
    fetchPodcasts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    // Basic validation
    if (!form.title || !form.audio_url || !form.published_at) {
      setErrorMsg('Title, audio URL, and published date are required.');
      setSubmitting(false);
      return;
    }
    const { data, error } = await supabase.from('podcasts').insert([
      {
        title: form.title,
        description: form.description,
        speaker: form.speaker,
        audio_url: form.audio_url,
        cover_image: form.cover_image,
        published_at: form.published_at,
        duration: form.duration,
      },
    ]).select();
    if (!error && data && data.length > 0) {
      setForm({
        title: '',
        description: '',
        speaker: '',
        audio_url: '',
        cover_image: '',
        published_at: '',
        duration: '',
      });
      setErrorMsg('');
      // Refresh all podcasts
      setPodcasts(prev => [data[0], ...prev]);
    } else {
      setErrorMsg('Failed to add podcast.');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Podcasts</h1>
      {/* Podcast Creation Form */}
      <Card className="mb-8 p-6">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 font-semibold text-sm" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
              <input name="speaker" value={form.speaker} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 font-semibold text-sm" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input name="duration" value={form.duration} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 font-semibold text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 font-semibold text-sm" />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Audio URL *</label>
              <input name="audio_url" value={form.audio_url} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 font-semibold text-sm" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
              <input name="cover_image" value={form.cover_image} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 font-semibold text-sm" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Published At *</label>
              <input name="published_at" type="datetime-local" value={form.published_at} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 font-semibold text-sm" required />
            </div>
          </div>
          {errorMsg && <div className="text-red-500 text-sm mb-2">{errorMsg}</div>}
          <Button type="submit" className="px-6 py-2" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Podcast'}
          </Button>
        </form>
      </Card>

      {/* Podcast List Card Grid */}
      <div className="mb-8">
        {loading ? (
          <Card className="p-6 text-center text-gray-500">Loading podcasts...</Card>
        ) : podcasts.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">No podcast episodes found.</Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {podcasts.map(podcast => (
              <Card key={podcast.id} className="flex flex-col items-center p-4">
                {editingId === podcast.id ? (
                  <>
                    <div className="w-full flex flex-col items-center mb-2">
                      {podcast.cover_image && (
                        <img
                          src={podcast.cover_image}
                          alt={podcast.title}
                          className="w-32 h-32 rounded-lg object-cover mb-3 border"
                        />
                      )}
                      <input name="title" value={editForm.title} onChange={handleEditChange} className="w-full px-2 py-1 border border-gray-300 rounded mb-1 text-gray-800 font-semibold text-sm" placeholder="Title" required />
                      <input name="speaker" value={editForm.speaker} onChange={handleEditChange} className="w-full px-2 py-1 border border-gray-300 rounded mb-1 text-gray-800 text-sm" placeholder="Speaker" />
                      <input name="duration" value={editForm.duration} onChange={handleEditChange} className="w-full px-2 py-1 border border-gray-300 rounded mb-1 text-gray-800 text-sm" placeholder="Duration" />
                      <textarea name="description" value={editForm.description} onChange={handleEditChange} className="w-full px-2 py-1 border border-gray-300 rounded mb-1 text-gray-800 text-sm" placeholder="Description" />
                      <input name="audio_url" value={editForm.audio_url} onChange={handleEditChange} className="w-full px-2 py-1 border border-gray-300 rounded mb-1 text-gray-800 text-sm" placeholder="Audio URL" required />
                      <input name="cover_image" value={editForm.cover_image} onChange={handleEditChange} className="w-full px-2 py-1 border border-gray-300 rounded mb-1 text-gray-800 text-sm" placeholder="Cover Image URL" />
                      <input name="published_at" type="datetime-local" value={editForm.published_at} onChange={handleEditChange} className="w-full px-2 py-1 border border-gray-300 rounded mb-1 text-gray-800 text-sm" required />
                    </div>
                    {editErrorMsg && <div className="text-red-500 text-xs mb-2">{editErrorMsg}</div>}
                    <div className="flex gap-2">
                      <button onClick={() => handleEditSave(podcast.id)} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center" disabled={editSubmitting}><Save size={14} className="mr-1" />Save</button>
                      <button onClick={handleEditCancel} className="px-2 py-1 text-xs bg-gray-300 text-gray-900 rounded hover:bg-gray-400 flex items-center"><X size={14} className="mr-1" />Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    {podcast.cover_image && (
                      <img
                        src={podcast.cover_image}
                        alt={podcast.title}
                        className="w-32 h-32 rounded-lg object-cover mb-3 border"
                      />
                    )}
                    <div className="font-semibold text-lg mb-1 text-gray-800 text-center">{podcast.title}</div>
                    <div className="text-gray-600 text-sm mb-1 text-center">Speaker: {podcast.speaker}</div>
                    {podcast.duration && (
                      <div className="text-gray-500 text-xs mb-1">Duration: {podcast.duration}</div>
                    )}
                    <div className="text-xs text-gray-400 mb-1">Published: {new Date(podcast.published_at).toLocaleDateString()}</div>
                    <div className="text-gray-700 text-sm mb-2 text-center line-clamp-3">{podcast.description}</div>
                    <audio controls className="w-full mb-2">
                      <source src={podcast.audio_url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleEdit(podcast)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition flex items-center" title="Edit podcast"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(podcast.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition flex items-center" title="Delete podcast"><Trash2 size={16} /></button>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
