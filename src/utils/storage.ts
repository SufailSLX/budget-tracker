// Local storage utilities for the credit tracker

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "credit" | "expense";
  category: string;
  date: string;
  createdAt: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}

const STORAGE_KEYS = {
  TRANSACTIONS: 'credit_tracker_transactions',
  USER: 'credit_tracker_user',
  CATEGORIES: 'credit_tracker_categories'
};

// Transaction Management
export const getTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (data) {
      return JSON.parse(data);
    } else {
      // Initialize with sample data for demo
      const sampleTransactions = generateSampleData();
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(sampleTransactions));
      return sampleTransactions;
    }
  } catch {
    return [];
  }
};

export const saveTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now()
  };
  
  transactions.unshift(newTransaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  return newTransaction;
};

export const deleteTransaction = (id: string): void => {
  const transactions = getTransactions().filter(tx => tx.id !== id);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

// User Management
export const getUser = (): User | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveUser = (user: Omit<User, 'id' | 'createdAt'>): User => {
  const newUser: User = {
    ...user,
    id: `user_${Date.now()}`,
    createdAt: Date.now()
  };
  
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  return newUser;
};

// Categories Management
export const getCategories = (): string[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Health & Fitness',
      'Travel',
      'Education',
      'Salary',
      'Freelance',
      'Investment',
      'Other'
    ];
  } catch {
    return ['Food & Dining', 'Transportation', 'Shopping', 'Other'];
  }
};

export const saveCategories = (categories: string[]): void => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

// Analytics
export const getMonthlyData = () => {
  const transactions = getTransactions();
  const last6Months = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime();
    
    const monthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date).getTime();
      return txDate >= monthStart && txDate <= monthEnd;
    });
    
    const credits = monthTransactions
      .filter(tx => tx.type === 'credit')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const expenses = monthTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    last6Months.push({
      name: monthName,
      credits,
      expenses
    });
  }
  
  return last6Months;
};

// Generate sample data for demo
const generateSampleData = (): Transaction[] => {
  const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Salary', 'Freelance'];
  const sampleData: Transaction[] = [];
  
  // Generate transactions for the last 3 months
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    const isCredit = Math.random() > 0.7; // 30% chance of credit
    const amount = isCredit 
      ? Math.floor(Math.random() * 3000) + 1000 // Credits: $1000-$4000
      : Math.floor(Math.random() * 500) + 20;   // Expenses: $20-$520
    
    const creditTitles = ['Salary Payment', 'Freelance Project', 'Investment Return', 'Bonus', 'Refund'];
    const expenseTitles = ['Grocery Shopping', 'Gas Station', 'Restaurant', 'Movie Tickets', 'Coffee Shop', 'Online Purchase'];
    
    sampleData.push({
      id: `sample_${i}`,
      title: isCredit 
        ? creditTitles[Math.floor(Math.random() * creditTitles.length)]
        : expenseTitles[Math.floor(Math.random() * expenseTitles.length)],
      amount,
      type: isCredit ? 'credit' : 'expense',
      category: categories[Math.floor(Math.random() * categories.length)],
      date: date.toISOString().split('T')[0],
      createdAt: date.getTime()
    });
  }
  
  return sampleData.sort((a, b) => b.createdAt - a.createdAt);
};

export const getStats = () => {
  const transactions = getTransactions();
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  
  const currentMonthTx = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
  });
  
  const lastMonthTx = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === lastMonth.getMonth() && txDate.getFullYear() === lastMonth.getFullYear();
  });
  
  const currentCredits = currentMonthTx.filter(tx => tx.type === 'credit').reduce((sum, tx) => sum + tx.amount, 0);
  const currentExpenses = currentMonthTx.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
  const currentBalance = currentCredits - currentExpenses;
  
  const lastCredits = lastMonthTx.filter(tx => tx.type === 'credit').reduce((sum, tx) => sum + tx.amount, 0);
  const lastExpenses = lastMonthTx.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
  const lastBalance = lastCredits - lastExpenses;
  
  const creditChange = lastCredits === 0 ? 100 : ((currentCredits - lastCredits) / lastCredits) * 100;
  const expenseChange = lastExpenses === 0 ? 100 : ((currentExpenses - lastExpenses) / lastExpenses) * 100;
  const balanceChange = lastBalance === 0 ? 100 : ((currentBalance - lastBalance) / Math.abs(lastBalance)) * 100;
  
  return {
    totalCredits: { value: currentCredits, change: Math.round(creditChange) },
    totalExpenses: { value: currentExpenses, change: Math.round(expenseChange) },
    balance: { value: currentBalance, change: Math.round(balanceChange) }
  };
};