
import React, { useState, useEffect } from 'react';
import { Card, Button } from '@/components';
import { Search, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type UserRole = 'admin' | 'editor' | 'contributor' | 'member' | 'visitor';
type UserStatus = 'active' | 'inactive';
interface User {
  id: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  totalDonations: number;
  joinDate: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<UserRole>('member');
  const [editingFirstName, setEditingFirstName] = useState('');
  const [editingLastName, setEditingLastName] = useState('');
  const [editingContactNumber, setEditingContactNumber] = useState('');
  const [editingEmail, setEditingEmail] = useState('');
  const [loading, setLoading] = useState(true);
  // Add user form state
  // Removed addName, use addFirstName/addLastName
  const [addFirstName, setAddFirstName] = useState('');
  const [addLastName, setAddLastName] = useState('');
  const [addContactNumber, setAddContactNumber] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState<UserRole>('member');
  const [addStatus, setAddStatus] = useState<UserStatus>('active');

  useEffect(() => {
    // Fetch users from Supabase
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        // Optionally handle error (show toast, etc.)
        setUsers([]);
      } else {
        // Map/normalize data if needed
        setUsers(
          (data || []).map((u: any) => ({
            id: u.id,
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            contactNumber: u.contactNumber || '',
            email: u.email || '',
            role: u.role || 'visitor',
            status: u.status || 'inactive',
            totalDonations: u.totalDonations || 0,
            joinDate: u.joinDate || u.created_at || '',
          }))
        );
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' ? true : user.role === roleFilter;
    return matchesSearch && matchesRole;
  });



  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditingFirstName(user.firstName);
    setEditingLastName(user.lastName);
    setEditingContactNumber(user.contactNumber);
    setEditingRole(user.role);
    setEditingEmail(user.email);
  };

  const handleEditSave = async (userId: string) => {
    const { error } = await supabase.from('users').update({
      firstName: editingFirstName,
      lastName: editingLastName,
      contactNumber: editingContactNumber,
      email: editingEmail,
      role: editingRole,
    }).eq('id', userId);
    if (!error) {
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, firstName: editingFirstName, lastName: editingLastName, contactNumber: editingContactNumber, email: editingEmail, role: editingRole } : u
      ));
      setEditingId(null);
    } else {
      alert('Failed to update user');
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setEditingRole(newRole);
  };

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    const { error } = await supabase.from('users').update({ status: newStatus }).eq('id', userId);
    if (!error) {
      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, status: newStatus } : u
        )
      );
    } else {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (userId: string) => {
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (!error) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    } else {
      alert('Failed to delete user');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFirstName || !addLastName || !addEmail) {
      alert('First name, last name, and email are required');
      return;
    }
    const { data, error } = await supabase.from('users').insert([
      {
        firstName: addFirstName,
        lastName: addLastName,
        contactNumber: addContactNumber,
        email: addEmail,
        role: addRole,
        status: addStatus,
      },
    ]).select();
    if (!error && data && data.length > 0) {
      setUsers(prev => [...prev, {
        id: data[0].id,
        firstName: addFirstName,
        lastName: addLastName,
        contactNumber: addContactNumber,
        email: addEmail,
        role: addRole,
        status: addStatus,
        totalDonations: 0,
        joinDate: data[0].created_at || '',
      }]);
      setAddFirstName('');
      setAddLastName('');
      setAddContactNumber('');
      setAddEmail('');
      setAddRole('member');
      setAddStatus('active');
    } else {
      alert('Failed to add user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
      {/* Dashboard Stats - Top Row */}
      <div className="flex flex-row gap-4 mb-8">
        <Card className="flex-1 text-center bg-linear-to-r from-gray-100 to-gray-300 border border-gray-200">
          <h3 className="text-base font-extrabold text-gray-800 mb-2">Total Users</h3>
          <p className="text-4xl font-black text-gray-900">{users.length}</p>
        </Card>
        <Card className="flex-1 text-center bg-linear-to-r from-purple-100 to-purple-200 border border-purple-200">
          <h3 className="text-base font-extrabold text-purple-800 mb-2">Admins</h3>
          <p className="text-4xl font-black text-purple-900">{users.filter(u => u.role === 'admin').length}</p>
        </Card>
        <Card className="flex-1 text-center bg-linear-to-r from-green-100 to-green-200 border border-green-200">
          <h3 className="text-base font-extrabold text-green-800 mb-2">Editors</h3>
          <p className="text-4xl font-black text-green-900">{users.filter(u => u.role === 'editor').length}</p>
        </Card>
        <Card className="flex-1 text-center bg-linear-to-r from-yellow-100 to-yellow-200 border border-yellow-200">
          <h3 className="text-base font-extrabold text-yellow-800 mb-2">Contributors</h3>
          <p className="text-4xl font-black text-yellow-900">{users.filter(u => u.role === 'contributor').length}</p>
        </Card>
        <Card className="flex-1 text-center bg-linear-to-r from-blue-100 to-blue-200 border border-blue-200">
          <h3 className="text-base font-extrabold text-blue-800 mb-2">Members</h3>
          <p className="text-4xl font-black text-blue-900">{users.filter(u => u.role === 'member').length}</p>
        </Card>
        <Card className="flex-1 text-center bg-linear-to-r from-gray-200 to-gray-400 border border-gray-300">
          <h3 className="text-base font-extrabold text-gray-800 mb-2">Visitors</h3>
          <p className="text-4xl font-black text-gray-900">{users.filter(u => u.role === 'visitor').length}</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700"
            />
          </div>
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="editor">Editors</option>
          <option value="contributor">Contributors</option>
          <option value="member">Members</option>
          <option value="visitor">Visitors</option>
        </select>
      </div>

      {/* Add User Form */}
      <Card className="mb-8 p-6">
        <form className="flex flex-col md:flex-row gap-4 items-end" onSubmit={handleAddUser}>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input type="text" value={addFirstName} onChange={e => setAddFirstName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600" required />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input type="text" value={addLastName} onChange={e => setAddLastName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600" required />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact No.</label>
            <input type="text" value={addContactNumber} onChange={e => setAddContactNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={addEmail} onChange={e => setAddEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select value={addRole} onChange={e => setAddRole(e.target.value as UserRole)} className="px-3 py-2 border border-gray-300 rounded-lg">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="contributor">Contributor</option>
              <option value="member">Member</option>
              <option value="visitor">Visitor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={addStatus} onChange={e => setAddStatus(e.target.value as UserStatus)} className="px-3 py-2 border border-gray-300 rounded-lg">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <Button type="submit" className="px-6 py-2">Add User</Button>
        </form>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-3 text-left text-sm font-extrabold text-gray-800 uppercase tracking-wider w-28">First Name</th>
                <th className="px-3 py-3 text-left text-sm font-extrabold text-gray-800 uppercase tracking-wider w-28">Last Name</th>
                <th className="px-3 py-3 text-left text-sm font-extrabold text-gray-800 uppercase tracking-wider w-32">Contact No.</th>
                <th className="px-3 py-3 text-left text-sm font-extrabold text-gray-800 uppercase tracking-wider w-44">Email</th>
                <th className="px-3 py-3 text-left text-sm font-extrabold text-gray-800 uppercase tracking-wider w-20">Role</th>
                <th className="px-3 py-3 text-left text-sm font-extrabold text-gray-800 uppercase tracking-wider w-20">Status</th>
                <th className="px-3 py-3 text-left text-sm font-extrabold text-gray-800 uppercase tracking-wider w-24">Total Donations</th>
                <th className="px-3 py-3 text-left text-sm font-extrabold text-gray-800 uppercase tracking-wider w-24">Joined</th>
                <th className="px-3 py-3 text-left text-sm font-extrabold text-gray-800 uppercase tracking-wider w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  {editingId === user.id ? (
                    <>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <input type="text" value={editingFirstName} onChange={e => setEditingFirstName(e.target.value)} placeholder="First Name" className="px-2 py-1 border border-gray-300 rounded w-full text-gray-600" />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <input type="text" value={editingLastName} onChange={e => setEditingLastName(e.target.value)} placeholder="Last Name" className="px-2 py-1 border border-gray-300 rounded w-full text-gray-600" />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                        <input type="text" value={editingContactNumber} onChange={e => setEditingContactNumber(e.target.value)} className="px-2 py-1 border border-gray-300 rounded w-full text-gray-600" />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                        <input type="email" value={editingEmail} onChange={e => setEditingEmail(e.target.value)} className="px-2 py-1 border border-gray-300 rounded w-full text-gray-600" />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        <select value={editingRole} onChange={e => setEditingRole(e.target.value as UserRole)} className="px-2 py-1 text-sm border border-gray-300 rounded">
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="contributor">Contributor</option>
                          <option value="member">Member</option>
                          <option value="visitor">Visitor</option>
                        </select>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        <select value={user.status} onChange={e => handleStatusChange(user.id, e.target.value as UserStatus)} className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">₦{user.totalDonations.toLocaleString()}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(user.joinDate).toLocaleDateString()}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button onClick={() => handleEditSave(user.id)} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                          <button onClick={() => setEditingId(null)} className="px-2 py-1 text-xs bg-gray-300 text-gray-900 rounded hover:bg-gray-400">Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-4 whitespace-nowrap text-base font-bold text-gray-900">{user.firstName}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-base font-bold text-gray-900">{user.lastName}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-base text-gray-800">{user.contactNumber}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-base text-blue-900">{user.email}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800'
                          : user.role === 'editor' ? 'bg-green-100 text-green-800'
                          : user.role === 'contributor' ? 'bg-yellow-100 text-yellow-800'
                          : user.role === 'member' ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        <select value={user.status} onChange={e => handleStatusChange(user.id, e.target.value as UserStatus)} className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-base text-green-900 font-semibold">₦{user.totalDonations.toLocaleString()}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-base text-gray-800">{new Date(user.joinDate).toLocaleDateString()}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                            title="Edit user"
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
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
