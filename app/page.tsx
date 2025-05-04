import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';
import StockCard from './components/StockCard';
import { mockStocks } from './lib/api';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Investing for Everyone</h1>
              <p className="text-xl text-gray-600 mb-8">
                Commission-free investing, plus the tools you need to put your money in motion. Sign up and get your first stock for free.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/stocks" 
                  className="px-6 py-3 green-bg text-white rounded-lg font-medium text-center hover:bg-opacity-90 transition-colors"
                >
                  Browse Stocks
                </Link>
                <Link 
                  href="/ai-predictor" 
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors"
                >
                  Try AI Predictor
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md h-80">
                <Image 
                  src="/hero-image.svg" 
                  alt="Investing illustration" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Stocks Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Stocks</h2>
            <Link 
              href="/stocks" 
              className="text-green-600 font-medium hover:underline"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockStocks.slice(0, 6).map((stock) => (
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
        </div>
      </section>
      
      {/* AI Predictor Feature Section */}
      <section className="py-12 bg-white border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">AAPL</h3>
                    <p className="text-gray-600 text-sm">Apple Inc.</p>
                  </div>
                  <div className="bg-gray-200 px-2 py-1 rounded-md">
                    <div className="flex items-center">
                      <span className="text-xs font-medium green-text">+2.75%</span>
                      <span className="text-xs text-gray-500 ml-1">(87.5% conf.)</span>
                    </div>
                    <div className="text-xs text-gray-500">AI Prediction</div>
                  </div>
                </div>
                
                <div className="h-32 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Stock Chart Visualization</span>
                </div>
                
                <div className="bg-gray-200 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Confidence Score</span>
                    <span className="text-sm font-medium">87.5%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
                    <div className="green-bg h-2 rounded-full" style={{ width: '87.5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">AI-Powered Stock Predictions</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our advanced AI model analyzes historical data, market trends, and trading patterns to predict potential price movements with high accuracy.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="green-bg rounded-full p-1 mt-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">7-Day Price Predictions</h4>
                    <p className="text-gray-600">Get insights into potential price movements over the next week</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="green-bg rounded-full p-1 mt-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Confidence Scores</h4>
                    <p className="text-gray-600">Understand how certain our AI is about each prediction</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="green-bg rounded-full p-1 mt-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Risk Analysis</h4>
                    <p className="text-gray-600">Get detailed risk assessments for each stock</p>
                  </div>
                </li>
              </ul>
              <Link 
                href="/ai-predictor" 
                className="px-6 py-3 green-bg text-white rounded-lg font-medium inline-block hover:bg-opacity-90 transition-colors"
              >
                Try AI Predictor
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Virtual Trading Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Virtual Trading Simulator</h2>
              <p className="text-lg text-gray-600 mb-6">
                Practice trading with $10,000 in virtual cash. Build your portfolio, test strategies, and compete with other traders on our leaderboard.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="green-bg rounded-full p-1 mt-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">$10,000 Virtual Cash</h4>
                    <p className="text-gray-600">Start with $10,000 in virtual money to build your portfolio</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="green-bg rounded-full p-1 mt-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Real-Time Trading</h4>
                    <p className="text-gray-600">Buy and sell stocks with real-time market data</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="green-bg rounded-full p-1 mt-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Leaderboard Competition</h4>
                    <p className="text-gray-600">Compete with other traders and climb the rankings</p>
                  </div>
                </li>
              </ul>
              <Link 
                href="/portfolio" 
                className="px-6 py-3 green-bg text-white rounded-lg font-medium inline-block hover:bg-opacity-90 transition-colors"
              >
                Start Trading
              </Link>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Virtual Portfolio</h3>
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-gray-600 text-sm">Total Value</span>
                    <div className="text-2xl font-bold">$12,345.67</div>
                  </div>
                  <div className="flex items-center green-text">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    <span>+23.46%</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium">AAPL</div>
                      <div className="text-sm text-gray-600">10 shares</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$1,873.20</div>
                      <div className="text-sm green-text">+6.74%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium">MSFT</div>
                      <div className="text-sm text-gray-600">5 shares</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$2,102.25</div>
                      <div className="text-sm green-text">+2.48%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium">TSLA</div>
                      <div className="text-sm text-gray-600">8 shares</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$1,726.00</div>
                      <div className="text-sm red-text">-2.26%</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <span className="text-gray-600 text-sm">Cash Available</span>
                    <div className="font-medium">$5,432.10</div>
                  </div>
                  <button className="px-4 py-2 green-bg text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                    Trade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image 
                src="/logo.svg" 
                alt="Robinhood" 
                width={24} 
                height={24} 
                className="mr-2"
              />
              <span className="text-lg font-bold">Robinhood</span>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Help</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Privacy</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">Terms</Link>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p> 2025 Robinhood. All rights reserved.</p>
            <p className="mt-1">This is a demo project for the Vibe Coding Hackathon. Not affiliated with Robinhood Markets, Inc.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
