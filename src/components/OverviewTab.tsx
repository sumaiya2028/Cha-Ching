
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import { FiPieChart, FiTrendingUp, FiList, FiTarget, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category?: string;
  type?: 'expense' | 'income';
}

interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  color: string;
}

interface OverviewTabProps {
  expenseData: Array<{ name: string; value: number; color: string }>;
  trendData: Array<{ name: string; expenses: number; income: number }>;
  transactions: Transaction[];
  goals: Goal[];
  formatAmount: (amount: number) => string;
  onCategorizeTransaction: (id: number, category: string) => void;
  onContributeToGoal: (id: number, amount: number) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  expenseData,
  trendData,
  transactions,
  goals,
  formatAmount,
  onCategorizeTransaction,
  onContributeToGoal
}) => {
  const [editingTransaction, setEditingTransaction] = React.useState<number | null>(null);
  const [transactionCategory, setTransactionCategory] = React.useState('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleCategorize = (id: number) => {
    if (!transactionCategory) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }
    
    onCategorizeTransaction(id, transactionCategory);
    setEditingTransaction(null);
    setTransactionCategory('');
  };

  return (
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
                            {['Food', 'Rent', 'Shopping', 'Transport', 'Entertainment', 'Bills', 'Other'].map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                          <Button 
                            size="sm" 
                            variant="default" 
                            className="bg-neon-purple hover:bg-neon-purple/80"
                            onClick={() => handleCategorize(transaction.id)}
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
                        onClick={() => onContributeToGoal(goal.id, amount)}
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
  );
};

export default OverviewTab;
