import Link from 'next/link';
import { Card, Button } from '@/components';
import { Music, Filter, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: number;
  description: string;
  category: string;
}

export default function SermonsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'Sunday Service', 'Midweek', 'Special'];

  useEffect(() => {
    const loadSermons = async () => {
      try {
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          console.error('Error loading sermons:', error);
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
  }, []);

  const filteredSermons = sermons.filter((s) => {
    const matchesSearch =
      !searchTerm ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative text-white py-12 overflow-hidden">
        {/* Gradient Background with Transparency */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 opacity-90"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Sermon Library</h1>
          <p className="text-xl text-blue-100">
            Listen to our latest sermons and teachings
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search sermons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Search size={20} className="absolute right-3 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sermons Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">Loading sermons...</p>
            </div>
          ) : filteredSermons.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">No sermons found</p>
            </div>
          ) : (
            filteredSermons.map((sermon) => (
              <Card key={sermon.id} hoverable>
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                  <Music size={48} className="text-white opacity-50" />
                </div>
                <h3 className="font-bold text-lg mb-1 text-gray-600">{sermon.title}</h3>
                <p className="text-gray-600 text-sm mb-2">Speaker: {sermon.speaker}</p>
                <div className="text-gray-500 text-xs mb-4">
                  <p className="font-medium">📅 {new Date(sermon.date).toLocaleDateString()}</p>
                  <p className="font-medium">⏱️ {sermon.duration} min</p>
                  {sermon.category && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">{sermon.category}</span>
                  )}
                </div>
                {sermon.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sermon.description}</p>
                )}
                <Button className="w-full font-bold">
                  <Music size={18} className="inline mr-2" />
                  Listen to Full Sermon
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
