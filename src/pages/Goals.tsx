
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Navbar from '@/components/Navbar';
import { FiTarget, FiPlus } from 'react-icons/fi';

// Define goal interface
interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  color: string;
  deadline?: string;
  notes?: string;
}

// Colors for goals
const goalColors = [
  '#9b87f5', '#D946EF', '#1EAEDB', '#F97316', '#10B981', '#0EA5E9', '#8E9196'
];

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    // Try to get goals from localStorage
    const savedGoals = localStorage.getItem('financialGoals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    current: '',
    deadline: '',
    notes: '',
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('goals');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Currency state (simplified version from Dashboard)
  const [currency, setCurrency] = useState('USD');
  const currencies = {
    USD: { symbol: '$', rate: 1 },
    EUR: { symbol: '€', rate: 0.93 },
    GBP: { symbol: '£', rate: 0.79 },
    INR: { symbol: '₹', rate: 83.45 },
    JPY: { symbol: '¥', rate: 157.23 },
  };
  
  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target || parseFloat(newGoal.target) <= 0) {
      toast({
        title: "Invalid Goal",
        description: "Please enter a name and a valid target amount",
        variant: "destructive"
      });
      return;
    }
    
    const goalToAdd: Goal = {
      id: goals.length > 0 ? Math.max(...goals.map(g => g.id)) + 1 : 1,
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      current: newGoal.current ? parseFloat(newGoal.current) : 0,
      color: goalColors[goals.length % goalColors.length],
      deadline: newGoal.deadline || undefined,
      notes: newGoal.notes || undefined
    };
    
    const updatedGoals = [...goals, goalToAdd];
    setGoals(updatedGoals);
    
    // Save to localStorage
    localStorage.setItem('financialGoals', JSON.stringify(updatedGoals));
    
    setNewGoal({
      name: '',
      target: '',
      current: '',
      deadline: '',
      notes: '',
    });
    
    setIsDialogOpen(false);
    
    toast({
      title: "Goal Added",
      description: `Your financial goal "${goalToAdd.name}" has been created`,
    });
  };
  
  const contributeToGoal = (id: number, amount: number) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, current: Math.min(goal.current + amount, goal.target) } : goal
    );
    
    setGoals(updatedGoals);
    localStorage.setItem('financialGoals', JSON.stringify(updatedGoals));
    
    toast({
      title: "Contribution added",
      description: `${formatAmount(amount)} has been added to your goal`,
    });
  };
  
  const deleteGoal = (id: number) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    localStorage.setItem('financialGoals', JSON.stringify(updatedGoals));
    
    toast({
      title: "Goal Deleted",
      description: "Your financial goal has been removed",
    });
  };
  
  // Format amount with currency symbol
  const formatAmount = (amount: number): string => {
    const currencyInfo = currencies[currency as keyof typeof currencies];
    return `${currencyInfo.symbol}${amount.toFixed(2)}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 p-4 md:p-6 overflow-y-auto transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold neon-text">Financial Goals</h1>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-neon-purple hover:bg-neon-purple/80">
                  <FiPlus className="mr-2" /> Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] glass neon-border">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold neon-text">Add New Financial Goal</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="goal-name" className="text-right">
                      Goal Name
                    </Label>
                    <Input
                      id="goal-name"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="goal-target" className="text-right">
                      Target Amount
                    </Label>
                    <Input
                      id="goal-target"
                      type="number"
                      min="1"
                      step="0.01"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="current-amount" className="text-right">
                      Current Amount
                    </Label>
                    <Input
                      id="current-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newGoal.current}
                      onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="goal-deadline" className="text-right">
                      Target Date
                    </Label>
                    <Input
                      id="goal-deadline"
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="goal-notes" className="text-right">
                      Notes
                    </Label>
                    <Input
                      id="goal-notes"
                      value={newGoal.notes}
                      onChange={(e) => setNewGoal({...newGoal, notes: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="border-gray-700 hover:border-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-neon-purple hover:bg-neon-purple/80" 
                    onClick={handleAddGoal}
                  >
                    Add Goal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-6">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <Card key={goal.id} className="glass neon-border p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <FiTarget className="text-neon-magenta mr-2" />
                        <div>
                          <h3 className="font-semibold text-lg">{goal.name}</h3>
                          {goal.deadline && (
                            <p className="text-sm text-gray-400">Target date: {goal.deadline}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatAmount(goal.current)} of {formatAmount(goal.target)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {Math.round((goal.current / goal.target) * 100)}% complete
                        </div>
                      </div>
                    </div>
                    
                    <Progress 
                      value={(goal.current / goal.target) * 100} 
                      className="h-2"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        "--indicator-color": goal.color
                      } as React.CSSProperties}
                    />
                    
                    {goal.notes && (
                      <div className="text-sm bg-gray-800/50 p-2 rounded-md">
                        {goal.notes}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap justify-between items-center gap-2 pt-1">
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="text-xs"
                        onClick={() => deleteGoal(goal.id)}
                      >
                        Delete Goal
                      </Button>
                      
                      <div className="flex flex-wrap gap-2">
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
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
                <FiTarget size={48} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-400">No financial goals yet</h3>
                <p className="text-gray-500 mt-2">Start by adding your first financial goal</p>
                <Button 
                  className="mt-4 bg-neon-purple hover:bg-neon-purple/80"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <FiPlus className="mr-2" /> Add Goal
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;