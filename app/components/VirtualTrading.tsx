'use client';

import { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { VirtualTradingSimulator, UserPortfolio, PortfolioItem } from '../lib/virtualTrading';

interface VirtualTradingProps {
  userId: string;
  symbol: string;
  name: string;
  currentPrice: number;
}

export default function VirtualTrading({
  userId,
  symbol,
  name,
  currentPrice,
}: VirtualTradingProps) {
  const [shares, setShares] = useState<number>(1);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Create an instance of the virtual trading simulator
  const tradingSimulator = new VirtualTradingSimulator();

  // Load user portfolio
  const loadPortfolio = async () => {
    setIsLoading(true);
    try {
      // In a real app, we would fetch from Firebase
      // For demo purposes, we'll use the mock portfolio
      const userPortfolio = tradingSimulator.getMockPortfolio(userId);
      setPortfolio(userPortfolio);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setMessage({
        text: 'Failed to load portfolio. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the total cost of the trade
  const calculateTotal = () => {
    return shares * currentPrice;
  };

  // Execute the trade
  const executeTrade = async () => {
    if (!portfolio) {
      setMessage({
        text: 'Portfolio not loaded. Please try again.',
        type: 'error',
      });
      return;
    }

    if (shares <= 0) {
      setMessage({
        text: 'Please enter a valid number of shares.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    try {
      let result;

      if (tradeType === 'buy') {
        // Check if user has enough cash
        if (portfolio.cash < calculateTotal()) {
          setMessage({
            text: 'Insufficient funds for this transaction.',
            type: 'error',
          });
          setIsLoading(false);
          return;
        }

        // In a real app, we would call the actual method
        // For demo purposes, we'll simulate a successful trade
        result = {
          success: true,
          message: `Successfully purchased ${shares} shares of ${symbol}`,
        };

        // Update the portfolio (simulated)
        const updatedPortfolio = { ...portfolio };
        updatedPortfolio.cash -= calculateTotal();

        // Find if stock already exists in portfolio
        const existingItemIndex = updatedPortfolio.portfolioItems.findIndex(
          (item) => item.symbol === symbol
        );

        if (existingItemIndex >= 0) {
          // Update existing position
          const existingItem = updatedPortfolio.portfolioItems[existingItemIndex];
          const totalShares = existingItem.shares + shares;
          const totalCostBasis = existingItem.shares * existingItem.averageCost + calculateTotal();
          const newAverageCost = totalCostBasis / totalShares;

          updatedPortfolio.portfolioItems[existingItemIndex] = {
            ...existingItem,
            shares: totalShares,
            averageCost: newAverageCost,
            currentPrice: currentPrice,
          };
        } else {
          // Add new position
          updatedPortfolio.portfolioItems.push({
            symbol,
            name,
            shares,
            averageCost: currentPrice,
            currentPrice,
          });
        }

        setPortfolio(updatedPortfolio);
      } else {
        // Find stock in portfolio
        const existingItemIndex = portfolio.portfolioItems.findIndex(
          (item) => item.symbol === symbol
        );

        if (existingItemIndex < 0) {
          setMessage({
            text: `You don't own any shares of ${symbol}`,
            type: 'error',
          });
          setIsLoading(false);
          return;
        }

        const existingItem = portfolio.portfolioItems[existingItemIndex];

        // Check if user has enough shares
        if (existingItem.shares < shares) {
          setMessage({
            text: `You only have ${existingItem.shares} shares of ${symbol}`,
            type: 'error',
          });
          setIsLoading(false);
          return;
        }

        // In a real app, we would call the actual method
        // For demo purposes, we'll simulate a successful trade
        result = {
          success: true,
          message: `Successfully sold ${shares} shares of ${symbol}`,
        };

        // Update the portfolio (simulated)
        const updatedPortfolio = { ...portfolio };
        updatedPortfolio.cash += calculateTotal();

        // Update shares
        if (existingItem.shares === shares) {
          // Remove stock from portfolio if selling all shares
          updatedPortfolio.portfolioItems = updatedPortfolio.portfolioItems.filter(
            (item) => item.symbol !== symbol
          );
        } else {
          // Update shares if selling partial position
          updatedPortfolio.portfolioItems[existingItemIndex] = {
            ...existingItem,
            shares: existingItem.shares - shares,
            currentPrice: currentPrice,
          };
        }

        setPortfolio(updatedPortfolio);
      }

      setMessage({
        text: result.message,
        type: 'success',
      });

      // Reset shares to 1 after successful trade
      setShares(1);
    } catch (error) {
      console.error('Error executing trade:', error);
      setMessage({
        text: 'Failed to execute trade. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  // Load portfolio on component mount
  if (!portfolio && !isLoading) {
    loadPortfolio();
  }

  // Find if user owns this stock
  const ownedStock = portfolio?.portfolioItems.find((item) => item.symbol === symbol);
  const sharesOwned = ownedStock?.shares || 0;
  const averageCost = ownedStock?.averageCost || 0;

  // Calculate profit/loss if user owns the stock
  const profitLoss = sharesOwned > 0 ? (currentPrice - averageCost) * sharesOwned : 0;
  const profitLossPercent = sharesOwned > 0 ? ((currentPrice - averageCost) / averageCost) * 100 : 0;
  const isProfit = profitLoss >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <h3 className="text-xl font-bold mb-4">Virtual Trading</h3>

      {message && (
        <div
          className={`p-3 rounded-md mb-4 ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : message.type === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Current Price</span>
          <span className="font-medium">{formatCurrency(currentPrice)}</span>
        </div>
        {portfolio && (
          <div className="flex justify-between">
            <span className="text-gray-600">Available Cash</span>
            <span className="font-medium">{formatCurrency(portfolio.cash)}</span>
          </div>
        )}
      </div>

      {sharesOwned > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium text-gray-700 mb-2">Your Position</h4>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Shares Owned</span>
            <span className="font-medium">{sharesOwned}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Average Cost</span>
            <span className="font-medium">{formatCurrency(averageCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Profit/Loss</span>
            <div className="flex items-center">
              {isProfit ? (
                <ArrowUpIcon className="h-4 w-4 green-text mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 red-text mr-1" />
              )}
              <span className={isProfit ? 'green-text font-medium' : 'red-text font-medium'}>
                {formatCurrency(Math.abs(profitLoss))} ({isProfit ? '+' : '-'}
                {Math.abs(profitLossPercent).toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex space-x-2 mb-4">
          <button
            className={`flex-1 py-2 rounded-md font-medium ${
              tradeType === 'buy'
                ? 'green-bg text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTradeType('buy')}
          >
            Buy
          </button>
          <button
            className={`flex-1 py-2 rounded-md font-medium ${
              tradeType === 'sell'
                ? 'red-bg text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setTradeType('sell')}
            disabled={sharesOwned === 0}
          >
            Sell
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Number of Shares</label>
          <div className="flex items-center">
            <button
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-md hover:bg-gray-300"
              onClick={() => setShares(Math.max(1, shares - 1))}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 0))}
              className="flex-1 text-center py-2 border-t border-b border-gray-300 focus:outline-none"
            />
            <button
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-md hover:bg-gray-300"
              onClick={() => setShares(shares + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Total</span>
            <span className="font-bold">{formatCurrency(calculateTotal())}</span>
          </div>
        </div>

        <button
          className={`w-full py-3 text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors ${
            tradeType === 'buy' ? 'green-bg' : 'red-bg'
          }`}
          onClick={executeTrade}
          disabled={isLoading || (tradeType === 'sell' && sharesOwned === 0)}
        >
          {isLoading
            ? 'Processing...'
            : tradeType === 'buy'
            ? `Buy ${shares} ${shares === 1 ? 'Share' : 'Shares'}`
            : `Sell ${shares} ${shares === 1 ? 'Share' : 'Shares'}`}
        </button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        <p>This is a virtual trading simulator. No real money is involved.</p>
        <p>Practice trading with $10,000 in virtual cash.</p>
      </div>
    </div>
  );
}
