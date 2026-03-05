'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">ElimThrone Church</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A modern church dedicated to spiritual growth, community service, and spreading the word of God.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/sermons" className="text-gray-400 hover:text-white transition text-sm">
                  Sermons
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white transition text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/ministries" className="text-gray-400 hover:text-white transition text-sm">
                  Ministries
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/give" className="text-gray-400 hover:text-white transition text-sm">
                  Give
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-blue-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Church Street<br />
                  Your City, Country
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-blue-500" />
                <a href="tel:+234xxx" className="text-gray-400 hover:text-white transition">
                  +234 XXX XXX XXXX
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-blue-500" />
                <a href="mailto:info@elimthronerm.com" className="text-gray-400 hover:text-white transition">
                  info@elimthronerm.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {currentYear} ElimThrone Church. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-white transition">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
