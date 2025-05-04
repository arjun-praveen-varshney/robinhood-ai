'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import StockCard from '../components/StockCard';
import { mockStocks } from '../lib/api';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function StocksPage() {
  const [stocks, setStocks] = useState(mockStocks);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterPositive, setFilterPositive] = useState(false);
  const [filterNegative, setFilterNegative] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort stocks based on search query and sort options
  useEffect(() => {
    let filteredStocks = [...mockStocks];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredStocks = filteredStocks.filter(
        stock => 
          stock.symbol.toLowerCase().includes(query) || 
          stock.name.toLowerCase().includes(query)
      );
    }
    
    // Apply positive/negative filters
    if (filterPositive && !filterNegative) {
      filteredStocks = filteredStocks.filter(stock => stock.change >= 0);
    } else if (!filterPositive && filterNegative) {
      filteredStocks = filteredStocks.filter(stock => stock.change < 0);
    }
    
    // Apply sorting
    filteredStocks.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'price') {
        return sortOrder === 'asc' 
          ? a.price - b.price 
          : b.price - a.price;
      } else {
        return sortOrder === 'asc' 
          ? a.change - b.change 
          : b.change - a.change;
      }
    });
    
    setStocks(filteredStocks);
  }, [searchQuery, sortBy, sortOrder, filterPositive, filterNegative]);

  // Toggle sort order when clicking on the same sort option
  const handleSortChange = (newSortBy: 'name' | 'price' | 'change') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Stocks</h1>
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="relative flex-grow">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search stocks by name or symbol..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              className="ml-4 px-4 py-3 bg-white border border-gray-300 rounded-lg flex items-center hover:bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span>Filters</span>
            </button>
          </div>
          
          {showFilters && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  <h3 className="font-medium mb-2">Sort By</h3>
                  <div className="flex space-x-2">
                    <button
                      className={`px-3 py-1 rounded-md text-sm ${
                        sortBy === 'name' ? 'bg-gray-200 font-medium' : 'bg-gray-100'
                      }`}
                      onClick={() => handleSortChange('name')}
                    >
                      Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md text-sm ${
                        sortBy === 'price' ? 'bg-gray-200 font-medium' : 'bg-gray-100'
                      }`}
                      onClick={() => handleSortChange('price')}
                    >
                      Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md text-sm ${
                        sortBy === 'change' ? 'bg-gray-200 font-medium' : 'bg-gray-100'
                      }`}
                      onClick={() => handleSortChange('change')}
                    >
                      Change {sortBy === 'change' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Performance</h3>
                  <div className="flex space-x-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filterPositive}
                        onChange={() => setFilterPositive(!filterPositive)}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm">Positive</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filterNegative}
                        onChange={() => setFilterNegative(!filterNegative)}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm">Negative</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Stocks Grid */}
        {stocks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((stock) => (
              <StockCard 
                key={stock.symbol}
                symbol={stock.symbol}
                name={stock.name}
                price={stock.price}
                change={stock.change}
                changePercent={stock.changePercent}
                aiPrediction={{
                  prediction: Math.random() * 10 - 5, // Random between -5% and +5%
                  confidence: 65 + Math.random() * 20, // Random between 65% and 85%
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-2">No stocks found matching your search criteria.</p>
            <button 
              className="text-green-600 font-medium hover:underline"
              onClick={() => {
                setSearchQuery('');
                setFilterPositive(false);
                setFilterNegative(false);
              }}
            >
              Clear filters
            </button>
          </div>
        )}
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
