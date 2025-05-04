'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import AIPredictorCard from '../components/AIPredictorCard';
import StockCard from '../components/StockCard';
import { mockStocks } from '../lib/api';
import { MagnifyingGlassIcon, LightBulbIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

export default function AIPredictorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [topPicks, setTopPicks] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate top picks - stocks with the highest AI confidence
    const generateTopPicks = () => {
      // In a real app, we would calculate this based on actual AI predictions
      // For demo purposes, we'll randomly select 3 stocks
      const shuffled = [...mockStocks].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      
      // Add mock AI predictions
      const withPredictions = selected.map(stock => ({
        ...stock,
        aiPrediction: {
          prediction: Math.random() * 10 - 2, // Bias slightly towards positive predictions
          confidence: 75 + Math.random() * 20, // High confidence (75-95%)
        }
      }));
      
      // Sort by confidence
      withPredictions.sort((a, b) => b.aiPrediction.confidence - a.aiPrediction.confidence);
      
      setTopPicks(withPredictions);
    };
    
    generateTopPicks();
  }, []);
  
  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setHasSearched(true);
    
    // In a real app, we would search the API
    // For demo purposes, we'll filter the mock stocks
    const results = mockStocks.filter(
      stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
    setSelectedStock(null);
  };
  
  // Handle stock selection
  const handleSelectStock = (stock: any) => {
    setSelectedStock({
      ...stock,
      aiPrediction: {
        prediction: Math.random() * 10 - 5, // Random between -5% and +5%
        confidence: 65 + Math.random() * 20, // Random between 65% and 85%
      }
    });
  };
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <LightBulbIcon className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold">AI Stock Predictor</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <h2 className="text-xl font-bold mb-4">Get AI-Powered Stock Predictions</h2>
          <p className="text-gray-600 mb-6">
            Our advanced AI model analyzes historical data, market trends, and trading patterns to predict potential price movements with high accuracy.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search for a stock (e.g., AAPL, Tesla, Amazon)..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button
              className="px-6 py-3 green-bg text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
              onClick={handleSearch}
            >
              Get Prediction
            </button>
          </div>
          
          {hasSearched && searchResults.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">No stocks found matching "{searchQuery}".</p>
              <p className="text-gray-500">Try a different search term or browse our top picks below.</p>
            </div>
          )}
          
          {hasSearched && searchResults.length > 0 && (
            <div className="mb-8">
              <h3 className="font-medium mb-4">Search Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.slice(0, 3).map((stock) => (
                  <div 
                    key={stock.symbol}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleSelectStock(stock)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold">{stock.symbol}</h4>
                        <p className="text-gray-600 text-sm">{stock.name}</p>
                      </div>
                      <div className={stock.change >= 0 ? 'green-text' : 'red-text'}>
                        {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <button className="w-full py-2 mt-2 green-bg text-white rounded-md font-medium text-sm">
                      Select for Prediction
                    </button>
                  </div>
                ))}
              </div>
              {searchResults.length > 3 && (
                <p className="text-center mt-4 text-gray-500 text-sm">
                  Showing top 3 results of {searchResults.length} matches.
                </p>
              )}
            </div>
          )}
        </div>
        
        {selectedStock && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">AI Prediction for {selectedStock.symbol}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AIPredictorCard 
                symbol={selectedStock.symbol}
                name={selectedStock.name}
                currentPrice={selectedStock.price}
                historicalData={[]}
              />
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold mb-4">What This Means</h3>
                <p className="text-gray-600 mb-4">
                  Our AI model predicts that {selectedStock.symbol} is likely to 
                  {selectedStock.aiPrediction.prediction >= 0 ? ' increase ' : ' decrease '} 
                  by approximately {Math.abs(selectedStock.aiPrediction.prediction).toFixed(2)}% 
                  over the next 7 days, with a confidence level of {selectedStock.aiPrediction.confidence.toFixed(1)}%.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-2">Factors Influencing This Prediction</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      Historical price patterns and volatility
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      Recent trading volume and momentum
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      Market sentiment analysis
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      Sector performance trends
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> This prediction is for educational purposes only and should not be considered financial advice. Always do your own research before making investment decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-2xl font-bold">Top Bullish Picks</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPicks.filter(stock => stock.aiPrediction.prediction > 0).slice(0, 3).map((stock) => (
              <StockCard 
                key={stock.symbol}
                symbol={stock.symbol}
                name={stock.name}
                price={stock.price}
                change={stock.change}
                changePercent={stock.changePercent}
                aiPrediction={stock.aiPrediction}
              />
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-6">
            <ArrowTrendingDownIcon className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-2xl font-bold">Stocks to Watch</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockStocks.filter(stock => stock.change < 0).slice(0, 3).map((stock) => (
              <StockCard 
                key={stock.symbol}
                symbol={stock.symbol}
                name={stock.name}
                price={stock.price}
                change={stock.change}
                changePercent={stock.changePercent}
                aiPrediction={{
                  prediction: Math.random() * -8, // Negative prediction
                  confidence: 65 + Math.random() * 20, // Random between 65% and 85%
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <section className="bg-white border-t border-gray-200 py-12 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">How Our AI Stock Predictor Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Data Collection</h3>
              <p className="text-gray-600">
                Our system collects and processes vast amounts of historical stock data, including price movements, trading volumes, and market indicators.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">AI Processing</h3>
              <p className="text-gray-600">
                Our machine learning model, trained on millions of data points, identifies patterns and correlations that humans might miss.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Prediction Generation</h3>
              <p className="text-gray-600">
                The system generates price predictions with confidence scores, helping you make more informed trading decisions.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our AI Stock Predictor is constantly learning and improving. As more data becomes available, the predictions become more accurate and reliable.
            </p>
            <button className="px-6 py-3 green-bg text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors">
              Try It Now
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 Robinhood. All rights reserved.</p>
          <p className="mt-1">This is a demo project for the Vibe Coding Hackathon. Not affiliated with Robinhood Markets, Inc.</p>
        </div>
      </footer>
    </main>
  );
}
