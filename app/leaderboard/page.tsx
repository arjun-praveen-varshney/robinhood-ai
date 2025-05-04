'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Leaderboard from '../components/Leaderboard';
import { TrophyIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

export default function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('all-time');
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <TrophyIcon className="h-8 w-8 text-yellow-500 mr-3" />
          <h1 className="text-3xl font-bold">Leaderboard</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <h2 className="text-xl font-bold mb-4">Top Virtual Traders</h2>
          <p className="text-gray-600 mb-6">
            See how you stack up against other traders in our virtual trading competition. Build your portfolio, implement your strategy, and climb the rankings!
          </p>
          
          <div className="flex space-x-2 mb-6">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'daily' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setTimeRange('daily')}
            >
              Daily
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'weekly' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setTimeRange('weekly')}
            >
              Weekly
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'monthly' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'all-time' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setTimeRange('all-time')}
            >
              All Time
            </button>
          </div>
          
          <Leaderboard />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">How to Climb the Rankings</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="green-bg rounded-full p-1 mt-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Diversify Your Portfolio</h4>
                  <p className="text-gray-600">Spread your investments across different sectors and asset types to reduce risk.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="green-bg rounded-full p-1 mt-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Use AI Predictions</h4>
                  <p className="text-gray-600">Leverage our AI Stock Predictor to identify potential opportunities with high confidence scores.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="green-bg rounded-full p-1 mt-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Stay Active</h4>
                  <p className="text-gray-600">Regularly monitor your investments and adjust your strategy based on market conditions.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="green-bg rounded-full p-1 mt-1 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Learn and Adapt</h4>
                  <p className="text-gray-600">Study successful traders' strategies and adapt them to your own investment style.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Leaderboard Rewards</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="bg-yellow-100 text-yellow-800 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                  <span className="font-bold">1</span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">Top Trader</h4>
                  <p className="text-gray-600 text-sm">Special badge and featured on the homepage</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="bg-gray-100 text-gray-800 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                  <span className="font-bold">2</span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">Second Place</h4>
                  <p className="text-gray-600 text-sm">Silver badge and recognition</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="bg-amber-100 text-amber-800 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                  <span className="font-bold">3</span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">Third Place</h4>
                  <p className="text-gray-600 text-sm">Bronze badge and recognition</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="bg-blue-100 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                  <span className="font-bold">10</span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium">Top 10</h4>
                  <p className="text-gray-600 text-sm">Elite trader badge</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center mb-6">
            <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-bold">Trading Insights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Most Traded Stocks</h3>
              <ol className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">1. AAPL</span>
                  <span className="text-sm text-gray-500">Apple Inc.</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">2. TSLA</span>
                  <span className="text-sm text-gray-500">Tesla, Inc.</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">3. MSFT</span>
                  <span className="text-sm text-gray-500">Microsoft Corp.</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">4. AMZN</span>
                  <span className="text-sm text-gray-500">Amazon.com Inc.</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">5. GOOGL</span>
                  <span className="text-sm text-gray-500">Alphabet Inc.</span>
                </li>
              </ol>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Best Performing Sectors</h3>
              <ol className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">1. Technology</span>
                  <span className="text-sm green-text">+8.2%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">2. Healthcare</span>
                  <span className="text-sm green-text">+6.5%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">3. Consumer Cyclical</span>
                  <span className="text-sm green-text">+5.9%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">4. Financial Services</span>
                  <span className="text-sm green-text">+4.2%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">5. Communication</span>
                  <span className="text-sm green-text">+3.7%</span>
                </li>
              </ol>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Trading Strategies</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">•</span>
                  Value Investing
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">•</span>
                  Growth Investing
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">•</span>
                  Momentum Trading
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">•</span>
                  Dollar-Cost Averaging
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">•</span>
                  AI-Assisted Trading
                </li>
              </ul>
            </div>
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
