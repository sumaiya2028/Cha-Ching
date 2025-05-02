
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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

// Budget form schema
const budgetFormSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, { message: "Please enter a valid amount greater than 0" }),
  month: z.string().min(1, "Please select a month"),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface Budget {
  id: number;
  category: string;
  amount: number;
  month: string;
  spent: number;
}

interface BudgetFormProps {
  onAddBudget: (budget: Omit<Budget, "id" | "spent">) => void;
  existingBudgets: Budget[];
  currencies: Record<string, { symbol: string; rate: number }>;
  currentCurrency: string;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ 
  onAddBudget, 
  existingBudgets,
  currencies,
  currentCurrency
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();
  
  const categories = Object.keys(categoryColors);
  
  const currentDate = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), i, 1);
    return {
      value: date.toISOString().substring(0, 7),
      label: date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear(),
    };
  });
  
  const defaultMonth = currentDate.toISOString().substring(0, 7);
  
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: "",
      amount: "",
      month: defaultMonth,
    },
  });
  
  // Check if budget already exists for selected category and month
  const selectedCategory = form.watch("category");
  const selectedMonth = form.watch("month");
  
  const budgetExists = existingBudgets.some(
    budget => budget.category === selectedCategory && budget.month === selectedMonth
  );
  
  const onSubmit = (values: BudgetFormValues) => {
    if (budgetExists) {
      toast({
        title: "Budget already exists",
        description: `A budget for ${selectedCategory} already exists for this month`,
        variant: "destructive",
      });
      return;
    }
    
    const newBudget = {
      category: values.category,
      amount: parseFloat(values.amount) / currencies[currentCurrency].rate, // Store in USD always
      month: values.month,
    };
    
    onAddBudget(newBudget);
    
    toast({
      title: "Budget created",
      description: `Budget for ${values.category} has been set`,
    });
    
    form.reset({
      category: "",
      amount: "",
      month: defaultMonth,
    });
    
    setIsDialogOpen(false);
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-neon-purple hover:bg-neon-purple/80">
          Add New Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass neon-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold neon-text">Set Monthly Budget</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem 
                          key={month.value} 
                          value={month.value}
                        >
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Amount ({currencies[currentCurrency].symbol})</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0.01" 
                      step="0.01" 
                      placeholder="Enter amount" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {budgetExists && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-700">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  A budget for this category already exists for the selected month.
                </AlertDescription>
              </Alert>
            )}
            
            <DialogFooter className="pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                type="button"
                className="border-gray-700 hover:border-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-neon-purple hover:bg-neon-purple/80"
              >
                Save Budget
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetForm;
