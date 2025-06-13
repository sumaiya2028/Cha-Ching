
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ChartPie,Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Budget {
  id: number;
  category: string;
  amount: number;
  month: string;
  spent: number;
}

// Define category colors
const categoryColors: Record<string, string> = {
  'Food': '#9b87f5',
  'Rent': '#D946EF',
  'Shopping': '#1EAEDB',
  'Transport': '#F97316',
  'Entertainment': '#10B981',
  'Bills': '#0EA5E9',
  'Other': '#8E9196',
};

interface BudgetListProps {
  budgets: Budget[];
  currentMonth: string;
  formatAmount: (amount: number) => string;
  onDeleteBudget: (id: number) => void; //delete budget
}

const BudgetList: React.FC<BudgetListProps> = ({ budgets, currentMonth, formatAmount,onDeleteBudget }) => {
  const [activeMonth, setActiveMonth] = useState<string>(currentMonth);
  
  // Get unique months from budgets
  const months = Array.from(new Set(budgets.map(budget => budget.month)));
  
  // Filter budgets by selected month
  const filteredBudgets = budgets.filter(budget => budget.month === activeMonth);
  
  // Get month name for display
  const getMonthName = (dateString: string) => {
    const date = new Date(dateString + "-01");
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  return (
    <Card className="glass neon-border p-4">
    
      <div className="flex items-center mb-4">
        <ChartPie className="text-neon-purple mr-2" />
        <h2 className="text-lg font-semibold">Monthly Budgets</h2>
      </div>
      
      {months.length > 0 ? (
        <>
          <Tabs value={activeMonth} onValueChange={setActiveMonth} className="w-full mb-4">
            <TabsList className="glass w-full grid grid-cols-3 overflow-x-auto">
              {months.map(month => (
                <TabsTrigger key={month} value={month} className="text-xs sm:text-sm">
                  {getMonthName(month)}
                </TabsTrigger>
              ))}
            </TabsList>
            
          </Tabs>
          
          <div className="space-y-4">
            {filteredBudgets.length > 0 ? (
              filteredBudgets.map(budget => {
                const percentage = (budget.spent / budget.amount) * 100;
                const isNearLimit = percentage >= 80;
                const isOverLimit = percentage > 100;
                const color = categoryColors[budget.category] || '#8E9196';
                
                // Determine the indicator color based on percentage
                const indicatorColor = isOverLimit 
                  ? 'bg-red-500'
                  : isNearLimit 
                    ? 'bg-orange-500' 
                    : '';
                
                return (
                  
                  
  <div key={budget.id} className="space-y-2 relative">
    {/* Delete Button */}
    <button
      onClick={() => onDeleteBudget(budget.id)}
      className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-1"
      title="Delete budget"
    >
      <Trash2 className="w-4 h-4" />
    </button>

    {/* Budget Info */}
    <div className="flex justify-between pr-6">
      <div className="flex items-center">
        <span 
          className="h-3 w-3 rounded-full mr-2" 
          style={{ backgroundColor: color }}
        />
        <span className="font-medium">{budget.category}</span>
      </div>
      <span>
        {formatAmount(budget.spent)} / {formatAmount(budget.amount)}
      </span>
    </div>
    
    <Progress 
      value={percentage > 100 ? 100 : percentage} 
      className="h-2"
      indicatorClassName={indicatorColor || ''}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        "--indicator-color": isOverLimit 
          ? '#ef4444' 
          : isNearLimit 
            ? '#f97316' 
            : color
      } as React.CSSProperties}
    />
    
    {isNearLimit && (
      <Alert 
        variant={isOverLimit ? "destructive" : "default"} 
        className={
          isOverLimit 
            ? "bg-red-900/20 border-red-700" 
            : "bg-orange-900/20 border-orange-700"
        }
      >
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {isOverLimit 
            ? `Over budget by ${formatAmount(budget.spent - budget.amount)}!` 
            : `You've used ${percentage.toFixed(0)}% of your ${budget.category} budget`
          }
        </AlertDescription>
      </Alert>
    )}
  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-400">
                No budgets set for {getMonthName(activeMonth)}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-400">
          No budgets set yet
        </div>
      )}
    </Card>
  );
};

export default BudgetList;
