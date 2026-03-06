import Link from 'next/link';
import { Card, Button } from '@/components';
import { BookOpen, Search, Calendar, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  status: string;
  featured_image: string | null;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'News', 'Events', 'Devotion', 'Ministry'];

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) {
          console.error('Error loading blog posts:', error);
        } else {
          setPosts(data || []);
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categoryLabel = (cat: string) => {
    if (cat === 'all') return 'All';
    return cat;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative text-white py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-blue-100">
            Stay updated with news, devotions, and stories from our community
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
                  placeholder="Search blog posts..."
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
                {categoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">Loading blog posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No blog posts found</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} hoverable>
                {post.featured_image ? (
                  <div className="aspect-video rounded-lg mb-4 overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                    <BookOpen size={48} className="text-white opacity-50" />
                  </div>
                )}
                <div className="mb-2">
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium capitalize">
                    {post.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                )}
                <div className="text-gray-500 text-xs mb-4 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <Button className="w-full font-bold">
                    <BookOpen size={18} className="inline mr-2" />
                    Read More
                  </Button>
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
