import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, Button, Input } from '@/components';
import { ArrowLeft, Plus, Trash2, Edit2, Search } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  content: string;
  published: boolean;
}

export default function BlogManagement() {
  const { isAuthenticated, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    date: '',
    category: 'news',
    content: '',
    published: false,
  });

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || userRole !== 'admin') {
      router.push('/auth/login');
      return;
    }

    // Load blog posts from Supabase
    const loadPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading blog posts:', error);
          // Fallback to default posts if table doesn't exist
          const defaultPosts = [
            {
              id: '1',
              title: 'Welcome to Our New Website',
              author: 'Admin',
              date: '2024-03-05',
              category: 'news',
              content: 'We are excited to launch our new website showcasing our church community...',
              published: true,
            },
            {
              id: '2',
              title: 'Join Us for Easter Celebration',
              author: 'Pastor John',
              date: '2024-03-10',
              category: 'events',
              content: 'This Easter, join us for a special celebration of the resurrection...',
              published: true,
            },
          ];
          setPosts(defaultPosts);
        } else {
          // Map DB rows to BlogPost interface
          setPosts((data || []).map((p: any) => ({
            id: p.id,
            title: p.title,
            author: p.donor_name || 'Admin', // We store author as donor_name or use default
            date: p.published_at || p.created_at?.split('T')[0] || '',
            category: p.category || 'news',
            content: p.content || '',
            published: p.status === 'published',
          })));
        }
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [authLoading, isAuthenticated, userRole, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const dbData = {
        title: formData.title,
        slug: editingId ? undefined : slug, // Only set slug on create
        content: formData.content,
        excerpt: formData.content.substring(0, 150),
        category: formData.category,
        status: formData.published ? 'published' : 'draft',
        published_at: formData.published ? (formData.date || new Date().toISOString()) : null,
      };

      if (editingId) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(dbData)
          .eq('id', editingId);

        if (error) throw error;

        setPosts(posts.map(p => p.id === editingId ? { ...formData, id: editingId } as BlogPost : p));
        setEditingId(null);
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([{ ...dbData, slug }])
          .select();

        if (error) throw error;

        const newPost = data?.[0];
        if (newPost) {
          setPosts([{
            id: newPost.id,
            title: newPost.title,
            author: formData.author || 'Admin',
            date: newPost.published_at || newPost.created_at?.split('T')[0] || '',
            category: newPost.category || 'news',
            content: newPost.content || '',
            published: newPost.status === 'published',
          }, ...posts]);
        }
      }

      setFormData({ title: '', author: '', date: '', category: 'news', content: '', published: false });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Failed to save blog post. Please try again.');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData(post);
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setPosts(posts.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Failed to delete blog post');
      }
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
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
                placeholder="Search posts..."
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
              setFormData({ title: '', author: '', date: '', category: 'news', content: '', published: false });
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Write Post</span>
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8 p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              {editingId ? 'Edit Post' : 'Write New Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Post Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Author name"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700"
                  >
                    <option value="news">News</option>
                    <option value="events">Events</option>
                    <option value="devotion">Devotion</option>
                    <option value="ministry">Ministry</option>
                  </select>
                </div>
              </div>

              <Input
                label="Post Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your blog post content here..."
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingId ? 'Update Post' : 'Publish Post'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ title: '', author: '', date: '', category: 'news', content: '', published: false });
                  }}
                  className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-500">No posts found</p>
            </Card>
          ) : (
            filteredPosts.map(post => (
              <Card key={post.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                      {post.published ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Published</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Draft</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-1">✍️ By {post.author}</p>
                    <p className="text-gray-600 text-sm mb-1">📅 {new Date(post.date).toLocaleDateString()}</p>
                    <p className="text-gray-600 text-sm mb-2">📁 {post.category}</p>
                    <p className="text-gray-700 line-clamp-2">{post.content}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
