import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Card, Button, Input } from '@/components';
import { ArrowLeft, Plus, Trash2, Edit2, Search } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  attendees: number;
  description: string;
}

export default function EventsManagement() {
  const { isAuthenticated, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    capacity: 0,
    attendees: 0,
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

    // Load events from localStorage
    const loadEvents = () => {
      try {
        const saved = localStorage.getItem('events');
        if (saved) {
          setEvents(JSON.parse(saved));
        } else {
          const defaultEvents = [
            {
              id: '1',
              title: 'Sunday Service',
              date: '2024-03-10',
              time: '09:00',
              location: 'Main Sanctuary',
              capacity: 500,
              attendees: 320,
              description: 'Weekly Sunday morning service',
            },
            {
              id: '2',
              title: 'Youth Group Meeting',
              date: '2024-03-15',
              time: '18:00',
              location: 'Fellowship Hall',
              capacity: 100,
              attendees: 68,
              description: 'Monthly youth group gathering',
            },
          ];
          setEvents(defaultEvents);
          localStorage.setItem('events', JSON.stringify(defaultEvents));
        }
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [authLoading, isAuthenticated, userRole, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'attendees' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let updatedEvents: Event[];
    if (editingId) {
      updatedEvents = events.map(ev => ev.id === editingId ? { ...formData, id: editingId } as Event : ev);
      setEditingId(null);
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
      };
      updatedEvents = [newEvent, ...events];
    }

    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setFormData({ title: '', date: '', time: '', location: '', capacity: 0, attendees: 0, description: '' });
    setShowForm(false);
  };

  const handleEdit = (event: Event) => {
    setFormData(event);
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(e => e.id !== id);
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
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
                placeholder="Search events..."
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
              setFormData({ title: '', date: '', time: '', location: '', capacity: 0, attendees: 0, description: '' });
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Add Event</span>
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              {editingId ? 'Edit Event' : 'Add New Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
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
                  label="Time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter event location"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
                <Input
                  label="Current Attendees"
                  name="attendees"
                  type="number"
                  value={formData.attendees}
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
                  placeholder="Enter event description"
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
                  {editingId ? 'Update Event' : 'Add Event'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ title: '', date: '', time: '', location: '', capacity: 0, attendees: 0, description: '' });
                  }}
                  className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-500">No events found</p>
            </Card>
          ) : (
            filteredEvents.map(event => {
              const attendanceRate = Math.round((event.attendees / event.capacity) * 100);
              return (
                <Card key={event.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-1">📅 {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                      <p className="text-gray-600 text-sm mb-1">📍 {event.location}</p>
                      <p className="text-gray-600 text-sm mb-2">👥 {event.attendees}/{event.capacity} attendees ({attendanceRate}%)</p>
                      <p className="text-gray-700">{event.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
