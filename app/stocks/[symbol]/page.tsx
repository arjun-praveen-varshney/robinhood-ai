'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import StockChart from '../../components/StockChart';
import AIPredictorCard from '../../components/AIPredictorCard';
import VirtualTrading from '../../components/VirtualTrading';
import { mockStocks } from '../../lib/api';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { InformationCircleIcon, ChartBarIcon, NewspaperIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

export default function StockDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  
  const [stock, setStock] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'ai-predictor' | 'news' | 'company'>('overview');
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch from API
        // For demo purposes, we'll use mock data
        const foundStock = mockStocks.find(s => s.symbol.toLowerCase() === symbol.toLowerCase());
        
        if (foundStock) {
          setStock(foundStock);
          
          // Generate mock chart data
          const mockChartData = generateMockChartData(foundStock.price, foundStock.change > 0);
          setChartData(mockChartData);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStockData();
  }, [symbol]);
  
  // Generate mock chart data for demo purposes
  const generateMockChartData = (currentPrice: number, isPositive: boolean) => {
    const data = [];
    const now = new Date();
    const volatility = currentPrice * 0.02; // 2% volatility
    
    // Generate data for the last 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      // Generate a somewhat realistic price movement
      const randomFactor = Math.random() * volatility * 2 - volatility;
      const trend = isPositive ? (i / 30) * volatility * -1 : (i / 30) * volatility;
      const price = currentPrice + trend + randomFactor;
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(0, price)
      });
    }
    
    return data;
  };
  
  // Format price and change values
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };
  
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stock data...</p>
        </div>
      </main>
    );
  }
  
  if (!stock) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Stock Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find any stock with the symbol "{symbol}".</p>
          <Link 
            href="/stocks" 
            className="px-6 py-3 green-bg text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Browse All Stocks
          </Link>
        </div>
      </main>
    );
  }
  
  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? 'green-text' : 'red-text';
  const changeIcon = isPositive ? (
    <ArrowUpIcon className="h-5 w-5 green-text" />
  ) : (
    <ArrowDownIcon className="h-5 w-5 red-text" />
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Stock Header */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{stock.symbol}</h1>
              <p className="text-xl text-gray-600">{stock.name}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-3xl font-bold">{formatCurrency(stock.price)}</div>
              <div className="flex items-center">
                {changeIcon}
                <span className={`ml-1 ${changeColor}`}>
                  {formatCurrency(Math.abs(stock.change))} ({Math.abs(stock.changePercent).toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
          
          <div className="h-64">
            <StockChart 
              symbol={stock.symbol}
              data={chartData}
              color={isPositive ? '#00C805' : '#FF5000'}
            />
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'ai-predictor' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('ai-predictor')}
          >
            <InformationCircleIcon className="h-5 w-5 mr-2" />
            AI Predictor
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'news' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('news')}
          >
            <NewspaperIcon className="h-5 w-5 mr-2" />
            News
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'company' 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('company')}
          >
            <BuildingLibraryIcon className="h-5 w-5 mr-2" />
            Company
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold mb-4">About {stock.name}</h2>
                <p className="text-gray-600 mb-6">
                  {stock.name} is a leading company in its industry, providing innovative products and services to customers worldwide. The company has shown strong financial performance and continues to expand its market presence.
                </p>
                
                <h3 className="font-bold mb-3">Key Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-gray-600 text-sm">Market Cap</p>
                    <p className="font-medium">{formatCurrency(stock.price * 1000000000)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">P/E Ratio</p>
                    <p className="font-medium">{(Math.random() * 30 + 10).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Dividend Yield</p>
                    <p className="font-medium">{(Math.random() * 3).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">52-Week High</p>
                    <p className="font-medium">{formatCurrency(stock.price * 1.2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">52-Week Low</p>
                    <p className="font-medium">{formatCurrency(stock.price * 0.8)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Volume</p>
                    <p className="font-medium">{(Math.random() * 10 + 1).toFixed(2)}M</p>
                  </div>
                </div>
                
                <h3 className="font-bold mb-3">Recent Performance</h3>
                <p className="text-gray-600">
                  {stock.name} has {isPositive ? 'shown positive momentum' : 'experienced some challenges'} in recent trading sessions. The stock is currently trading at {formatCurrency(stock.price)}, which represents a {isPositive ? 'gain' : 'loss'} of {Math.abs(stock.changePercent).toFixed(2)}% compared to the previous close.
                </p>
              </div>
            )}
            
            {activeTab === 'ai-predictor' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold mb-4">AI-Powered Stock Prediction</h2>
                <p className="text-gray-600 mb-6">
                  Our advanced AI model analyzes historical data, market trends, and trading patterns to predict potential price movements for {stock.symbol}.
                </p>
                
                <AIPredictorCard 
                  symbol={stock.symbol}
                  name={stock.name}
                  currentPrice={stock.price}
                />
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">How It Works</h3>
                  <p className="text-blue-700 text-sm">
                    Our AI model uses machine learning algorithms trained on historical stock data to identify patterns and predict future price movements. The model considers factors such as price history, trading volume, market trends, and more to generate predictions with confidence scores.
                  </p>
                  <p className="text-blue-700 text-sm mt-2">
                    <strong>Note:</strong> These predictions are for educational purposes only and should not be considered financial advice. Always do your own research before making investment decisions.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'news' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Latest News</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="border-b border-gray-100 pb-4 last:border-0">
                      <h3 className="font-medium mb-1">
                        {stock.name} {item === 1 ? 'Reports Strong Quarterly Results' : item === 2 ? 'Announces New Product Line' : item === 3 ? 'Expands International Presence' : item === 4 ? 'Partners with Tech Giant' : 'Stock Upgraded by Analysts'}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {new Date(Date.now() - item * 24 * 60 * 60 * 1000).toLocaleDateString()} • Source: {item === 1 ? 'Bloomberg' : item === 2 ? 'CNBC' : item === 3 ? 'Reuters' : item === 4 ? 'Wall Street Journal' : 'Financial Times'}
                      </p>
                      <p className="text-gray-700">
                        {item === 1 
                          ? `${stock.name} reported quarterly earnings that exceeded analyst expectations, driven by strong growth in its core business segments.` 
                          : item === 2 
                          ? `${stock.name} unveiled a new product line aimed at expanding its market share in the rapidly growing sector.` 
                          : item === 3 
                          ? `${stock.name} announced plans to expand its operations into new international markets, targeting growth opportunities in emerging economies.` 
                          : item === 4 
                          ? `${stock.name} formed a strategic partnership with a leading technology company to enhance its digital capabilities and customer experience.` 
                          : `Several analysts have upgraded ${stock.name}'s stock rating, citing improved growth prospects and competitive positioning.`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'company' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Company Profile</h2>
                <p className="text-gray-600 mb-6">
                  {stock.name} is a leading company that specializes in providing innovative solutions to customers worldwide. With a strong focus on research and development, the company continues to drive growth and create value for shareholders.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-bold mb-3">Company Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">CEO</span>
                        <span>John Smith</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Founded</span>
                        <span>1985</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Headquarters</span>
                        <span>New York, NY</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Employees</span>
                        <span>25,000+</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Industry</span>
                        <span>Technology</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-3">Financial Highlights</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue (TTM)</span>
                        <span>{formatCurrency(stock.price * 10000000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net Income (TTM)</span>
                        <span>{formatCurrency(stock.price * 1000000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">EPS (TTM)</span>
                        <span>{(stock.price / 20).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profit Margin</span>
                        <span>{(Math.random() * 20 + 10).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Debt-to-Equity</span>
                        <span>{(Math.random() * 0.5 + 0.1).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-bold mb-3">Business Description</h3>
                <p className="text-gray-600 mb-4">
                  {stock.name} operates in multiple segments, including consumer products, enterprise solutions, and digital services. The company's diverse portfolio allows it to serve a wide range of customers and adapt to changing market conditions.
                </p>
                <p className="text-gray-600">
                  With a strong commitment to innovation and customer satisfaction, {stock.name} continues to invest in research and development to maintain its competitive edge and drive long-term growth.
                </p>
              </div>
            )}
          </div>
          
          <div>
            <VirtualTrading 
              userId="user123"
              symbol={stock.symbol}
              name={stock.name}
              currentPrice={stock.price}
            />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p> 2025 Robinhood. All rights reserved.</p>
          <p className="mt-1">This is a demo project for the Vibe Coding Hackathon. Not affiliated with Robinhood Markets, Inc.</p>
        </div>
      </footer>
    </main>
  );
}
