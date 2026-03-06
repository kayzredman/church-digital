'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMediaDropdownOpen, setIsMediaDropdownOpen] = useState(false);
  const mediaDropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, userRole, signOut } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    setIsUserDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isUserDropdownOpen]);

  // Dropdown open/close helpers with delay
  const openMediaDropdown = () => {
    if (mediaDropdownTimeout.current) {
      clearTimeout(mediaDropdownTimeout.current);
      mediaDropdownTimeout.current = null;
    }
    setIsMediaDropdownOpen(true);
  };
  const closeMediaDropdown = () => {
    if (mediaDropdownTimeout.current) {
      clearTimeout(mediaDropdownTimeout.current);
    }
    mediaDropdownTimeout.current = setTimeout(() => {
      setIsMediaDropdownOpen(false);
    }, 150);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold hidden sm:inline text-lg">Elimcity</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/sermons" className="text-gray-700 hover:text-blue-600 transition">
              Sermons
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-blue-600 transition">
              Events
            </Link>
            {/* Media Dropdown (state-based) */}
            <div
              className="relative"
              onMouseEnter={openMediaDropdown}
              onMouseLeave={closeMediaDropdown}
            >
              <button
                className="flex items-center text-gray-700 hover:text-blue-600 transition focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isMediaDropdownOpen}
                tabIndex={0}
                onFocus={openMediaDropdown}
                onBlur={closeMediaDropdown}
              >
                <span>Media</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              {isMediaDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-44 bg-white rounded-lg shadow-lg z-50"
                  onMouseEnter={openMediaDropdown}
                  onMouseLeave={closeMediaDropdown}
                >
                  <Link href="/blog" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm" tabIndex={0} onFocus={openMediaDropdown} onBlur={closeMediaDropdown}>Blog</Link>
                  <Link href="/podcasts" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm" tabIndex={0} onFocus={openMediaDropdown} onBlur={closeMediaDropdown}>Podcasts</Link>
                  <Link href="/socials" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm" tabIndex={0} onFocus={openMediaDropdown} onBlur={closeMediaDropdown}>Socials</Link>
                  <Link href="/live-streams" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm" tabIndex={0} onFocus={openMediaDropdown} onBlur={closeMediaDropdown}>Live Streams</Link>
                </div>
              )}
            </div>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">
              About
            </Link>
            <Link href="/give" className="text-gray-700 hover:text-blue-600 transition">
              Give
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition">
              Contact
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <span>{user?.email}</span>
                  <ChevronDown size={16} />
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                    {userRole === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/sermons"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Sermons
            </Link>
            <Link
              href="/events"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            {/* Media expandable section */}
            <details className="px-2">
              <summary className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer select-none">Media</summary>
              <div className="pl-4 flex flex-col space-y-1">
                <Link href="/blog" className="block px-2 py-1 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsOpen(false)}>Blog</Link>
                <Link href="/podcasts" className="block px-2 py-1 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsOpen(false)}>Podcasts</Link>
                <Link href="/socials" className="block px-2 py-1 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsOpen(false)}>Socials</Link>
                <Link href="/live-streams" className="block px-2 py-1 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setIsOpen(false)}>Live Streams</Link>
              </div>
            </details>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/give"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Give
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                {userRole === 'admin' && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
