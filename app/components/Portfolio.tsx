'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { VirtualTradingSimulator, UserPortfolio, PortfolioItem } from '../lib/virtualTrading';
import dynamic from 'next/dynamic';

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface PortfolioProps {
  userId: string;
}

export default function Portfolio({ userId }: PortfolioProps) {
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('1W');

  useEffect(() => {
    const loadPortfolio = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch from Firebase
        // For demo purposes, we'll use the mock portfolio
        const tradingSimulator = new VirtualTradingSimulator();
        const userPortfolio = tradingSimulator.getMockPortfolio(userId);
        setPortfolio(userPortfolio);
      } catch (error) {
        console.error('Error loading portfolio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolio();
  }, [userId]);

  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  // Calculate total portfolio value
  const calculateTotalValue = () => {
    if (!portfolio) return 0;
    
    const stocksValue = portfolio.portfolioItems.reduce(
      (total, item) => total + (item.shares * item.currentPrice), 
      0
    );
    
    return portfolio.cash + stocksValue;
  };

  // Calculate total profit/loss
  const calculateTotalProfitLoss = () => {
    if (!portfolio) return { value: 0, percent: 0 };
    
    const totalCost = portfolio.portfolioItems.reduce(
      (total, item) => total + (item.shares * item.averageCost), 
      0
    );
    
    const currentValue = portfolio.portfolioItems.reduce(
      (total, item) => total + (item.shares * item.currentPrice), 
      0
    );
    
    const profitLoss = currentValue - totalCost;
    const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;
    
    return {
      value: profitLoss,
      percent: profitLossPercent
    };
  };

  // Calculate profit/loss for a stock
  const calculateStockProfitLoss = (item: PortfolioItem) => {
    const totalCost = item.shares * item.averageCost;
    const currentValue = item.shares * item.currentPrice;
    const profitLoss = currentValue - totalCost;
    const profitLossPercent = (profitLoss / totalCost) * 100;
    
    return {
      value: profitLoss,
      percent: profitLossPercent
    };
  };

  // Generate portfolio allocation data for pie chart
  const generatePortfolioAllocationData = () => {
    if (!portfolio) return { series: [], labels: [] };
    
    const series = portfolio.portfolioItems.map(item => item.shares * item.currentPrice);
    const labels = portfolio.portfolioItems.map(item => item.symbol);
    
    // Add cash to the allocation
    series.push(portfolio.cash);
    labels.push('Cash');
    
    return { series, labels };
  };

  // Generate mock performance data
  const generatePerformanceData = () => {
    const data = [];
    const now = new Date();
    const timeRanges = {
      '1D': 1,
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '1Y': 365,
      'All': 730
    };
    
    const days = timeRanges[selectedTimeRange as keyof typeof timeRanges] || 7;
    const startValue = 10000; // Initial portfolio value
    const endValue = calculateTotalValue();
    
    for (let i = 0; i <= days; i++) {
      const date = new Date();
      date.setDate(now.getDate() - (days - i));
      
      // Generate a somewhat realistic growth curve
      const progress = i / days;
      const randomFactor = 1 + (Math.random() * 0.1 - 0.05); // Random factor between 0.95 and 1.05
      const value = startValue + (endValue - startValue) * Math.pow(progress, 1.2) * randomFactor;
      
      data.push({
        x: date.getTime(),
        y: value
      });
    }
    
    return data;
  };

  const allocationData = generatePortfolioAllocationData();
  const performanceData = generatePerformanceData();
  const totalProfitLoss = calculateTotalProfitLoss();
  const isProfit = totalProfitLoss.value >= 0;

  // Portfolio allocation chart options
  const allocationOptions = {
    chart: {
      type: 'donut' as const,
    },
    labels: allocationData.labels,
    colors: ['#00C805', '#1E88E5', '#FFC107', '#FF5722', '#9C27B0', '#3F51B5', '#009688', '#607D8B'],
    legend: {
      position: 'bottom' as const,
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom' as const
        }
      }
    }]
  };

  // Performance chart options
  const performanceOptions = {
    chart: {
      type: 'area' as const,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout' as const,
        speed: 800,
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2,
      colors: [isProfit ? '#00C805' : '#FF5000']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100]
      },
      colors: [isProfit ? '#00C805' : '#FF5000']
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy'
      },
      y: {
        formatter: function(value: number) {
          return `$${value.toFixed(2)}`;
        }
      }
    },
    xaxis: {
      type: 'datetime' as const,
      labels: {
        datetimeUTC: false,
        format: selectedTimeRange === '1D' ? 'HH:mm' : 'dd MMM'
      }
    },
    yaxis: {
      labels: {
        formatter: function(value: number) {
          return `$${value.toFixed(0)}`;
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1'
    },
    theme: {
      mode: 'light' as const
    }
  };

  // Time range buttons
  const timeRangeButtons = ['1D', '1W', '1M', '3M', '1Y', 'All'];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-xl font-bold">Your Portfolio</h2>
        <p className="text-gray-600">Track your virtual investments</p>
      </div>

      {isLoading ? (
        <div className="p-5 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading portfolio...</p>
        </div>
      ) : portfolio ? (
        <>
          <div className="p-5">
            <div className="mb-6">
              <h3 className="text-gray-600 mb-1">Total Portfolio Value</h3>
              <div className="text-3xl font-bold">{formatCurrency(calculateTotalValue())}</div>
              <div className="flex items-center mt-1">
                {isProfit ? (
                  <ArrowUpIcon className="h-4 w-4 green-text mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 red-text mr-1" />
                )}
                <span className={isProfit ? 'green-text' : 'red-text'}>
                  {formatCurrency(Math.abs(totalProfitLoss.value))} ({isProfit ? '+' : ''}
                  {totalProfitLoss.percent.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Performance</h3>
                <div className="flex space-x-2">
                  {timeRangeButtons.map((range) => (
                    <button
                      key={range}
                      className={`px-2 py-1 text-xs rounded-md ${
                        selectedTimeRange === range
                          ? 'bg-gray-200 font-medium'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedTimeRange(range)}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64">
                {typeof window !== 'undefined' && (
                  <ReactApexChart
                    options={performanceOptions}
                    series={[{
                      name: 'Portfolio Value',
                      data: performanceData
                    }]}
                    type="area"
                    height="100%"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium mb-4">Portfolio Allocation</h3>
                <div className="h-64">
                  {typeof window !== 'undefined' && (
                    <ReactApexChart
                      options={allocationOptions}
                      series={allocationData.series}
                      type="donut"
                      height="100%"
                    />
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-4">Account Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Cash Balance</span>
                    <span className="font-medium">{formatCurrency(portfolio.cash)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Invested Amount</span>
                    <span className="font-medium">
                      {formatCurrency(
                        portfolio.portfolioItems.reduce(
                          (total, item) => total + item.shares * item.averageCost,
                          0
                        )
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Current Value</span>
                    <span className="font-medium">
                      {formatCurrency(
                        portfolio.portfolioItems.reduce(
                          (total, item) => total + item.shares * item.currentPrice,
                          0
                        )
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                    <span className="text-gray-600">Total Profit/Loss</span>
                    <span className={isProfit ? 'green-text font-medium' : 'red-text font-medium'}>
                      {formatCurrency(Math.abs(totalProfitLoss.value))} ({isProfit ? '+' : ''}
                      {totalProfitLoss.percent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Your Stocks</h3>
              {portfolio.portfolioItems.length === 0 ? (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-3">You don't own any stocks yet.</p>
                  <Link 
                    href="/stocks" 
                    className="px-4 py-2 green-bg text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Browse Stocks
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="p-3 text-gray-600">Symbol</th>
                        <th className="p-3 text-gray-600">Name</th>
                        <th className="p-3 text-gray-600 text-right">Shares</th>
                        <th className="p-3 text-gray-600 text-right">Avg. Cost</th>
                        <th className="p-3 text-gray-600 text-right">Current Price</th>
                        <th className="p-3 text-gray-600 text-right">Market Value</th>
                        <th className="p-3 text-gray-600 text-right">Profit/Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.portfolioItems.map((item) => {
                        const profitLoss = calculateStockProfitLoss(item);
                        const isStockProfit = profitLoss.value >= 0;
                        
                        return (
                          <tr key={item.symbol} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-medium">
                              <Link href={`/stocks/${item.symbol}`} className="text-blue-600 hover:underline">
                                {item.symbol}
                              </Link>
                            </td>
                            <td className="p-3">{item.name}</td>
                            <td className="p-3 text-right">{item.shares}</td>
                            <td className="p-3 text-right">{formatCurrency(item.averageCost)}</td>
                            <td className="p-3 text-right">{formatCurrency(item.currentPrice)}</td>
                            <td className="p-3 text-right">{formatCurrency(item.shares * item.currentPrice)}</td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end">
                                {isStockProfit ? (
                                  <ArrowUpIcon className="h-4 w-4 green-text mr-1" />
                                ) : (
                                  <ArrowDownIcon className="h-4 w-4 red-text mr-1" />
                                )}
                                <span className={isStockProfit ? 'green-text' : 'red-text'}>
                                  {formatCurrency(Math.abs(profitLoss.value))} ({isStockProfit ? '+' : ''}
                                  {profitLoss.percent.toFixed(2)}%)
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Initial Investment</p>
                <p className="text-xl font-bold">$10,000.00</p>
              </div>
              <Link 
                href="/stocks" 
                className="px-4 py-2 green-bg text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                Trade Stocks
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="p-5 text-center">
          <p className="text-gray-600 mb-3">Failed to load portfolio data.</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
