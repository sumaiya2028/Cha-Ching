
/**
 * Utility functions for currency conversion and formatting
 */

// Convert amount based on selected currency rate
export const convertAmount = (
  amount: number, 
  currencyRate: number
): number => {
  return amount * currencyRate;
};

// Format amount with currency symbol
export const formatAmount = (
  amount: number, 
  currencySymbol: string, 
  currencyCode: string, 
  currencyRate: number
): string => {
  const convertedAmount = convertAmount(amount, currencyRate);
  
  // Format with appropriate decimal places
  if (currencyCode === 'JPY') {
    // JPY typically doesn't use decimal places
    return `${currencySymbol}${Math.round(convertedAmount)}`;
  }
  
  return `${currencySymbol}${convertedAmount.toFixed(2)}`;
};

// Updated to ensure returned type matches Transaction interface
export const filterTransactionsByTimePeriod = <T extends { date: string; id: number; description: string; amount: number }>(
  transactions: T[], 
  timeFilter: 'all' | '7days' | '1month'
): T[] => {
  if (timeFilter === 'all') return transactions;
  
  const today = new Date();
  const cutoffDate = new Date();
  
  if (timeFilter === '7days') {
    cutoffDate.setDate(today.getDate() - 7);
  } else if (timeFilter === '1month') {
    cutoffDate.setMonth(today.getMonth() - 1);
  }
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= cutoffDate;
  });
};

// Get month name for display
export const getMonthName = (dateString: string): string => {
  const date = new Date(dateString + "-01");
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};
