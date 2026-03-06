import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, Button, Input } from '@/components';
import { ArrowLeft, Plus, Trash2, Edit2, Search } from 'lucide-react';

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: number;
  description: string;
}

export default function SermonsManagement() {
  const { isAuthenticated, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    date: '',
    duration: 0,
    description: '',
  });

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || userRole !== 'admin') {
      router.push('/auth/login');
      return;
    }

    // Load sermons from Supabase
    const loadSermons = async () => {
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          console.error('Error loading sermons:', error);
          // Fallback to default sermons if table doesn't exist
          const defaultSermons = [
            {
              id: '1',
              title: 'The Power of Faith',
              speaker: 'Pastor John Doe',
              date: '2024-03-05',
              duration: 45,
              description: 'A powerful message about faith and trust in God',
            },
            {
              id: '2',
              title: 'Living in Grace',
              speaker: 'Pastor Jane Smith',
              date: '2024-03-12',
              duration: 52,
              description: 'Understanding the grace of God in our daily lives',
            },
          ];
          setSermons(defaultSermons);
        } else {
          setSermons(data || []);
        }
      } catch (error) {
        console.error('Failed to load sermons:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSermons();
  }, [authLoading, isAuthenticated, userRole, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing sermon
        const { error } = await supabase
          .from('sermons')
          .update({
            title: formData.title,
            speaker: formData.speaker,
            date: formData.date,
            duration: formData.duration,
            description: formData.description,
          })
          .eq('id', editingId);

        if (error) throw error;

        // Update local state
        setSermons(sermons.map(s => s.id === editingId ? { ...formData, id: editingId } as Sermon : s));
        setEditingId(null);
      } else {
        // Create new sermon
        const { data, error } = await supabase
          .from('sermons')
          .insert([formData])
          .select();

        if (error) throw error;

        setSermons([...(data || []), ...sermons]);
      }

      setFormData({ title: '', speaker: '', date: '', duration: 0, description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving sermon:', error);
      alert('Failed to save sermon. Make sure Supabase migration is set up first.');
    }
  };

  const handleEdit = (sermon: Sermon) => {
    setFormData(sermon);
    setEditingId(sermon.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sermon?')) {
      try {
        const { error } = await supabase
          .from('sermons')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setSermons(sermons.filter(s => s.id !== id));
      } catch (error) {
        console.error('Error deleting sermon:', error);
        alert('Failed to delete sermon');
      }
    }
  };

  const filteredSermons = sermons.filter(sermon =>
    sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full animate-spin mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
          </div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userRole !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-4">
          <Link href="/admin">
            <button className="text-blue-600 hover:text-blue-700 transition">
              <ArrowLeft size={24} />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Sermon Management</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search sermons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700"
              />
            </div>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ title: '', speaker: '', date: '', duration: 0, description: '' });
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Add Sermon</span>
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              {editingId ? 'Edit Sermon' : 'Add New Sermon'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Sermon Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter sermon title"
                required
              />

              <Input
                label="Speaker Name"
                name="speaker"
                value={formData.speaker}
                onChange={handleInputChange}
                placeholder="Enter speaker name"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter sermon description"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700"
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingId ? 'Update Sermon' : 'Add Sermon'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ title: '', speaker: '', date: '', duration: 0, description: '' });
                  }}
                  className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Sermons List */}
        <div className="space-y-4">
          {filteredSermons.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-500">No sermons found</p>
            </Card>
          ) : (
            filteredSermons.map(sermon => (
              <Card key={sermon.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{sermon.title}</h3>
                    <p className="text-gray-600 text-sm mb-1">👤 {sermon.speaker}</p>
                    <p className="text-gray-600 text-sm mb-1">📅 {new Date(sermon.date).toLocaleDateString()}</p>
                    <p className="text-gray-600 text-sm mb-2">⏱️ {sermon.duration} minutes</p>
                    <p className="text-gray-700">{sermon.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(sermon)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(sermon.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
