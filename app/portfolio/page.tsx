'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Portfolio from '../components/Portfolio';
import Leaderboard from '../components/Leaderboard';

export default function PortfolioPage() {
  const [userId, setUserId] = useState('user123'); // Mock user ID
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Portfolio</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Portfolio userId={userId} />
          </div>
          
          <div>
            <Leaderboard />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 Robinhood. All rights reserved.</p>
          <p className="mt-1">This is a demo project for the Vibe Coding Hackathon. Not affiliated with Robinhood Markets, Inc.</p>
        </div>
      </footer>
    </main>
  );
}
