import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';

// Interface for portfolio item
export interface PortfolioItem {
  symbol: string;
  name: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
}

// Interface for user portfolio
export interface UserPortfolio {
  userId: string;
  cash: number;
  totalValue: number;
  portfolioItems: PortfolioItem[];
  lastUpdated: Date;
}

// Interface for transaction
export interface Transaction {
  userId: string;
  symbol: string;
  name: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  timestamp: Date;
}

// Class for virtual trading functionality
export class VirtualTradingSimulator {
  private readonly INITIAL_BALANCE = 10000; // $10,000 starting balance
  
  // Initialize a new user portfolio
  async initializePortfolio(userId: string): Promise<UserPortfolio> {
    const portfolioRef = doc(db, 'portfolios', userId);
    const portfolioSnapshot = await getDoc(portfolioRef);
    
    if (!portfolioSnapshot.exists()) {
      const newPortfolio: UserPortfolio = {
        userId,
        cash: this.INITIAL_BALANCE,
        totalValue: this.INITIAL_BALANCE,
        portfolioItems: [],
        lastUpdated: new Date(),
      };
      
      await setDoc(portfolioRef, newPortfolio);
      return newPortfolio;
    }
    
    return portfolioSnapshot.data() as UserPortfolio;
  }
  
  // Get user portfolio
  async getPortfolio(userId: string): Promise<UserPortfolio> {
    const portfolioRef = doc(db, 'portfolios', userId);
    const portfolioSnapshot = await getDoc(portfolioRef);
    
    if (!portfolioSnapshot.exists()) {
      return this.initializePortfolio(userId);
    }
    
    return portfolioSnapshot.data() as UserPortfolio;
  }
  
  // Buy stock
  async buyStock(
    userId: string, 
    symbol: string, 
    name: string, 
    shares: number, 
    price: number
  ): Promise<{ success: boolean; message: string }> {
    const totalCost = shares * price;
    const portfolio = await this.getPortfolio(userId);
    
    // Check if user has enough cash
    if (portfolio.cash < totalCost) {
      return { 
        success: false, 
        message: 'Insufficient funds for this transaction' 
      };
    }
    
    // Update portfolio
    const portfolioRef = doc(db, 'portfolios', userId);
    
    // Find if stock already exists in portfolio
    const existingItemIndex = portfolio.portfolioItems.findIndex(
      item => item.symbol === symbol
    );
    
    if (existingItemIndex >= 0) {
      // Update existing position
      const existingItem = portfolio.portfolioItems[existingItemIndex];
      const totalShares = existingItem.shares + shares;
      const totalCostBasis = (existingItem.shares * existingItem.averageCost) + totalCost;
      const newAverageCost = totalCostBasis / totalShares;
      
      portfolio.portfolioItems[existingItemIndex] = {
        ...existingItem,
        shares: totalShares,
        averageCost: newAverageCost,
        currentPrice: price,
      };
    } else {
      // Add new position
      portfolio.portfolioItems.push({
        symbol,
        name,
        shares,
        averageCost: price,
        currentPrice: price,
      });
    }
    
    // Update cash and total value
    portfolio.cash -= totalCost;
    portfolio.totalValue = this.calculateTotalValue(portfolio);
    portfolio.lastUpdated = new Date();
    
    // Save updated portfolio
    await updateDoc(portfolioRef, portfolio);
    
    // Record transaction
    const transaction: Transaction = {
      userId,
      symbol,
      name,
      type: 'buy',
      shares,
      price,
      total: totalCost,
      timestamp: new Date(),
    };
    
    await this.recordTransaction(transaction);
    
    return { 
      success: true, 
      message: `Successfully purchased ${shares} shares of ${symbol}` 
    };
  }
  
  // Sell stock
  async sellStock(
    userId: string, 
    symbol: string, 
    name: string, 
    shares: number, 
    price: number
  ): Promise<{ success: boolean; message: string }> {
    const portfolio = await this.getPortfolio(userId);
    
    // Find stock in portfolio
    const existingItemIndex = portfolio.portfolioItems.findIndex(
      item => item.symbol === symbol
    );
    
    if (existingItemIndex < 0) {
      return { 
        success: false, 
        message: `You don't own any shares of ${symbol}` 
      };
    }
    
    const existingItem = portfolio.portfolioItems[existingItemIndex];
    
    // Check if user has enough shares
    if (existingItem.shares < shares) {
      return { 
        success: false, 
        message: `You only have ${existingItem.shares} shares of ${symbol}` 
      };
    }
    
    const totalValue = shares * price;
    const portfolioRef = doc(db, 'portfolios', userId);
    
    // Update shares
    if (existingItem.shares === shares) {
      // Remove stock from portfolio if selling all shares
      portfolio.portfolioItems = portfolio.portfolioItems.filter(
        item => item.symbol !== symbol
      );
    } else {
      // Update shares if selling partial position
      portfolio.portfolioItems[existingItemIndex] = {
        ...existingItem,
        shares: existingItem.shares - shares,
        currentPrice: price,
      };
    }
    
    // Update cash and total value
    portfolio.cash += totalValue;
    portfolio.totalValue = this.calculateTotalValue(portfolio);
    portfolio.lastUpdated = new Date();
    
    // Save updated portfolio
    await updateDoc(portfolioRef, portfolio);
    
    // Record transaction
    const transaction: Transaction = {
      userId,
      symbol,
      name,
      type: 'sell',
      shares,
      price,
      total: totalValue,
      timestamp: new Date(),
    };
    
    await this.recordTransaction(transaction);
    
    return { 
      success: true, 
      message: `Successfully sold ${shares} shares of ${symbol}` 
    };
  }
  
  // Record a transaction
  private async recordTransaction(transaction: Transaction): Promise<void> {
    const transactionsRef = collection(db, 'transactions');
    await setDoc(doc(transactionsRef), transaction);
  }
  
  // Get user transactions
  async getTransactions(userId: string): Promise<Transaction[]> {
    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef, 
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const transactions: Transaction[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Transaction;
      if (data.userId === userId) {
        transactions.push(data);
      }
    });
    
    return transactions;
  }
  
  // Update portfolio with current prices
  async updatePortfolio(
    userId: string, 
    priceUpdates: { symbol: string; price: number }[]
  ): Promise<UserPortfolio> {
    const portfolio = await this.getPortfolio(userId);
    
    // Update prices for each stock
    portfolio.portfolioItems = portfolio.portfolioItems.map(item => {
      const update = priceUpdates.find(u => u.symbol === item.symbol);
      if (update) {
        return { ...item, currentPrice: update.price };
      }
      return item;
    });
    
    // Recalculate total value
    portfolio.totalValue = this.calculateTotalValue(portfolio);
    portfolio.lastUpdated = new Date();
    
    // Save updated portfolio
    const portfolioRef = doc(db, 'portfolios', userId);
    await updateDoc(portfolioRef, portfolio);
    
    return portfolio;
  }
  
  // Calculate total portfolio value
  private calculateTotalValue(portfolio: UserPortfolio): number {
    const stocksValue = portfolio.portfolioItems.reduce(
      (total, item) => total + (item.shares * item.currentPrice), 
      0
    );
    
    return portfolio.cash + stocksValue;
  }
  
  // Get leaderboard
  async getLeaderboard(limit: number = 10): Promise<{ userId: string; totalValue: number }[]> {
    const portfoliosRef = collection(db, 'portfolios');
    const q = query(
      portfoliosRef, 
      orderBy('totalValue', 'desc'), 
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const leaderboard: { userId: string; totalValue: number }[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as UserPortfolio;
      leaderboard.push({
        userId: data.userId,
        totalValue: data.totalValue,
      });
    });
    
    return leaderboard;
  }
  
  // Mock portfolio for development
  getMockPortfolio(userId: string): UserPortfolio {
    return {
      userId,
      cash: 5432.10,
      totalValue: 12345.67,
      portfolioItems: [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          shares: 10,
          averageCost: 175.50,
          currentPrice: 187.32,
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          shares: 5,
          averageCost: 410.25,
          currentPrice: 420.45,
        },
        {
          symbol: 'TSLA',
          name: 'Tesla, Inc.',
          shares: 8,
          averageCost: 220.75,
          currentPrice: 215.75,
        },
      ],
      lastUpdated: new Date(),
    };
  }
  
  // Mock leaderboard for development
  getMockLeaderboard(): { userId: string; totalValue: number }[] {
    return [
      { userId: 'user1', totalValue: 15432.10 },
      { userId: 'user2', totalValue: 14321.20 },
      { userId: 'user3', totalValue: 13210.30 },
      { userId: 'user4', totalValue: 12109.40 },
      { userId: 'user5', totalValue: 11098.50 },
    ];
  }
}
