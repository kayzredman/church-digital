import Link from 'next/link';
import { Card, Button } from '@/components';
import { Heart, Calendar, Music, Users, Zap, Facebook, Instagram, Twitter, Youtube, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}
export default function Home() {
  const [latestSermons, setLatestSermons] = useState<Sermon[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [serviceTimes, setServiceTimes] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [sermonsRes, eventsRes, settingsRes, blogRes] = await Promise.all([
        supabase.from('sermons').select('*').order('date', { ascending: false }).limit(3),
        supabase.from('events').select('*').order('date', { ascending: true }).limit(2),
        api.getSettings(),
        supabase.from('blog_posts').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(3),
      ]);
      if (sermonsRes.data) setLatestSermons(sermonsRes.data);
      if (eventsRes.data) setUpcomingEvents(eventsRes.data);
      if (settingsRes.data && settingsRes.data.serviceTimes) setServiceTimes(settingsRes.data.serviceTimes);
      if (blogRes.data) setBlogPosts(blogRes.data);
    };
    loadData();
  }, []);

  return (
    <>
      {/* 1. Hero Banner */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-linear-to-br from-blue-400 via-blue-600 to-blue-900">
        <div className="absolute inset-0 bg-linear-to-br from-blue-400 via-blue-600 to-blue-900 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to Elimcity Throneroom
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              A place to grow spiritual, connect with community, and serve others
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link href="/give">
                <Button variant="ghost" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-lg">
                  <Heart size={22} className="inline mr-3" />
                  Make a Donation
                </Button>
              </Link>
              <Link href="/sermons">
                <Button
                  variant="ghost"
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
      {/* 2. Latest Sermons */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-600">Latest Sermons</h2>
            <Link href="/sermons">
              <Button variant="ghost" className="font-semibold">View All Sermons →</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {latestSermons.length > 0 ? (
              latestSermons.map((sermon) => (
                <Card key={sermon.id} hoverable>
                  <div className="aspect-video bg-linear-to-br from-blue-200 to-blue-400 rounded-lg mb-4 flex items-center justify-center">
                    <Music size={40} className="text-blue-600 opacity-60" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{sermon.title}</h3>
                  <p className="text-gray-600 text-sm mb-1 font-semibold">{sermon.speaker}</p>
                  <p className="text-gray-500 text-xs mb-4">{sermon.date ? new Date(sermon.date).toLocaleDateString() : ''}</p>
                  <Link href={`/sermons`}>
                    <Button variant="primary" className="w-full font-semibold">Listen</Button>
                  </Link>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No sermons yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Upcoming Events */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-600">Upcoming Events</h2>
            <Link href="/events">
              <Button variant="ghost" className="font-semibold">View All Events →</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <Card key={event.id} className="flex gap-6">
                  <div className="w-32 h-32 bg-linear-to-br from-green-400 to-green-600 rounded-lg shrink-0 flex items-center justify-center">
                    <Calendar size={48} className="text-white opacity-30" />
                  </div>
                  <div className="grow">
                    <h3 className="font-bold text-lg mb-3">{event.title}</h3>
                    <div className="flex items-center text-gray-700 font-semibold mb-2 text-sm">
                      <Calendar size={16} className="mr-2 text-green-600" />
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      {event.time && ` - ${event.time}`}
                    </div>
                    {event.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    )}
                    <Button size="sm" className="font-semibold">
                      <Users size={16} className="inline mr-2" />
                      Register for Event
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500">No upcoming events. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>


            {/* 4. Latest Podcast Episode (placeholder) */}
            <section className="bg-gray-50 py-16">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-600 mb-8">Latest Podcast Episode</h2>
                <Card hoverable className="mb-8">
                  <div className="aspect-video bg-linear-to-br from-blue-200 to-blue-400 rounded-lg mb-4 flex items-center justify-center">
                    <Music size={48} className="text-blue-600 opacity-60" />
                  </div>
                  <h3 className="font-bold text-2xl mb-2">No podcast episodes yet</h3>
                  <p className="text-gray-600 text-base mb-1 font-semibold">Stay tuned for our upcoming podcast series!</p>
                  <Button variant="primary" className="w-full font-semibold" disabled>
                    <Music size={16} className="inline mr-2" />
                    Listen Now
                  </Button>
                </Card>
              </div>
            </section>

            {/* 5. From the Blog */}
            <section className="bg-gray-50 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-600">From the Blog</h2>
                  <Link href="/blog">
                    <Button variant="ghost" className="font-semibold">View All Blog Posts →</Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {blogPosts.length > 0 ? (
                    blogPosts.map((post) => (
                      <Card key={post.id} hoverable>
                        <div className="aspect-video bg-linear-to-br from-blue-200 to-blue-400 rounded-lg mb-4 flex items-center justify-center">
                          <BookOpen size={40} className="text-blue-600 opacity-60" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm mb-1 font-semibold">{post.category}</p>
                        <p className="text-gray-500 text-xs mb-4">{post.published_at ? new Date(post.published_at).toLocaleDateString() : ''}</p>
                        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{post.excerpt || post.content?.slice(0, 120) + '...'}</p>
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="primary" className="w-full font-semibold">Read More</Button>
                        </Link>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8">
                      <p className="text-gray-500">No blog posts yet. Check back soon!</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 6. Watch Live */}
            <section className="bg-white py-16">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-600">Watch Live</h2>
                <p className="text-lg mb-8 text-gray-700">Join our live services and events online.</p>
                {/* Replace the src with your actual live stream URL or embed code */}
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg border mb-6">
                  <iframe
                    title="Elimcity Live Stream"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src="https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID"
                  ></iframe>
                </div>
                <Link href="/live-streams">
                  <Button variant="primary" className="font-semibold">Go to Live Stream</Button>
                </Link>
              </div>
            </section>

            {/* 7. Follow Us */}
            <section className="bg-gray-100 py-12">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-600">Follow Us</h2>
                <div className="flex justify-center space-x-6 mb-4">
                  <a href="#" className="text-blue-600 hover:text-blue-800" aria-label="Facebook"><Facebook size={32} /></a>
                  <a href="#" className="text-pink-500 hover:text-pink-700" aria-label="Instagram"><Instagram size={32} /></a>
                  <a href="#" className="text-blue-400 hover:text-blue-600" aria-label="Twitter"><Twitter size={32} /></a>
                  <a href="#" className="text-red-600 hover:text-red-800" aria-label="YouTube"><Youtube size={32} /></a>
                </div>
                <p className="text-gray-600">Stay connected with us on social media for updates, inspiration, and community.</p>
              </div>
            </section>


          </>
        );
}
