import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { FiEdit2, FiX, FiCheck, FiTarget, FiTrendingUp, FiList, FiPieChart, FiPlus, FiFilter, FiSettings } from 'react-icons/fi';
import { DollarSign, Euro, PoundSterling, IndianRupee, JapaneseYen, Currency } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Navbar from '@/components/Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import BudgetForm from '@/components/BudgetForm';
import BudgetList from '@/components/BudgetList';

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
  const [editingTransaction, setEditingTransaction] = useState<number | null>(null);
  const [transactionCategory, setTransactionCategory] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>(unassignedTransactions);
  const [goals, setGoals] = useState<Goal[]>(financialGoals);
  const [activeTab, setActiveTab] = useState('overview');
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([...transactionHistory, ...unassignedTransactions]);
  const [timeFilter, setTimeFilter] = useState<'all' | '7days' | '1month'>('all');
  const [currency, setCurrency] = useState<string>('USD');
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Manual transaction state
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense' as 'expense' | 'income',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  
  const currentMonth = new Date().toISOString().substring(0, 7);
  
  // Convert amount based on selected currency
  const convertAmount = (amount: number): number => {
    return amount * currencies[currency].rate;
  };
  
  // Format amount with currency symbol
  const formatAmount = (amount: number): string => {
    const convertedAmount = convertAmount(amount);
    
    // Format with appropriate decimal places
    if (currency === 'JPY') {
      // JPY typically doesn't use decimal places
      return `${currencies[currency].symbol}${Math.round(convertedAmount)}`;
    }
    
    return `${currencies[currency].symbol}${convertedAmount.toFixed(2)}`;
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
  
  const handleCategorizeTransaction = (id: number) => {
    if (!transactionCategory) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }
    
    // Update the transaction with the new category
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...t, category: transactionCategory } : t
    );
    
    // Remove the categorized transaction from the uncategorized list
    setTransactions(updatedTransactions.filter(t => t.id !== id || t.category === ''));
    
    // Update the transaction in the allTransactions list
    setAllTransactions(allTransactions.map(t => 
      t.id === id ? { ...t, category: transactionCategory } : t
    ));
    
    setEditingTransaction(null);
    
    toast({
      title: "Transaction categorized",
      description: `Transaction has been categorized as ${transactionCategory}`,
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
  
  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    const newId = allTransactions.length > 0 ? Math.max(...allTransactions.map(t => t.id)) + 1 : 1;
    
    const transactionToAdd: Transaction = {
      id: newId,
      date: newTransaction.date,
      description: newTransaction.description,
      amount: amount,
      category: newTransaction.category,
      type: newTransaction.type
    };
    
    setAllTransactions([...allTransactions, transactionToAdd]);
    
    // Also add to regular transactions if it's uncategorized
    if (!newTransaction.category) {
      setTransactions([...transactions, transactionToAdd]);
    }
    
    setNewTransaction({
      description: '',
      amount: '',
      category: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
    
    setIsTransactionDialogOpen(false);
    
    toast({
      title: "Transaction added",
      description: `${newTransaction.type === 'income' ? 'Income' : 'Expense'} of ${formatAmount(amount)} has been added`,
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
    
    setBudgets([...budgets, budgetToAdd]);
  };
  
  // Filter transactions based on time period
  const getFilteredTransactions = () => {
    if (timeFilter === 'all') return allTransactions;
    
    const today = new Date();
    const cutoffDate = new Date();
    
    if (timeFilter === '7days') {
      cutoffDate.setDate(today.getDate() - 7);
    } else if (timeFilter === '1month') {
      cutoffDate.setMonth(today.getMonth() - 1);
    }
    
    return allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= cutoffDate;
    });
  };
  
  // Get filtered transactions
  const filteredTransactions = getFilteredTransactions();
  
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Currency className="h-4 w-4" />
                    <span>{currencies[currency].code}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm mb-2">Select Currency</h4>
                    <div className="space-y-1">
                      {Object.entries(currencies).map(([code, currencyInfo]) => (
                        <Button
                          key={code}
                          variant={currency === code ? "default" : "ghost"}
                          className="w-full justify-start text-sm"
                          onClick={() => setCurrency(code)}
                        >
                          <span className="mr-2">{currencyInfo.icon}</span>
                          <span>{currencyInfo.name}</span>
                          <span className="ml-auto opacity-70">{currencyInfo.symbol}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-neon-purple hover:bg-neon-purple/80 text-white">
                    <FiPlus className="mr-2" />
                    Add Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glass neon-border">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold neon-text">Add New Transaction</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="transaction-description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="transaction-description"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="transaction-amount" className="text-right">
                        Amount ({currencies[currency].symbol})
                      </Label>
                      <Input
                        id="transaction-amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="transaction-date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="transaction-date"
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="transaction-type" className="text-right">
                        Type
                      </Label>
                      <Select 
                        value={newTransaction.type} 
                        onValueChange={(value: 'expense' | 'income') => setNewTransaction({...newTransaction, type: value})}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="expense">Expense</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="transaction-category" className="text-right">
                        Category
                      </Label>
                      <Select 
                        value={newTransaction.category} 
                        onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem 
                              key={category} 
                              value={category}
                              color={categoryColors[category]}
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsTransactionDialogOpen(false)}
                      className="border-gray-700 hover:border-white"
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-neon-purple hover:bg-neon-purple/80" 
                      onClick={handleAddTransaction}
                    >
                      Add Transaction
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="glass w-full sm:w-auto grid sm:inline-flex grid-cols-3 sm:grid-cols-none h-auto sm:h-10">
              <TabsTrigger value="overview" className="py-2">Overview</TabsTrigger>
              <TabsTrigger value="transactions" className="py-2">Transactions</TabsTrigger>
              <TabsTrigger value="budgets" className="py-2">Budgets</TabsTrigger>
            </TabsList>
          </Tabs>
            
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="col-span-1 glass rounded-lg p-4 neon-border">
                  <h3 className="text-lg md:text-xl font-medium mb-4 flex items-center">
                    <FiPieChart className="mr-2 text-neon-purple" />
                    Expense Breakdown
                  </h3>
                  <div className="h-52 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={isMobile ? 60 : 80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2 lg:col-span-2 glass rounded-lg p-4 neon-border">
                  <h3 className="text-lg md:text-xl font-medium mb-4 flex items-center">
                    <FiTrendingUp className="mr-2 text-neon-cyan" />
                    Income vs. Expenses
                  </h3>
                  <div className="h-52 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#222', borderColor: '#444' }} 
                          formatter={(value) => [formatAmount(Number(value)), '']}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="income" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="expenses" 
                          stroke="#F97316" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Uncategorized Transactions */}
                <Card className="glass neon-border">
                  <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-medium mb-4 flex items-center">
                      <FiList className="mr-2 text-neon-orange" />
                      Transactions
                    </h3>
                    
                    {transactions.length > 0 ? (
                      <div className="divide-y divide-gray-700">
                        {transactions.map((transaction) => (
                          <div key={transaction.id} className="py-3">
                            {editingTransaction === transaction.id ? (
                              <div className="flex flex-col space-y-2">
                                <div className="flex justify-between">
                                  <span className="font-medium">{transaction.description}</span>
                                  <span>{formatAmount(transaction.amount)}</span>
                                </div>
                                <div className="flex gap-2">
                                  <select 
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-md p-1 text-sm"
                                    value={transactionCategory}
                                    onChange={(e) => setTransactionCategory(e.target.value)}
                                  >
                                    <option value="">Select category</option>
                                    {categories.map(category => (
                                      <option key={category} value={category}>{category}</option>
                                    ))}
                                  </select>
                                  <Button 
                                    size="sm" 
                                    variant="default" 
                                    className="bg-neon-purple hover:bg-neon-purple/80"
                                    onClick={() => handleCategorizeTransaction(transaction.id)}
                                  >
                                    <FiCheck size={16} />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setEditingTransaction(null)}
                                  >
                                    <FiX size={16} />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">{transaction.description}</div>
                                  <div className="text-sm text-gray-400">
                                    {transaction.date} 
                                    {transaction.category && ` • ${transaction.category}`}
                                    {transaction.type && ` • ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}`}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`${transaction.type === 'income' ? 'text-neon-green' : ''}`}>
                                    {transaction.type === 'income' ? '+' : ''}{formatAmount(transaction.amount)}
                                  </span>
                                  {!transaction.category && (
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="text-gray-400 hover:text-white"
                                      onClick={() => setEditingTransaction(transaction.id)}
                                    >
                                      <FiEdit2 size={16} />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-400">
                        No transactions yet
                      </div>
                    )}
                  </div>
                </Card>
                
                {/* Financial Goals */}
                <Card className="glass neon-border">
                  <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-medium mb-4 flex items-center">
                      <FiTarget className="mr-2 text-neon-magenta" />
                      Financial Goals
                    </h3>
                    
                    <div className="space-y-4">
                      {goals.map((goal) => (
                        <div key={goal.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{goal.name}</span>
                            <span>{formatAmount(goal.current)} of {formatAmount(goal.target)}</span>
                          </div>
                          <Progress 
                            value={(goal.current / goal.target) * 100} 
                            className="h-2 bg-gray-800 overflow-hidden"
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                            }}
                          />
                          <div className="flex flex-wrap justify-end gap-2 pt-1">
                            {[50, 100, 200].map((amount) => (
                              <Button 
                                key={amount} 
                                size="sm" 
                                variant="outline" 
                                className="text-xs border-neon-purple text-neon-purple hover:bg-neon-purple/10"
                                onClick={() => contributeToGoal(goal.id, amount)}
                              >
                                +{formatAmount(amount)}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <Button 
                        className="w-full mt-4 bg-neon-purple hover:bg-neon-purple/80"
                        onClick={() => navigate('/goals')}
                      >
                        Add New Goal
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
            
          {/* Transactions Tab - Transaction History */}
          {activeTab === 'transactions' && (
            <div className="glass rounded-lg p-4 md:p-6 neon-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-3 md:space-y-0">
                <h2 className="text-xl font-bold neon-text">Transaction History</h2>
                
                <div className="flex items-center gap-2">
                  <FiFilter className="text-gray-400" />
                  <Select
                    value={timeFilter}
                    onValueChange={(value: 'all' | '7days' | '1month') => setTimeFilter(value)}
                  >
                    <SelectTrigger className="w-[130px] md:w-[180px]">
                      <SelectValue placeholder="Filter by time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="1month">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4 overflow-auto">
                {filteredTransactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-gray-300">Description</TableHead>
                        <TableHead className="text-gray-300">Category</TableHead>
                        <TableHead className="text-gray-300">Type</TableHead>
                        <TableHead className="text-right text-gray-300">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((transaction) => (
                        <TableRow key={transaction.id} className="border-gray-700">
                          <TableCell className="font-medium">{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.category || 'Uncategorized'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              transaction.type === 'income' ? 'bg-green-900/30 text-green-400' : 'bg-orange-900/30 text-orange-400'
                            }`}>
                              {transaction.type?.charAt(0).toUpperCase() + (transaction.type?.slice(1) || '')}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={transaction.type === 'income' ? 'text-neon-green' : ''}>
                              {transaction.type === 'income' ? '+' : ''}{formatAmount(transaction.amount)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    No transactions found for the selected time period
                  </div>
                )}
              </div>
              
              {/* Mobile-friendly transaction list (shows on small screens only) */}
              <div className="block md:hidden mt-4">
                {filteredTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((transaction) => (
                      <div key={transaction.id} className="glass p-3 rounded-lg border border-gray-800">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{transaction.description}</span>
                          <span className={transaction.type === 'income' ? 'text-neon-green' : ''}>
                            {transaction.type === 'income' ? '+' : ''}{formatAmount(transaction.amount)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          <div className="flex justify-between">
                            <span>{transaction.date}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              transaction.type === 'income' ? 'bg-green-900/30 text-green-400' : 'bg-orange-900/30 text-orange-400'
                            }`}>
                              {transaction.type?.charAt(0).toUpperCase() + (transaction.type?.slice(1) || '')}
                            </span>
                          </div>
                          <div>{transaction.category || 'Uncategorized'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    No transactions found for the selected time period
                  </div>
                )}
              </div>
            </div>
          )}
            
          {/* Budgets Tab */}
          {activeTab === 'budgets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold neon-text">Monthly Budgets</h2>
                <BudgetForm 
                  onAddBudget={handleAddBudget}
                  existingBudgets={budgets}
                  currencies={currencies}
                  currentCurrency={currency}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BudgetList 
                  budgets={budgets}
                  currentMonth={currentMonth}
                  formatAmount={formatAmount}
                />

                <Card className="glass neon-border p-4">
                  <div className="flex items-center mb-4">
                    <FiPieChart className="text-neon-purple mr-2" />
                    <h2 className="text-lg font-semibold">Budget Overview</h2>
                  </div>
                  
                  {budgets.length > 0 && budgets.some(b => b.month === currentMonth) ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={budgets
                              .filter(b => b.month === currentMonth)
                              .map(b => ({
                                name: b.category,
                                value: b.spent,
                                color: categoryColors[b.category] || '#8E9196',
                                amount: b.amount,
                              }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={isMobile ? 60 : 80}
                            dataKey="value"
                          >
                            {budgets
                              .filter(b => b.month === currentMonth)
                              .map((_, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={budgets
                                    .filter(b => b.month === currentMonth)[index]
                                    .category in categoryColors 
                                      ? categoryColors[budgets.filter(b => b.month === currentMonth)[index].category] 
                                      : '#8E9196'
                                  } 
                                />
                              ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value, name, props) => [
                              `${formatAmount(Number(value))} / ${formatAmount(props.payload.amount)}`,
                              props.payload.name
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-400">
                      No budget data for this month
                    </div>
                  )}
                </Card>
                
                <Card className="glass neon-border p-4 md:col-span-2">
                  <div className="flex items-center mb-4">
                    <FiTrendingUp className="text-neon-cyan mr-2" />
                    <h2 className="text-lg font-semibold">Spending by Category</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {categories.map(category => {
                      // Get transactions for this category
                      const categoryTransactions = allTransactions.filter(
                        t => t.category === category && 
                        t.type === 'expense' &&
                        t.date.substring(0, 7) === currentMonth
                      );
                      
                      const totalSpent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
                      
                      // Skip categories with no transactions
                      if (categoryTransactions.length === 0) return null;
                      
                      // Find budget for this category if it exists
                      const budget = budgets.find(
                        b => b.category === category && b.month === currentMonth
                      );
                      
                      const percentage = budget ? (totalSpent / budget.amount) * 100 : 0;
                      const color = categoryColors[category] || '#8E9196';
                      
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <span 
                                className="h-3 w-3 rounded-full mr-2" 
                                style={{ backgroundColor: color }}
                              />
                              <span className="font-medium">{category}</span>
                            </div>
                            <span>
                              {formatAmount(totalSpent)}
                              {budget && ` / ${formatAmount(budget.amount)}`}
                            </span>
                          </div>
                          
                          {budget && (
                            <Progress 
                              value={percentage > 100 ? 100 : percentage} 
                              className="h-2"
                              style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                              }}
                              indicator={{
                                style: {
                                  backgroundColor: percentage > 100 
                                    ? '#ef4444' 
                                    : percentage > 80 
                                      ? '#f97316' 
                                      : color
                                }
                              }}
                            />
                          )}
                        </div>
                      );
                    }).filter(Boolean)}
                  </div>
                </Card>
              </div>
            </div>
          )}
            
          {/* Other tabs */}
          {activeTab !== 'overview' && activeTab !== 'transactions' && activeTab !== 'budgets' && (
            <div className="glass rounded-lg p-6 neon-border">
              <h2 className="text-2xl font-bold mb-4 neon-text">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p className="text-gray-400">
                This section is under development. Coming soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
