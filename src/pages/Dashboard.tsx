import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Euro, PoundSterling, IndianRupee, JapaneseYen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CurrencySelector from '@/components/CurrencySelector';
import TransactionForm from '@/components/TransactionForm';
import OverviewTab from '@/components/OverviewTab';
import TransactionsTab from '@/components/TransactionsTab';
import BudgetTab from '@/components/BudgetTab';
import { formatAmount as formatAmountUtil, filterTransactionsByTimePeriod } from '@/utils/currency';

// Define currency interface for type safety
interface CurrencyInfo {
  symbol: string;
  code: string;
  name: string;
  icon: React.ReactNode;
  rate: number; // Exchange rate relative to USD
}

// Define transaction interface for type safety
interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category?: string;
  type?: 'expense' | 'income';
}

// Define goal interface for type safety
interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  color: string;
}


// Define budget interface
interface Budget {
  id: number;
  category: string;
  amount: number;
  month: string;
  spent: number;
}

// Currency options
const currencies: Record<string, CurrencyInfo> = {
  USD: { 
    symbol: '$', 
    code: 'USD', 
    name: 'US Dollar', 
    icon: <DollarSign size={16} />, 
    rate: 1 
  },
  EUR: { 
    symbol: '€', 
    code: 'EUR', 
    name: 'Euro', 
    icon: <Euro size={16} />, 
    rate: 0.93 
  },
  GBP: { 
    symbol: '£', 
    code: 'GBP', 
    name: 'British Pound', 
    icon: <PoundSterling size={16} />, 
    rate: 0.79 
  },
  INR: { 
    symbol: '₹', 
    code: 'INR', 
    name: 'Indian Rupee', 
    icon: <IndianRupee size={16} />, 
    rate: 83.45 
  },
  JPY: { 
    symbol: '¥', 
    code: 'JPY', 
    name: 'Japanese Yen', 
    icon: <JapaneseYen size={16} />, 
    rate: 157.23 
  }
};

// Mock data for charts
const expenseData = [
  { name: 'Food', value: 35, color: '#9b87f5' },
  { name: 'Rent', value: 30, color: '#D946EF' },
  { name: 'Shopping', value: 15, color: '#1EAEDB' },
  { name: 'Transport', value: 10, color: '#F97316' },
  { name: 'Other', value: 10, color: '#10B981' },
];

const trendData = [
  { name: 'Jan', expenses: 2400, income: 4000 },
  { name: 'Feb', expenses: 1398, income: 3000 },
  { name: 'Mar', expenses: 9800, income: 5000 },
  { name: 'Apr', expenses: 3908, income: 4780 },
  { name: 'May', expenses: 4800, income: 4900 },
  { name: 'Jun', expenses: 3800, income: 5200 },
];

// Updated unassigned transactions to include category and type properties
const unassignedTransactions: Transaction[] = [
  { id: 1, date: '2023-05-01', description: 'Merchant 1', amount: 45.99, category: '', type: 'expense' },
  { id: 2, date: '2023-05-02', description: 'Merchant 2', amount: 122.00, category: '', type: 'expense' },
  { id: 3, date: '2023-05-03', description: 'Merchant 3', amount: 12.49, category: '', type: 'expense' },
];

const financialGoals: Goal[] = [
  { id: 1, name: 'Emergency Fund', target: 5000, current: 2500, color: '#9b87f5' },
  { id: 2, name: 'Vacation', target: 2000, current: 800, color: '#D946EF' },
  { id: 3, name: 'New Laptop', target: 1500, current: 1200, color: '#1EAEDB' },
];

const categories = [
  'Food', 'Rent', 'Shopping', 'Transport', 'Entertainment', 'Bills', 'Other'
];

// Sample transaction history
const transactionHistory: Transaction[] = [
  { id: 4, date: '2023-06-01', description: 'Grocery Store', amount: 78.45, category: 'Food', type: 'expense' },
  { id: 5, date: '2023-06-02', description: 'Monthly Rent', amount: 950.00, category: 'Rent', type: 'expense' },
  { id: 6, date: '2023-06-03', description: 'Salary Deposit', amount: 3200.00, category: 'Income', type: 'income' },
  { id: 7, date: '2023-06-04', description: 'Coffee Shop', amount: 5.75, category: 'Food', type: 'expense' },
  { id: 8, date: '2023-06-05', description: 'Gas Station', amount: 45.30, category: 'Transport', type: 'expense' },
  { id: 9, date: '2023-06-10', description: 'Online Shopping', amount: 124.99, category: 'Shopping', type: 'expense' },
  { id: 10, date: '2023-06-15', description: 'Side Gig Payment', amount: 350.00, category: 'Income', type: 'income' },
  { id: 11, date: '2023-06-18', description: 'Electric Bill', amount: 89.50, category: 'Bills', type: 'expense' },
  { id: 12, date: '2023-06-20', description: 'Restaurant Dinner', amount: 67.80, category: 'Food', type: 'expense' },
  { id: 13, date: '2023-06-25', description: 'Movie Tickets', amount: 24.00, category: 'Entertainment', type: 'expense' },
];

// Mock initial budgets
const initialBudgets: Budget[] = [
  { 
    id: 1, 
    category: 'Food', 
    amount: 500, 
    month: new Date().toISOString().substring(0, 7), 
    spent: 400 
  },
  { 
    id: 2, 
    category: 'Transport', 
    amount: 200, 
    month: new Date().toISOString().substring(0, 7), 
    spent: 170 
  },
];

// Category colors
const categoryColors: Record<string, string> = {
  'Food': '#9b87f5',
  'Rent': '#D946EF',
  'Shopping': '#1EAEDB',
  'Transport': '#F97316',
  'Entertainment': '#10B981',
  'Bills': '#0EA5E9',
  'Other': '#8E9196',
};

// Dashboard component
const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(unassignedTransactions);
  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : financialGoals;
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([...transactionHistory, ...unassignedTransactions]);
  const [timeFilter, setTimeFilter] = useState<'all' | '7days' | '1month'>('all');
  const [currency, setCurrency] = useState<string>('USD');
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    // Try to get budgets from localStorage first
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : initialBudgets;
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const currentMonth = new Date().toISOString().substring(0, 7);
  
  const handleDeleteBudget = (id: number) => { ///delete budget
      setBudgets(prev => prev.filter(b => b.id !== id));
    };
  // Format amount with currency symbol using our util function
  const formatAmount = (amount: number): string => {
    return formatAmountUtil(
      amount, 
      currencies[currency].symbol,
      currencies[currency].code,
      currencies[currency].rate
    );
  };

  // Update budget spent amounts when transactions change
  useEffect(() => {
    const updatedBudgets = budgets.map(budget => {
      // Filter transactions for this budget's category and month
      const relevantTransactions = allTransactions.filter(transaction => {
        const transactionMonth = transaction.date.substring(0, 7);
        return (
          transaction.category === budget.category && 
          transactionMonth === budget.month && 
          transaction.type === 'expense'
        );
      });
      
      // Calculate total spent
      const spent = relevantTransactions.reduce((total, t) => total + t.amount, 0);
      
      return { ...budget, spent };
    });
    
    setBudgets(updatedBudgets);
    
    // Save budgets to localStorage
    localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
    
    // Check for budgets nearing limits and show alerts
    updatedBudgets.forEach(budget => {
      const percentSpent = (budget.spent / budget.amount) * 100;
      
      if (percentSpent >= 90 && percentSpent < 100) {
        toast({
          title: "Budget Alert",
          description: `You've used ${percentSpent.toFixed(0)}% of your ${budget.category} budget for ${budget.month}`,
          variant: "default",
        });
      } else if (percentSpent >= 100) {
        toast({
          title: "Budget Exceeded",
          description: `You've exceeded your ${budget.category} budget for ${budget.month} by ${formatAmount(budget.spent - budget.amount)}`,
          variant: "destructive",
        });
      }
    });
  }, [allTransactions]);
  
  // Save goals to localStorage when they change
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);
  
  const handleCategorizeTransaction = (id: number, category: string) => {
    if (!category) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }
    
    // Update the transaction with the new category
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...t, category } : t
    );
    
    // Remove the categorized transaction from the uncategorized list
    setTransactions(updatedTransactions.filter(t => t.id !== id || t.category === ''));
    
    // Update the transaction in the allTransactions list
    setAllTransactions(allTransactions.map(t => 
      t.id === id ? { ...t, category } : t
    ));
    
    toast({
      title: "Transaction categorized",
      description: `Transaction has been categorized as ${category}`,
    });
  };
  
  const contributeToGoal = (id: number, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, current: Math.min(goal.current + amount, goal.target) } : goal
    ));
    
    toast({
      title: "Contribution added",
      description: `${formatAmount(amount)} has been added to your goal`,
    });
  };
  
  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    const newId = allTransactions.length > 0 ? Math.max(...allTransactions.map(t => t.id)) + 1 : 1;
    
    const transactionToAdd: Transaction = {
      id: newId,
      ...transaction
    };
    
    setAllTransactions([...allTransactions, transactionToAdd]);
    
    // Also add to regular transactions if it's uncategorized
    if (!transaction.category) {
      setTransactions([...transactions, transactionToAdd]);
    }
    
    toast({
      title: "Transaction added",
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of ${formatAmount(transaction.amount)} has been added`,
    });
  };
  
  // Handle adding a new budget
  const handleAddBudget = (newBudget: Omit<Budget, "id" | "spent">) => {
    const newId = budgets.length > 0 ? Math.max(...budgets.map(b => b.id)) + 1 : 1;
    
    // Calculate initial spent amount based on existing transactions
    const relevantTransactions = allTransactions.filter(transaction => {
      const transactionMonth = transaction.date.substring(0, 7);
      return (
        transaction.category === newBudget.category && 
        transactionMonth === newBudget.month && 
        transaction.type === 'expense'
      );
    });
    
    const spent = relevantTransactions.reduce((total, t) => total + t.amount, 0);
    
    const budgetToAdd: Budget = {
      id: newId,
      category: newBudget.category,
      amount: newBudget.amount,
      month: newBudget.month,
      spent: spent
    };
    
    const updatedBudgets = [...budgets, budgetToAdd];
    setBudgets(updatedBudgets);
    // Save budgets to localStorage
    localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
  };
  
  // Get filtered transactions based on time period
  const filteredTransactions = filterTransactionsByTimePeriod(allTransactions, timeFilter);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold neon-text">Dashboard</h1>
            
            <div className="flex items-center gap-3">
              {/* Currency Selector */}
              <CurrencySelector 
                currencies={currencies}
                currentCurrency={currency}
                onCurrencyChange={setCurrency}
              />
              
              {/* Transaction Form */}
              <TransactionForm 
                onAddTransaction={handleAddTransaction}
                categories={categories}
                currencies={currencies}
                currentCurrency={currency}
              />
            </div>
          </div>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              
            

            {/* Tab Content */}
            <TabsContent value="overview">
              <OverviewTab 
                expenseData={expenseData}
                trendData={trendData}
                transactions={transactions}
                goals={goals}
                formatAmount={formatAmount}
                onCategorizeTransaction={handleCategorizeTransaction}
                onContributeToGoal={contributeToGoal}
              />
            </TabsContent>
                
            <TabsContent value="transactions">
              <TransactionsTab 
                transactions={filteredTransactions}
                timeFilter={timeFilter}
                onTimeFilterChange={setTimeFilter}
                formatAmount={formatAmount}
              />
            </TabsContent>
                
            <TabsContent value="budgets">
              <BudgetTab 
                budgets={budgets}
                currentMonth={currentMonth}
                formatAmount={formatAmount}
                onAddBudget={handleAddBudget}
                onDeleteBudget={handleDeleteBudget} //delete budget
                currencies={currencies}
                currentCurrency={currency}
                categoryColors={categoryColors}
              />
            </TabsContent>
          </Tabs>
            
          {/* Other tabs */}
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
