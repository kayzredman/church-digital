import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Card, Button, Input } from '@/components';
import { ArrowLeft, Trash2, Edit2, Search } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  joinDate: string;
  status: 'active' | 'inactive';
  totalDonations: number;
}

export default function UserManagement() {
  const { isAuthenticated, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || userRole !== 'admin') {
      router.push('/auth/login');
      return;
    }

    // Fetch users from API
    const fetchUsers = async () => {
      try {
        // TODO: Replace with actual API call
        setUsers([
          {
            id: '1',
            email: 'john@example.com',
            name: 'John Doe',
            role: 'admin',
            joinDate: '2024-01-15',
            status: 'active',
            totalDonations: 50000,
          },
          {
            id: '2',
            email: 'jane@example.com',
            name: 'Jane Smith',
            role: 'user',
            joinDate: '2024-02-10',
            status: 'active',
            totalDonations: 15000,
          },
          {
            id: '3',
            email: 'mike@example.com',
            name: 'Mike Johnson',
            role: 'user',
            joinDate: '2024-02-20',
            status: 'active',
            totalDonations: 8000,
          },
          {
            id: '4',
            email: 'sarah@example.com',
            name: 'Sarah Williams',
            role: 'user',
            joinDate: '2024-03-01',
            status: 'active',
            totalDonations: 0,
          },
          {
            id: '5',
            email: 'mark@example.com',
            name: 'Mark Brown',
            role: 'user',
            joinDate: '2024-03-05',
            status: 'inactive',
            totalDonations: 5000,
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authLoading, isAuthenticated, userRole, router]);

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    // TODO: Call API to update user role
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setEditingId(null);
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive') => {
    // TODO: Call API to update user status
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      // TODO: Call API to delete user
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700"
              />
            </div>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
        </div>

        {/* Users Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Donations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editingId === user.id ? (
                        <div className="flex gap-2">
                          <select
                            value={editingRole}
                            onChange={(e) => setEditingRole(e.target.value as 'user' | 'admin')}
                            className="px-2 py-1 text-sm border border-gray-300 rounded"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleRoleChange(user.id, editingRole)}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 text-xs bg-gray-300 text-gray-900 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value as 'active' | 'inactive')}
                        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ₦{user.totalDonations.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(user.id);
                            setEditingRole(user.role);
                          }}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="Edit role"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="text-center">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          </Card>
          <Card className="text-center">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Admin Users</h3>
            <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
          </Card>
          <Card className="text-center">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
