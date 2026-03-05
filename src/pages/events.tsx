import Link from 'next/link';
import { Card, Button } from '@/components';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useState } from 'react';

export default function EventsPage() {
  const events = Array(6)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      title: `Event ${i + 1}`,
      description: 'Join us for an amazing event with the community.',
      date: new Date(2024, 2, 15 + i * 2),
      location: 'Main Sanctuary',
      capacity: 500,
      registered: Math.floor(Math.random() * 400),
      image: '',
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <Button variant="secondary">Calendar View</Button>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-48 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={64} className="text-white opacity-30" />
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Calendar size={18} className="mr-3 text-green-600" />
                    <span>
                      {event.date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {' at '}
                      {event.date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin size={18} className="mr-3 text-green-600" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users size={18} className="mr-3 text-green-600" />
                    <span>
                      {event.registered} / {event.capacity} Registered
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(event.registered / event.capacity) * 100}%`,
                    }}
                  ></div>
                </div>

                <Button>Register Now</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
