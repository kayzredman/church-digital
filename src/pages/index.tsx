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
                  Support Our Ministry
                </Button>
              </Link>
              <Link href="/sermons">
                <Button
                  variant="secondary"
                  className="px-8 py-4 text-lg border-2 border-white bg-transparent text-white hover:bg-blue-700 font-bold shadow-lg"
                >
                  <Music size={22} className="inline mr-3" />
                  Explore Our Sermons
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Service Times</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <h3 className="text-xl font-bold mb-2">Sunday Morning</h3>
              <p className="text-gray-600 mb-2">9:00 AM - 11:00 AM</p>
              <p className="text-sm text-gray-500">Main Sanctuary</p>
            </Card>
            <Card className="text-center">
              <h3 className="text-xl font-bold mb-2">Sunday Evening</h3>
              <p className="text-gray-600 mb-2">5:00 PM - 6:30 PM</p>
              <p className="text-sm text-gray-500">Fellowship Hall</p>
            </Card>
            <Card className="text-center">
              <h3 className="text-xl font-bold mb-2">Wednesday Prayer</h3>
              <p className="text-gray-600 mb-2">7:00 PM - 8:00 PM</p>
              <p className="text-sm text-gray-500">Prayer Room</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Sermons */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Latest Sermons</h2>
            <Link href="/sermons">
              <Button variant="ghost">View All →</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} hoverable>
                <div className="aspect-video bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="font-bold text-lg mb-2">Sermon Title {i}</h3>
                <p className="text-gray-600 text-sm mb-4">Pastor John Doe</p>
                <Button variant="secondary" className="w-full">
                  Watch
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
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link href="/events">
              <Button variant="ghost">View All →</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="flex gap-6">
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg mb-2">Event {i}</h3>
                  <div className="flex items-center text-gray-600 mb-2 text-sm">
                    <Calendar size={16} className="mr-2" />
                    March {10 + i}, 2024 - 3:00 PM
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Join us for an amazing event with the community.
                  </p>
                  <Button size="sm">Register</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Support Our Ministry</h2>
          <p className="text-xl mb-8 text-blue-100">
            Your generous giving helps us serve and impact our community
          </p>
          <Link href="/give">
            <Button className="px-8 py-3 text-lg bg-white text-blue-600 hover:bg-gray-100">
              <Heart size={20} className="inline mr-2" />
              Give Now
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
