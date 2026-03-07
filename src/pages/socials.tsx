import React, { useEffect, useState } from 'react';
import { Card } from '@/components';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { api } from '@/lib/api';

const PLATFORMS = [
  {
    key: 'facebook',
    name: 'Facebook',
    icon: <Facebook className="w-8 h-8" color="#1877F3" />,
    color: 'text-[#1877F3]',
    brand: 'border-[#1877F3]'
  },
  {
    key: 'instagram',
    name: 'Instagram',
    icon: <Instagram className="w-8 h-8" color="#E4405F" />,
    color: 'text-[#E4405F]',
    brand: 'border-[#E4405F]'
  },
  {
    key: 'twitter',
    name: 'X (Twitter)',
    icon: <Twitter className="w-8 h-8" color="#000000" />,
    color: 'text-black',
    brand: 'border-black'
  },
  {
    key: 'youtube',
    name: 'YouTube',
    icon: <Youtube className="w-8 h-8" color="#FF0000" />,
    color: 'text-[#FF0000]',
    brand: 'border-[#FF0000]'
  },
];

export default function Socials() {
  const [links, setLinks] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      setLoading(true);
      try {
        const res = await api.getSettings();
        setLinks(res.data.socialMedia || {});
      } catch {
        setLinks({});
      }
      setLoading(false);
    }
    fetchLinks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8 text-center">Connect With Us</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {PLATFORMS.map(platform => {
          const url = links[platform.key];
          const isActive = !!url;
          return (
            <Card
              key={platform.key}
              className={`flex flex-col items-center p-6 border-2 transition-all duration-200 ${isActive ? platform.brand + ' bg-white hover:shadow-lg' : 'border-gray-200 bg-gray-50 opacity-60 grayscale'}`}
            >
              <div className={`mb-2 ${isActive ? '' : 'opacity-40'}`}>{platform.icon}</div>
              <div className={`text-lg font-bold mb-1 ${isActive ? platform.color : 'text-gray-400'}`}>{platform.name}</div>
              {isActive ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm underline font-medium break-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${platform.color}`}
                  aria-label={`Visit our ${platform.name}`}
                >
                  {url}
                </a>
              ) : (
                <span className="text-xs text-gray-400">Not available</span>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
