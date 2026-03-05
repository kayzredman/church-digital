import Link from 'next/link';
import { Card, Button } from '@/components';
import { Heart, Calendar, Music, Users, Zap } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to Elimcity Throneroom
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              A place to grow spiritual, connect with community, and serve others
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link href="/give">
                <Button className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-lg">
                  <Heart size={22} className="inline mr-3" />
                  Make a Donation
                </Button>
              </Link>
              <Link href="/sermons">
                <Button
                  variant="secondary"
                  className="px-8 py-4 text-lg border-2 border-white bg-transparent text-white hover:bg-blue-700 font-bold shadow-lg"
                >
                  <Music size={22} className="inline mr-3" />
                  Browse Sermons
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-600">Service Times</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition">
              <div className="flex justify-center mb-3">
                <Calendar size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-600">⛪ Sunday Morning</h3>
              <p className="text-gray-700 font-semibold mb-1">🕘 9:00 AM - 11:00 AM</p>
              <p className="text-gray-600 mb-4">📍 Main Sanctuary</p>
              <p className="text-sm text-gray-500 italic">Traditional worship with music & teaching</p>
            </Card>
            <Card className="text-center hover:shadow-lg transition">
              <div className="flex justify-center mb-3">
                <Users size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-600">🎉 Sunday Evening</h3>
              <p className="text-gray-700 font-semibold mb-1">🕔 5:00 PM - 6:30 PM</p>
              <p className="text-gray-600 mb-4">📍 Fellowship Hall</p>
              <p className="text-sm text-gray-500 italic">Contemporary worship & community fellowship</p>
            </Card>
            <Card className="text-center hover:shadow-lg transition">
              <div className="flex justify-center mb-3">
                <Zap size={32} className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-600">🙏 Wednesday Prayer</h3>
              <p className="text-gray-700 font-semibold mb-1">🕖 7:00 PM - 8:00 PM</p>
              <p className="text-gray-600 mb-4">📍 Prayer Room</p>
              <p className="text-sm text-gray-500 italic">Midweek prayer & spiritual renewal</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Sermons */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-600">Latest Sermons</h2>
            <Link href="/sermons">
              <Button variant="ghost" className="font-semibold">View All Sermons →</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} hoverable>
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Music size={48} className="text-gray-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Sermon Title {i}</h3>
                <p className="text-gray-600 text-sm mb-1 font-semibold">👤 Pastor John Doe</p>
                <p className="text-gray-500 text-xs mb-4">📅 March {5 + i}, 2024 • ⏱️ 45 minutes</p>
                <Button variant="secondary" className="w-full font-semibold">
                  <Music size={16} className="inline mr-2" />
                  Play Sermon
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-600">Upcoming Events</h2>
            <Link href="/events">
              <Button variant="ghost" className="font-semibold">View All Events →</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="flex gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <Calendar size={48} className="text-white opacity-30" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg mb-3">Event {i}</h3>
                  <div className="flex items-center text-gray-700 font-semibold mb-2 text-sm">
                    <Calendar size={16} className="mr-2 text-green-600" />
                    March {10 + i}, 2024 - 3:00 PM
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Join us for an amazing event with the community and grow in faith together.
                  </p>
                  <Button size="sm" className="font-semibold">
                    <Users size={16} className="inline mr-2" />
                    Register for Event
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-600">💝 Support Our Ministry</h2>
          <p className="text-xl mb-8 text-blue-100">
            Your generous giving helps us serve and impact our community with the love of Christ
          </p>
          <Link href="/give">
            <Button className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-lg">
              <Heart size={22} className="inline mr-3" />
              Give Now
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
