import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Textarea } from '@/components';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks';
import { apiClient } from '@/lib/api';
import { getSupabaseClient } from '@/lib/supabase';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Settings state
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiClient.get('/settings');
        setSettings(res.data);
        console.log('Fetched settings:', res.data);
      } catch (err) {
        setSettings(null);
        console.error('Failed to fetch settings:', err);
      } finally {
        setSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiClient.get('/settings');
        setSettings(res.data);
      } catch (err) {
        setSettings(null);
      } finally {
        setSettingsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement actual form submission
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative text-white py-12 overflow-hidden">
        {/* Gradient Background with Transparency */}
        <div className="absolute inset-0 opacity-90" style={{ background: 'linear-gradient(to bottom right, #7be87b, #49b93b, #26701c)' }}></div>
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl" style={{ color: '#eaffea' }}>
            We'd love to hear from you. Send us a message!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <Card>
              <div className="flex items-start space-x-4">
                <MapPin size={24} className="mt-1 flex-shrink-0" style={{ color: '#49b93b' }} />
                <div>
                  <h3 className="font-bold text-lg mb-1 text-gray-600">Address</h3>
                  <p className="text-gray-700 text-sm">
                    {settingsLoading ? 'Loading...' : settings?.churchAddress || 'Address unavailable'}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start space-x-4">
                <Phone size={24} className="mt-1 flex-shrink-0" style={{ color: '#49b93b' }} />
                <div>
                  <h3 className="font-bold text-lg mb-1 text-gray-600">Phone</h3>
                  <p className="text-gray-700 text-sm">
                    {settingsLoading ? 'Loading...' : (
                      <a href={`tel:${settings?.churchPhone || ''}`} style={{ color: '#26701c' }} className="hover:underline">
                        {settings?.churchPhone || 'Phone unavailable'}
                      </a>
                    )}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start space-x-4">
                <Mail size={24} className="mt-1 flex-shrink-0" style={{ color: '#49b93b' }} />
                <div>
                  <h3 className="font-bold text-lg mb-1 text-gray-600">Email</h3>
                  <p className="text-gray-700 text-sm">
                    {settingsLoading ? 'Loading...' : (
                      <a
                        href={`mailto:${settings?.churchEmail || ''}`}
                        style={{ color: '#26701c' }}
                        className="hover:underline"
                      >
                        {settings?.churchEmail || 'Email unavailable'}
                      </a>
                    )}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start space-x-4">
                <Clock size={24} className="mt-1 flex-shrink-0" style={{ color: '#49b93b' }} />
                <div>
                  <h3 className="font-bold text-lg mb-1 text-gray-600">Service Hours</h3>
                  <div className="text-gray-700 text-sm">
                    {settingsLoading ? 'Loading...' : (
                      settings?.serviceTimes && settings.serviceTimes.length > 0 ? (
                        <ul>
                          {settings.serviceTimes.map((service, idx) => (
                            <li key={idx}>
                              <span className="font-semibold">{service.day}:</span> {service.name} ({service.startTime} - {service.endTime})
                            </li>
                          ))}
                        </ul>
                      ) : 'No service hours available'
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold mb-6 text-gray-600">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Your name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="your@email.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    type="tel"
                    label="Phone Number (Optional)"
                    placeholder="+234 XXX XXX XXXX"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <Input
                    label="Subject"
                    placeholder="What is this about?"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <Textarea
                  label="Message"
                  placeholder="Your message here..."
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  required
                />

                <Button
                  type="submit"
                  className="w-full py-3 text-lg font-bold"
                  style={{ background: '#49b93b', color: '#fff' }}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Sending Your Message...' : 'Send Message to Us'}
                </Button>
              </form>

              <p className="text-gray-600 text-sm mt-4 text-center">
                We typically respond within 24 hours during business days.
              </p>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <Card className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-600">Find Us On Map</h2>
          <div className="rounded-lg overflow-hidden">
            <iframe
              title="Elim City - Throne Room Map"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(settings?.churchAddress || 'Elim City Throne Room, 123 Faith Street, Lagos, Nigeria')}&output=embed`}
            ></iframe>
          </div>
        </Card>


        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-600">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: 'What time are your services?',
                a: 'We have services on Sunday mornings at 9:00 AM and Sunday evenings at 5:00 PM.',
              },
              {
                q: 'Do you have parking?',
                a: 'Yes, we have ample free parking available for all our members and visitors.',
              },
              {
                q: 'Are children welcome?',
                a: 'Absolutely! We have a dedicated children and youth ministry program.',
              },
              {
                q: 'Do you accept donations online?',
                a: 'Yes! You can give online through our secure donation portal on the Give page.',
              },
            ].map((faq, idx) => (
              <Card key={idx}>
                <h3 className="font-bold text-lg mb-2 text-gray-600">{faq.q}</h3>
                <p className="text-gray-700 text-sm">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
