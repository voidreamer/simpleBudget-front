// components/budget/TransactionIconSelect.jsx
import React from 'react';
import { 
  ShoppingBasket, Coffee, Car, Home, Utensils, 
  Smartphone, ShoppingBag, Dumbbell, Plane, Bus,
  Wifi, Gamepad, Book, Music, Heart, Gift,
  CreditCard, DollarSign, Wrench, Scissors
} from 'lucide-react';
import { Button } from '../ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem 
} from '../ui/dropdown-menu';

const TRANSACTION_ICONS = [
  { icon: ShoppingBasket, label: 'Groceries' },
  { icon: Coffee, label: 'Coffee' },
  { icon: Car, label: 'Car' },
  { icon: Home, label: 'Home' },
  { icon: Utensils, label: 'Dining' },
  { icon: Smartphone, label: 'Electronics' },
  { icon: ShoppingBag, label: 'Shopping' },
  { icon: Dumbbell, label: 'Fitness' },
  { icon: Plane, label: 'Travel' },
  { icon: Bus, label: 'Transport' },
  { icon: Wifi, label: 'Internet' },
  { icon: Gamepad, label: 'Entertainment' },
  { icon: Book, label: 'Education' },
  { icon: Music, label: 'Music' },
  { icon: Heart, label: 'Health' },
  { icon: Gift, label: 'Gifts' },
  { icon: CreditCard, label: 'Bills' },
  { icon: DollarSign, label: 'Income' },
  { icon: Wrench, label: 'Repairs' },
  { icon: Scissors, label: 'Personal Care' }
];

const TransactionIconSelect = ({ selectedIcon, onSelectIcon }) => {
  const SelectedIcon = TRANSACTION_ICONS.find(i => i.label === selectedIcon)?.icon || ShoppingBag;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <SelectedIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 grid grid-cols-4 gap-1 p-2">
        {TRANSACTION_ICONS.map(({ icon: Icon, label }) => (
          <DropdownMenuItem
            key={label}
            onClick={() => onSelectIcon(label)}
            className="p-2 cursor-pointer hover:bg-gray-100 rounded flex items-center justify-center"
          >
            <Icon className="h-4 w-4" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { TRANSACTION_ICONS, TransactionIconSelect };