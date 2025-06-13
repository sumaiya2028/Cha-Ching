import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Currency } from 'lucide-react';

interface CurrencyInfo {
  symbol: string;
  code: string;
  name: string;
  icon: React.ReactNode;
  rate: number;
}

interface CurrencySelectorProps {
  currencies: Record<string, CurrencyInfo>;
  currentCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currencies,
  currentCurrency,
  onCurrencyChange
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (code: string) => {
    onCurrencyChange(code);
    setOpen(false); // Close the popover
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Currency className="h-4 w-4" />
          <span>{currencies[currentCurrency].code}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="space-y-1">
          <h4 className="font-medium text-sm mb-2">Select Currency</h4>
          <div className="space-y-1">
            {Object.entries(currencies).map(([code, currencyInfo]) => (
              <Button
                key={code}
                variant={currentCurrency === code ? "default" : "ghost"}
                className="w-full justify-start text-sm"
                onClick={() => handleSelect(code)}
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
  );
};

export default CurrencySelector;