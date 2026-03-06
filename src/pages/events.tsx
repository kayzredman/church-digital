import Link from 'next/link';
import { Card, Button } from '@/components';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (error) {
          console.error('Error loading events:', error);
        } else {
          setEvents(data || []);
        }
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative text-white py-12 overflow-hidden">
        {/* Gradient Background with Transparency */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-green-600 to-green-900 opacity-90"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Church Events</h1>
          <p className="text-xl text-green-100">
            Join us for upcoming events and fellowship
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Calendar View Toggle */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-600">Upcoming Events</h2>
          <Button variant="secondary" className="font-bold py-2">
            <Calendar size={20} className="inline mr-2" />
            View Calendar View
          </Button>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No upcoming events</p>
            </div>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-48 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar size={64} className="text-white opacity-30" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-2 text-gray-600">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-700">
                      <Calendar size={18} className="mr-3 text-green-600" />
                      <span>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        {event.time && ` at ${event.time}`}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-gray-700">
                        <MapPin size={18} className="mr-3 text-green-600" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.capacity && (
                      <div className="flex items-center text-gray-700">
                        <Users size={18} className="mr-3 text-green-600" />
                        <span>Capacity: {event.capacity}</span>
                      </div>
                    )}
                  </div>

                  <Button>Register Now</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
