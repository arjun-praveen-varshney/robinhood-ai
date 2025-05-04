'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, BellIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.svg" 
              alt="Robinhood" 
              width={32} 
              height={32} 
              className="mr-2"
            />
            <span className="text-xl font-bold hidden sm:inline-block">Robinhood</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-black">Home</Link>
          <Link href="/stocks" className="text-gray-700 hover:text-black">Stocks</Link>
          <Link href="/portfolio" className="text-gray-700 hover:text-black">Portfolio</Link>
          <Link href="/ai-predictor" className="text-gray-700 hover:text-black">AI Predictor</Link>
          <Link href="/leaderboard" className="text-gray-700 hover:text-black">Leaderboard</Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex items-center relative flex-grow max-w-md mx-4">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search stocks..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-700 hover:text-black">
            <BellIcon className="h-6 w-6" />
          </button>
          <button className="text-gray-700 hover:text-black">
            <UserCircleIcon className="h-6 w-6" />
          </button>
          <button 
            className="md:hidden text-gray-700 hover:text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="container mx-auto px-4">
            <div className="flex items-center relative mb-4">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3" />
              <input
                type="text"
                placeholder="Search stocks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-black py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/stocks" 
                className="text-gray-700 hover:text-black py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Stocks
              </Link>
              <Link 
                href="/portfolio" 
                className="text-gray-700 hover:text-black py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link 
                href="/ai-predictor" 
                className="text-gray-700 hover:text-black py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Predictor
              </Link>
              <Link 
                href="/leaderboard" 
                className="text-gray-700 hover:text-black py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Leaderboard
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
