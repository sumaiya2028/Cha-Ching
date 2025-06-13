
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FiPieChart, FiTrendingUp } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import BudgetList from './BudgetList';
import BudgetForm from './BudgetForm';

interface Budget {
  id: number;
  category: string;
  amount: number;
  month: string;
  spent: number;
}

interface BudgetTabProps {
  budgets: Budget[];
  currentMonth: string;
  formatAmount: (amount: number) => string;
  onAddBudget: (budget: Omit<Budget, "id" | "spent">) => void;
  onDeleteBudget: (id: number) => void;
  currencies: Record<string, { symbol: string; rate: number }>;
  currentCurrency: string;
  categoryColors: Record<string, string>;
}

const BudgetTab: React.FC<BudgetTabProps> = ({
  budgets,
  currentMonth,
  formatAmount,
  onAddBudget,
  onDeleteBudget, //delete budge
  currencies,
  currentCurrency,
  categoryColors
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold neon-text">Monthly Budgets</h2>
        <BudgetForm 
          onAddBudget={onAddBudget}
          existingBudgets={budgets}
          currencies={currencies}
          currentCurrency={currentCurrency}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BudgetList 
          budgets={budgets}
          currentMonth={currentMonth}
          formatAmount={formatAmount}
          onDeleteBudget={onDeleteBudget} // ✅ passed to child component
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
            {Object.keys(categoryColors).map(category => {
              // Get transactions for this category from budgets
              const budget = budgets.find(
                b => b.category === category && b.month === currentMonth
              );
              
              // Skip categories with no spending
              if (!budget || budget.spent === 0) return null;
              
              const percentage = (budget.spent / budget.amount) * 100;
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
                      {formatAmount(budget.spent)}
                      {` / ${formatAmount(budget.amount)}`}
                    </span>
                  </div>
                  
                  <Progress 
                    value={percentage > 100 ? 100 : percentage} 
                    className="h-2"
                    indicatorClassName={
                      percentage > 100 
                        ? 'bg-red-500' 
                        : percentage > 80 
                          ? 'bg-orange-500' 
                          : ''
                    }
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                    }}
                  />
                </div>
              );
            }).filter(Boolean)}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BudgetTab;
