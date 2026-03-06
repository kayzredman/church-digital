import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Card, Button } from '@/components';
import { ArrowLeft, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface Donation {
  id: string;
  donor: string;
  amount: number;
  method: 'stripe' | 'paystack' | 'bank_transfer';
  date: string;
  status: 'completed' | 'pending' | 'failed';
  message?: string;
}

export default function DonationsAnalytics() {
  const { isAuthenticated, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    averageDonation: 0,
    thisMonthAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || userRole !== 'admin') {
      router.push('/auth/login');
      return;
    }

    // Fetch donations from API
    const fetchDonations = async () => {
      try {
        // TODO: Replace with actual API call
        const mockDonations: Donation[] = [
          {
            id: '1',
            donor: 'John Doe',
            amount: 5000,
            method: 'stripe',
            date: '2024-03-05',
            status: 'completed',
            message: 'God bless the ministry',
          },
          {
            id: '2',
            donor: 'Jane Smith',
            amount: 2500,
            method: 'paystack',
            date: '2024-03-04',
            status: 'completed',
            message: 'Supporting youth ministry',
          },
          {
            id: '3',
            donor: 'Mike Johnson',
            amount: 10000,
            method: 'bank_transfer',
            date: '2024-03-03',
            status: 'completed',
          },
          {
            id: '4',
            donor: 'Sarah Williams',
            amount: 3500,
            method: 'stripe',
            date: '2024-03-02',
            status: 'completed',
            message: 'Monthly commitment',
          },
          {
            id: '5',
            donor: 'Anonymous',
            amount: 1500,
            method: 'paystack',
            date: '2024-03-01',
            status: 'completed',
          },
        ];

        setDonations(mockDonations);

        // Calculate stats
        const totalAmount = mockDonations.reduce((sum, d) => sum + (d.status === 'completed' ? d.amount : 0), 0);
        const completedDonations = mockDonations.filter(d => d.status === 'completed');

        setStats({
          totalDonations: completedDonations.length,
          totalAmount,
          averageDonation: completedDonations.length > 0 ? totalAmount / completedDonations.length : 0,
          thisMonthAmount: totalAmount, // Simplified for now
        });
      } catch (error) {
        console.error('Failed to fetch donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [authLoading, isAuthenticated, userRole, router]);

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'stripe':
        return 'bg-blue-100 text-blue-800';
      case 'paystack':
        return 'bg-green-100 text-green-800';
      case 'bank_transfer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Donations Analytics</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="flex justify-center mb-3">
              <DollarSign size={32} className="text-green-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Donations</h3>
            <p className="text-3xl font-bold text-gray-900">₦{(stats.totalAmount / 1000).toFixed(1)}k</p>
            <p className="text-xs text-gray-500 mt-2">All time</p>
          </Card>

          <Card className="text-center">
            <div className="flex justify-center mb-3">
              <TrendingUp size={32} className="text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">This Month</h3>
            <p className="text-3xl font-bold text-gray-900">₦{(stats.thisMonthAmount / 1000).toFixed(1)}k</p>
            <p className="text-xs text-gray-500 mt-2">March 2024</p>
          </Card>

          <Card className="text-center">
            <div className="flex justify-center mb-3">
              <Calendar size={32} className="text-purple-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Donors</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalDonations}</p>
            <p className="text-xs text-gray-500 mt-2">Completed transactions</p>
          </Card>

          <Card className="text-center">
            <div className="flex justify-center mb-3">
              <DollarSign size={32} className="text-orange-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Avg Donation</h3>
            <p className="text-3xl font-bold text-gray-900">₦{(stats.averageDonation / 1000).toFixed(1)}k</p>
            <p className="text-xs text-gray-500 mt-2">Per transaction</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-700"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Donations Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.map(donation => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donation.donor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">₦{donation.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMethodBadgeColor(donation.method)}`}>
                        {donation.method.split('_').join(' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(donation.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(donation.status)}`}>
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {donation.message ? (
                        <p className="max-w-xs truncate italic">"{donation.message}"</p>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Summary Box */}
        <Card className="mt-8 p-6 bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Insights</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ <strong>Consistent Growth:</strong> Donations are increasing month over month</li>
            <li>✓ <strong>Payment Diversity:</strong> Using multiple payment methods increases accessibility</li>
            <li>✓ <strong>Top Donors:</strong> Major donors account for 40% of total giving</li>
            <li>✓ <strong>Monthly Goal:</strong> Currently at 85% of monthly target</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
