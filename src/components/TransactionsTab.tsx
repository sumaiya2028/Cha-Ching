
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiFilter } from 'react-icons/fi';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category?: string;
  type?: 'expense' | 'income';
}

interface TransactionsTabProps {
  transactions: Transaction[];
  timeFilter: 'all' | '7days' | '1month';
  onTimeFilterChange: (value: 'all' | '7days' | '1month') => void;
  formatAmount: (amount: number) => string;
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({
  transactions,
  timeFilter,
  onTimeFilterChange,
  formatAmount
}) => {
  return (
    <div className="glass rounded-lg p-4 md:p-6 neon-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-3 md:space-y-0">
        <h2 className="text-xl font-bold neon-text">Transaction History</h2>
        
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-400" />
          <Select
            value={timeFilter}
            onValueChange={(value: 'all' | '7days' | '1month') => onTimeFilterChange(value)}
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
        {transactions.length > 0 ? (
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
              {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
  );
};

export default TransactionsTab;
