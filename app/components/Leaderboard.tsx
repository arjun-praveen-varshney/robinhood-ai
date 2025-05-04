'use client';

import { useState, useEffect } from 'react';
import { TrophyIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import { VirtualTradingSimulator } from '../lib/virtualTrading';

interface LeaderboardEntry {
  userId: string;
  totalValue: number;
  rank?: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<string>('user123'); // Mock user ID

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch from Firebase
        // For demo purposes, we'll use the mock leaderboard
        const tradingSimulator = new VirtualTradingSimulator();
        const leaderboardData = tradingSimulator.getMockLeaderboard();
        
        // Add rank to each entry
        const rankedLeaderboard = leaderboardData.map((entry, index) => ({
          ...entry,
          rank: index + 1
        }));
        
        setLeaderboard(rankedLeaderboard);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Find current user's rank
  const currentUserRank = leaderboard.find(entry => entry.userId === currentUserId)?.rank || 0;

  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-xl font-bold">Top Traders</h2>
        <p className="text-gray-600">See how you stack up against other traders</p>
      </div>

      {isLoading ? (
        <div className="p-5 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading leaderboard...</p>
        </div>
      ) : (
        <>
          <div className="p-5">
            {leaderboard.slice(0, 3).map((entry) => (
              <div 
                key={entry.userId} 
                className={`flex items-center p-3 mb-2 rounded-lg ${
                  entry.rank === 1 
                    ? 'bg-yellow-50 border border-yellow-200' 
                    : entry.rank === 2 
                    ? 'bg-gray-50 border border-gray-200' 
                    : 'bg-amber-50 border border-amber-200'
                } ${entry.userId === currentUserId ? 'border-2' : ''}`}
              >
                <div className={`
                  flex items-center justify-center h-10 w-10 rounded-full mr-3 
                  ${entry.rank === 1 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : entry.rank === 2 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-amber-100 text-amber-800'
                  }
                `}>
                  <TrophyIcon className="h-5 w-5" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">
                        {entry.userId === currentUserId ? 'You' : `Trader ${entry.userId}`}
                      </span>
                      {entry.userId === currentUserId && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <span className="font-bold">{formatCurrency(entry.totalValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Rank #{entry.rank}</span>
                    <span className="flex items-center green-text">
                      <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                      +{(Math.random() * 10 + 5).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200">
            <div className="p-5">
              <h3 className="font-medium mb-3">All Traders</h3>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="p-2 text-gray-600">Rank</th>
                      <th className="p-2 text-gray-600">Trader</th>
                      <th className="p-2 text-gray-600 text-right">Portfolio Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry) => (
                      <tr 
                        key={entry.userId}
                        className={`border-t border-gray-100 ${
                          entry.userId === currentUserId ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="p-2 font-medium">#{entry.rank}</td>
                        <td className="p-2">
                          {entry.userId === currentUserId ? (
                            <span className="font-medium">You</span>
                          ) : (
                            `Trader ${entry.userId}`
                          )}
                        </td>
                        <td className="p-2 text-right font-medium">{formatCurrency(entry.totalValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="p-5 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Your Rank</p>
                <p className="text-xl font-bold">#{currentUserRank}</p>
              </div>
              <button className="px-4 py-2 green-bg text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                Improve Ranking
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
