'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  aiPrediction?: {
    prediction: number;
    confidence: number;
  };
}

export default function StockCard({ 
  symbol, 
  name, 
  price, 
  change, 
  changePercent,
  aiPrediction
}: StockCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'green-text' : 'red-text';
  const changeIcon = isPositive ? (
    <ArrowUpIcon className="h-4 w-4 green-text" />
  ) : (
    <ArrowDownIcon className="h-4 w-4 red-text" />
  );

  // Format price and change values
  const formattedPrice = price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  const formattedChange = Math.abs(change).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  const formattedChangePercent = `${Math.abs(changePercent).toFixed(2)}%`;

  return (
    <Link 
      href={`/stocks/${symbol}`}
      className="block"
    >
      <div 
        className="bg-white p-4 rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{symbol}</h3>
            <p className="text-gray-600 text-sm">{name}</p>
          </div>
          {aiPrediction && (
            <div className="bg-gray-100 px-2 py-1 rounded-md">
              <div className="flex items-center">
                <span className={`text-xs font-medium ${aiPrediction.prediction >= 0 ? 'green-text' : 'red-text'}`}>
                  {aiPrediction.prediction >= 0 ? '+' : ''}
                  {aiPrediction.prediction.toFixed(2)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  ({aiPrediction.confidence}% conf.)
                </span>
              </div>
              <div className="text-xs text-gray-500">AI Prediction</div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-end">
          <div className="text-lg font-semibold">{formattedPrice}</div>
          <div className="flex items-center">
            {changeIcon}
            <span className={`ml-1 ${changeColor}`}>
              {formattedChange} ({formattedChangePercent})
            </span>
          </div>
        </div>
        
        {isHovered && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button className="w-full py-2 green-bg text-white rounded-md font-medium">
              Trade
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
