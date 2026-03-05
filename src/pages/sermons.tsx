import Link from 'next/link';
import { Card, Button } from '@/components';
import { Music, Filter, Search } from 'lucide-react';
import { useState } from 'react';

export default function SermonsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Sunday Service', 'Midweek', 'Special'];
  const sermons = Array(12)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      title: `Sermon ${i + 1}`,
      speaker: 'Pastor John Doe',
      category: categories[i % categories.length],
      date: new Date(2024, 2, 10 + i).toLocaleDateString(),
      duration: '45:00',
      views: Math.floor(Math.random() * 1000),
    }));

  const filteredSermons =
    selectedCategory === 'all'
      ? sermons
      : sermons.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          {filteredSermons.map((sermon) => (
            <Card key={sermon.id} hoverable>
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                <Music size={48} className="text-white opacity-50" />
              </div>
              <h3 className="font-bold text-lg mb-1 text-gray-600">{sermon.title}</h3>
              <p className="text-gray-600 text-sm mb-2">Speaker: {sermon.speaker}</p>
              <div className="text-gray-500 text-xs mb-4">
                <p className="font-medium">📅 {sermon.date}</p>
                <p className="font-medium">⏱️ {sermon.duration}</p>
                <p className="font-medium">👁️ {sermon.views} views</p>
              </div>
              <Button className="w-full font-bold">
                <Music size={18} className="inline mr-2" />
                Listen to Full Sermon
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
