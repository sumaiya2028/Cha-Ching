import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { FiEdit2, FiX, FiCheck, FiTarget, FiTrendingUp, FiList, FiPieChart } from 'react-icons/fi';
import Sidebar from '@/components/Sidebar';

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

const unassignedTransactions = [
  { id: 1, date: '2023-05-01', description: 'Merchant 1', amount: 45.99 },
  { id: 2, date: '2023-05-02', description: 'Merchant 2', amount: 122.00 },
  { id: 3, date: '2023-05-03', description: 'Merchant 3', amount: 12.49 },
];

const financialGoals = [
  { id: 1, name: 'Emergency Fund', target: 5000, current: 2500, color: '#9b87f5' },
  { id: 2, name: 'Vacation', target: 2000, current: 800, color: '#D946EF' },
  { id: 3, name: 'New Laptop', target: 1500, current: 1200, color: '#1EAEDB' },
];

// Dashboard component
const Dashboard = () => {
  const [editingTransaction, setEditingTransaction] = useState<number | null>(null);
  const [transactionCategory, setTransactionCategory] = useState('');
  const [transactions, setTransactions] = useState(unassignedTransactions);
  const [goals, setGoals] = useState(financialGoals);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleCategorizeTransaction = (id: number) => {
    if (!transactionCategory) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }
    
    setTransactions(transactions.filter(t => t.id !== id));
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
      description: `$${amount} has been added to your goal`,
    });
  };
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 neon-text">Dashboard</h1>
          
          {/* Overview Section */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="col-span-1 glass rounded-lg p-4 neon-border">
                  <h3 className="text-xl font-medium mb-4 flex items-center">
                    <FiPieChart className="mr-2 text-neon-purple" />
                    Expense Breakdown
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
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
                  <h3 className="text-xl font-medium mb-4 flex items-center">
                    <FiTrendingUp className="mr-2 text-neon-cyan" />
                    Income vs. Expenses
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#222', borderColor: '#444' }} 
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
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Uncategorized Transactions */}
                <Card className="glass neon-border">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-4 flex items-center">
                      <FiList className="mr-2 text-neon-orange" />
                      Uncategorized Transactions
                    </h3>
                    
                    {transactions.length > 0 ? (
                      <div className="divide-y divide-gray-700">
                        {transactions.map((transaction) => (
                          <div key={transaction.id} className="py-3">
                            {editingTransaction === transaction.id ? (
                              <div className="flex flex-col space-y-2">
                                <div className="flex justify-between">
                                  <span className="font-medium">{transaction.description}</span>
                                  <span>${transaction.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex gap-2">
                                  <select 
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded-md p-1 text-sm"
                                    value={transactionCategory}
                                    onChange={(e) => setTransactionCategory(e.target.value)}
                                  >
                                    <option value="">Select category</option>
                                    <option value="Food">Food</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Bills">Bills</option>
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
                                  <div className="text-sm text-gray-400">{transaction.date}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span>${transaction.amount.toFixed(2)}</span>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-gray-400 hover:text-white"
                                    onClick={() => setEditingTransaction(transaction.id)}
                                  >
                                    <FiEdit2 size={16} />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-400">
                        No uncategorized transactions
                      </div>
                    )}
                  </div>
                </Card>
                
                {/* Financial Goals */}
                <Card className="glass neon-border">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-4 flex items-center">
                      <FiTarget className="mr-2 text-neon-magenta" />
                      Financial Goals
                    </h3>
                    
                    <div className="space-y-4">
                      {goals.map((goal) => (
                        <div key={goal.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{goal.name}</span>
                            <span>${goal.current} of ${goal.target}</span>
                          </div>
                          <Progress 
                            value={(goal.current / goal.target) * 100} 
                            className="h-2 bg-gray-800 overflow-hidden"
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                            }}
                          />
                          <div className="flex justify-end gap-2 pt-1">
                            {[50, 100, 200].map((amount) => (
                              <Button 
                                key={amount} 
                                size="sm" 
                                variant="outline" 
                                className="text-xs border-neon-purple text-neon-purple hover:bg-neon-purple/10"
                                onClick={() => contributeToGoal(goal.id, amount)}
                              >
                                +${amount}
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
          
          {/* Additional tab content can go here */}
          {activeTab !== 'overview' && (
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
