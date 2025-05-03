
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FiPlus } from 'react-icons/fi';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category?: string;
  type?: 'expense' | 'income';
}

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  categories: string[];
  currencies: Record<string, { symbol: string; rate: number }>;
  currentCurrency: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onAddTransaction,
  categories,
  currencies,
  currentCurrency
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense' as 'expense' | 'income',
    date: new Date().toISOString().split('T')[0]
  });

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
    
    onAddTransaction({
      date: newTransaction.date,
      description: newTransaction.description,
      amount: amount,
      category: newTransaction.category,
      type: newTransaction.type
    });
    
    setNewTransaction({
      description: '',
      amount: '',
      category: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
    
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              Amount ({currencies[currentCurrency].symbol})
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
            onClick={() => setIsDialogOpen(false)}
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
  );
};

export default TransactionForm;
