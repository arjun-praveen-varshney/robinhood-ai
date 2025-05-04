import axios from 'axios';

// Alpha Vantage API key - you'll need to get one from https://www.alphavantage.co/
const ALPHA_VANTAGE_API_KEY = 'demo'; // Replace with your actual API key

// Base URL for Alpha Vantage API
const BASE_URL = 'https://www.alphavantage.co/query';

// Function to fetch stock data
export const fetchStockData = async (symbol: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

// Function to fetch historical data for a stock
export const fetchHistoricalData = async (symbol: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        outputsize: 'compact',
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

// Function to search for stocks
export const searchStocks = async (keywords: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
};

// Mock data for development (in case API calls are limited)
export const mockStocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 187.32,
    change: 1.25,
    changePercent: 0.67,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 420.45,
    change: 2.15,
    changePercent: 0.51,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 176.89,
    change: -0.75,
    changePercent: -0.42,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 182.50,
    change: 1.50,
    changePercent: 0.83,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 215.75,
    change: -3.25,
    changePercent: -1.48,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 485.20,
    change: 5.75,
    changePercent: 1.20,
  },
];
