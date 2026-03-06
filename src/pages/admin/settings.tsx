// ...existing imports and component definition...
// ...inside Settings component, after Church Information card...
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Card, Button, Input } from '@/components';
import { ArrowLeft, Save } from 'lucide-react';

interface Settings {
  churchName: string;
  churchEmail: string;
  churchPhone: string;
  churchAddress: string;
  apiKeyStripe: string;
  apiKeyPaystack: string;
  apiKeyCloudinary: string;
  emailFromAddress: string;
  adminNotificationEmail: string;
  enableDonations: boolean;
  enableEvents: boolean;
  enableBlog: boolean;
  maintenanceMode: boolean;
  serviceTimes: Array<{
    day: string;
    name: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
  }>;
}

export default function Settings() {
  const { isAuthenticated, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    churchName: 'Elimcity Throneroom',
    churchEmail: 'contact@elimcitythroneroom.com',
    churchPhone: '+234 XXX XXX XXXX',
    churchAddress: '123 Faith Street, Lagos, Nigeria',
    apiKeyStripe: '',
    apiKeyPaystack: '',
    apiKeyCloudinary: '',
    emailFromAddress: 'noreply@elimcitythroneroom.com',
    adminNotificationEmail: 'admin@elimcitythroneroom.com',
    enableDonations: true,
    enableEvents: true,
    enableBlog: true,
    maintenanceMode: false,
    serviceTimes: [
      {
        day: 'Sunday',
        name: 'Sunday Morning',
        startTime: '9:00 AM',
        endTime: '11:00 AM',
        location: 'Main Sanctuary',
        description: 'Traditional worship with music & teaching',
      },
      {
        day: 'Sunday',
        name: 'Sunday Evening',
        startTime: '5:00 PM',
        endTime: '6:30 PM',
        location: 'Fellowship Hall',
        description: 'Contemporary worship & community fellowship',
      },
      {
        day: 'Wednesday',
        name: 'Wednesday Prayer',
        startTime: '7:00 PM',
        endTime: '8:00 PM',
        location: 'Prayer Room',
        description: 'Midweek prayer & spiritual renewal',
      },
    ],
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [loading, setLoading] = useState(true); // loading not used

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || userRole !== 'admin') {
      router.push('/auth/login');
      return;
    }
    // Fetch settings from API
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.data) setSettings((prev) => ({ ...prev, ...res.data }));
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, [authLoading, isAuthenticated, userRole, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith('serviceTimes')) {
      const [, idx, field] = name.split('.');
      setSettings(prev => {
        const updated = [...prev.serviceTimes];
        if (["day", "name", "startTime", "endTime", "location", "description"].includes(field)) {
          updated[Number(idx)][field] = value;
        }
        return { ...prev, serviceTimes: updated };
      });
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    }
    setSaved(false);
  };

  const validateSettings = () => {
    // Validate Church Info
    if (!settings.churchName || !settings.churchEmail || !settings.churchAddress) {
      return 'Please fill in all required Church Information fields.';
    }
    // Validate Service Times
    for (const [i, s] of settings.serviceTimes.entries()) {
      if (!s.day || !s.name || !s.startTime || !s.endTime || !s.location || !s.description) {
        return `Please fill in all fields for Service Time #${i + 1}.`;
      }
    }
    // Validate Email Config
    if (!settings.emailFromAddress || !settings.adminNotificationEmail) {
      return 'Please fill in all required Email Configuration fields.';
    }
    return null;
  };

  const handleSaveSettings = async () => {
    setError(null);
    const validationError = validateSettings();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      await api.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setError('Failed to save settings.');
      console.error('Failed to save settings:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-r from-blue-600 to-blue-800">
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ...existing cards for Church Info and API Keys... */}
        {/* Service Times Section */}
        <Card className="mt-8 p-6 w-full">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Service Times</h2>
          <div className="space-y-4">
            {settings.serviceTimes.map((service, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-4 items-center">
                <Input
                  label="Day"
                  name={`serviceTimes.${idx}.day`}
                  value={service.day}
                  onChange={handleInputChange}
                  placeholder="Day (e.g. Sunday)"
                  className="text-gray-700"
                  required
                />
                <Input
                  label="Service Name"
                  name={`serviceTimes.${idx}.name`}
                  value={service.name}
                  onChange={handleInputChange}
                  placeholder="Service Name (e.g. Sunday Morning)"
                  className="text-gray-700"
                  required
                />
                <Input
                  label="Start Time"
                  name={`serviceTimes.${idx}.startTime`}
                  value={service.startTime}
                  onChange={handleInputChange}
                  placeholder="Start Time (e.g. 9:00 AM)"
                  className="text-gray-700"
                  required
                />
                <Input
                  label="End Time"
                  name={`serviceTimes.${idx}.endTime`}
                  value={service.endTime}
                  onChange={handleInputChange}
                  placeholder="End Time (e.g. 11:00 AM)"
                  className="text-gray-700"
                  required
                />
                <Input
                  label="Location"
                  name={`serviceTimes.${idx}.location`}
                  value={service.location}
                  onChange={handleInputChange}
                  placeholder="Location (e.g. Main Sanctuary)"
                  className="text-gray-700"
                  required
                />
                <Input
                  label="Description"
                  name={`serviceTimes.${idx}.description`}
                  value={service.description}
                  onChange={handleInputChange}
                  placeholder="Description (e.g. Traditional worship with music & teaching)"
                  className="text-gray-700"
                  required
                />
                <Button
                  className="ml-2"
                  variant="danger"
                  onClick={() => {
                    setSettings(prev => {
                      const updated = [...prev.serviceTimes];
                      updated.splice(idx, 1);
                      return { ...prev, serviceTimes: updated };
                    });
                    setSaved(false);
                  }}
                >Remove</Button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Button
              variant="primary"
              onClick={() => {
                setSettings(prev => ({
                  ...prev,
                  serviceTimes: [
                    ...prev.serviceTimes,
                    {
                      day: '',
                      name: '',
                      startTime: '',
                      endTime: '',
                      location: '',
                      description: '',
                    },
                  ],
                }));
                setSaved(false);
              }}
            >Add Service Time</Button>
          </div>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {/* Success Message */}
        {saved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✓ Settings saved successfully!
          </div>
        )}

        {/* Church Information */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Church Information</h2>
          <div className="space-y-4">
            <Input
              label="Church Name"
              name="churchName"
              value={settings.churchName}
              onChange={handleInputChange}
              placeholder="Church name"
              className="text-gray-700"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Church Email"
                name="churchEmail"
                type="email"
                value={settings.churchEmail}
                onChange={handleInputChange}
                placeholder="contact@church.com"
                className="text-gray-700"
                required
              />
              <Input
                label="Church Phone"
                name="churchPhone"
                value={settings.churchPhone}
                onChange={handleInputChange}
                placeholder="+234 XXX XXX XXXX"
                className="text-gray-700"
              />
            </div>

            <Input
              label="Church Address"
              name="churchAddress"
              value={settings.churchAddress}
              onChange={handleInputChange}
              placeholder="Church physical address"
              className="text-gray-700"
            />
          </div>
        </Card>

        {/* API Keys & Integration */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900">API Keys & Integrations</h2>
          <div className="space-y-4 bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Important:</strong> Keep API keys confidential. Never share them publicly or commit to version control.
            </p>
          </div>
          <div className="space-y-4">
            <Input
              label="Stripe API Key"
              name="apiKeyStripe"
              type="password"
              value={settings.apiKeyStripe}
              onChange={handleInputChange}
              placeholder="sk_live_..."
              className="text-gray-700"
            />

            <Input
              label="Paystack API Key"
              name="apiKeyPaystack"
              type="password"
              value={settings.apiKeyPaystack}
              onChange={handleInputChange}
              placeholder="sk_live_..."
              className="text-gray-700"
            />

            <Input
              label="Cloudinary API Key"
              name="apiKeyCloudinary"
              type="password"
              value={settings.apiKeyCloudinary}
              onChange={handleInputChange}
              placeholder="Your Cloudinary API key"
              className="text-gray-700"
            />
          </div>
        </Card>

        {/* Email Configuration */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Email Configuration</h2>
          <div className="space-y-4">
            <Input
              label="From Email Address"
              name="emailFromAddress"
              type="email"
              value={settings.emailFromAddress}
              onChange={handleInputChange}
              placeholder="noreply@church.com"
              className="text-gray-700"
              required
            />

            <Input
              label="Admin Notification Email"
              name="adminNotificationEmail"
              type="email"
              value={settings.adminNotificationEmail}
              onChange={handleInputChange}
              placeholder="admin@church.com"
              className="text-gray-700"
              required
            />
          </div>
        </Card>

        {/* Feature Toggles */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Feature Toggles</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableDonations"
                name="enableDonations"
                checked={settings.enableDonations}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="enableDonations" className="text-sm font-medium text-gray-700">
                Enable Donations Module
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableEvents"
                name="enableEvents"
                checked={settings.enableEvents}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="enableEvents" className="text-sm font-medium text-gray-700">
                Enable Events Module
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableBlog"
                name="enableBlog"
                checked={settings.enableBlog}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="enableBlog" className="text-sm font-medium text-gray-700">
                Enable Blog Module
              </label>
            </div>

            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">
                Maintenance Mode (Show &quot;Website Under Maintenance&quot; page)
              </label>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={handleSaveSettings}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
            disabled={false}
          >
            <Save size={18} />
            <span>Save Settings</span>
          </Button>
          <Link href="/admin">
            <Button className="bg-gray-300 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-400 transition">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Danger Zone */}
        <Card className="mt-8 p-6 border-2 border-red-200 bg-red-50">
          <h2 className="text-xl font-bold mb-4 text-red-900">Danger Zone</h2>
          <p className="text-sm text-red-700 mb-4">
            These actions are irreversible. Proceed with extreme caution.
          </p>
          <div className="space-y-2">
            <Button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition w-full">
              Reset All Data
            </Button>
            <Button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition w-full">
              Clear Database Cache
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
