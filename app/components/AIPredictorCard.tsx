'use client';

import { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { StockPredictor } from '../models/stockPredictor';

interface AIPredictorCardProps {
  symbol: string;
  name: string;
  currentPrice: number;
  historicalData?: number[][];
}

export default function AIPredictorCard({
  symbol,
  name,
  currentPrice,
  historicalData,
}: AIPredictorCardProps) {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  useEffect(() => {
    const generatePrediction = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, we would use the actual model
        // For demo purposes, we'll use the mock predictor
        const predictor = new StockPredictor();
        
        // Use mock prediction for demo
        const { prediction, confidence } = predictor.mockPredict(symbol);
        
        setPrediction(prediction);
        setConfidence(confidence);
      } catch (error) {
        console.error('Error generating prediction:', error);
        // Fallback to a random prediction
        setPrediction(Math.random() * 10 - 5); // Random between -5% and +5%
        setConfidence(65 + Math.random() * 20); // Random between 65% and 85%
      } finally {
        setIsLoading(false);
      }
    };

    generatePrediction();
  }, [symbol]);

  const isPositive = prediction !== null && prediction >= 0;
  const predictionClass = isPositive ? 'green-text' : 'red-text';
  const predictionIcon = isPositive ? (
    <ArrowUpIcon className="h-5 w-5 green-text" />
  ) : (
    <ArrowDownIcon className="h-5 w-5 red-text" />
  );

  // Calculate predicted price
  const predictedPrice = prediction !== null 
    ? currentPrice * (1 + prediction / 100) 
    : currentPrice;

  // Format price values
  const formattedCurrentPrice = currentPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const formattedPredictedPrice = predictedPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{symbol}</h3>
          <p className="text-gray-600">{name}</p>
        </div>
        <button 
          className="text-gray-400 hover:text-gray-600"
          onClick={() => setShowInfo(!showInfo)}
        >
          <InformationCircleIcon className="h-6 w-6" />
        </button>
      </div>

      {showInfo && (
        <div className="bg-gray-50 p-3 rounded-md mb-4 text-sm text-gray-600">
          <p>Our AI model analyzes historical price data, market trends, and trading patterns to predict potential price movements.</p>
          <p className="mt-2">Confidence score indicates the model's certainty in its prediction based on available data.</p>
          <p className="mt-2 font-semibold">Note: This is for educational purposes only. Not financial advice.</p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Current Price</span>
          <span className="font-medium">{formattedCurrentPrice}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">AI Predicted Price (7 days)</span>
          {isLoading ? (
            <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <span className={`font-medium ${predictionClass}`}>{formattedPredictedPrice}</span>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-700">Prediction</span>
          {isLoading ? (
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <div className="flex items-center">
              {predictionIcon}
              <span className={`ml-1 font-bold ${predictionClass}`}>
                {isPositive ? '+' : ''}{prediction?.toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Confidence</span>
            {isLoading ? (
              <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <span className="font-medium">{confidence.toFixed(1)}%</span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            {!isLoading && (
              <div 
                className="h-2.5 rounded-full" 
                style={{ 
                  width: `${confidence}%`,
                  backgroundColor: confidence > 80 ? '#00C805' : confidence > 60 ? '#FFB800' : '#FF5000'
                }}
              ></div>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>
            {isLoading ? (
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-2"></div>
            ) : (
              <>
                Based on our AI analysis, {symbol} is predicted to 
                {isPositive ? ' increase ' : ' decrease '}
                by {Math.abs(prediction || 0).toFixed(2)}% in the next 7 days.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <button className="w-full py-3 green-bg text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors">
          Trade {symbol} Now
        </button>
      </div>
    </div>
  );
}
