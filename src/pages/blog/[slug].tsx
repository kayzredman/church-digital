import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components';
import { ArrowLeft, Calendar, BookOpen } from 'lucide-react';
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

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (error) {
          console.error('Error loading blog post:', error);
        } else {
          setPost(data);
        }
      } catch (error) {
        console.error('Failed to load blog post:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft size={18} className="inline mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 opacity-90"></div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition">
            <ArrowLeft size={18} className="mr-2" />
            Back to Blog
          </Link>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium capitalize mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-blue-100 text-sm">
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {post.featured_image && (
          <div className="rounded-lg overflow-hidden mb-8">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <article className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </article>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/blog">
            <Button>
              <ArrowLeft size={18} className="inline mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
