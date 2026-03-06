import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Card, Button } from '@/components';
import { BarChart, Users, Music, Calendar, DollarSign, Settings, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { isAuthenticated, user, userRole, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalSermons: 0,
    totalEvents: 0,
    totalDonations: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading before checking permissions
    if (authLoading) {
      return;
    }

    // Redirect if not authenticated or not admin
    if (!isAuthenticated || userRole !== 'admin') {
      router.push('/auth/login');
      return;
    }

    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // TODO: Fetch from API
        setStats({
          totalSermons: 12,
          totalEvents: 8,
          totalDonations: 15000,
          totalUsers: 245,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authLoading, isAuthenticated, userRole, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Show loading state while auth is initializing
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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-blue-800">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome, {user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <Music size={32} className="mx-auto mb-3 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Sermons</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalSermons}</p>
          </Card>

          <Card className="text-center">
            <Calendar size={32} className="mx-auto mb-3 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Events</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
          </Card>

          <Card className="text-center">
            <DollarSign size={32} className="mx-auto mb-3 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Donations</h3>
            <p className="text-3xl font-bold text-gray-900">${(stats.totalDonations / 1000).toFixed(1)}k</p>
          </Card>

          <Card className="text-center">
            <Users size={32} className="mx-auto mb-3 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </Card>
        </div>

        {/* Admin Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/sermons">
            <Card className="cursor-pointer hover:shadow-lg transition h-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Music size={32} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Sermon Management</h3>
                  <p className="text-gray-600 text-sm">Add, edit, and manage sermons</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/events">
            <Card className="cursor-pointer hover:shadow-lg transition h-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar size={32} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Event Management</h3>
                  <p className="text-gray-600 text-sm">Create and manage events</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/blog">
            <Card className="cursor-pointer hover:shadow-lg transition h-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart size={32} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Blog Management</h3>
                  <p className="text-gray-600 text-sm">Write and publish blog posts</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/giving">
            <Card className="cursor-pointer hover:shadow-lg transition h-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <DollarSign size={32} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Donations Analytics</h3>
                  <p className="text-gray-600 text-sm">View donations and reports</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="cursor-pointer hover:shadow-lg transition h-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Users size={32} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <p className="text-gray-600 text-sm">Manage users and roles</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/admin/settings">
            <Card className="cursor-pointer hover:shadow-lg transition h-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Settings size={32} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                  <p className="text-gray-600 text-sm">Configure admin preferences</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
