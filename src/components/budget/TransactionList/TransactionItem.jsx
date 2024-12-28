import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '../../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../ui/dropdown-menu';
import { useBudget } from '../../../contexts/BudgetContext';

const TransactionItem = ({ transaction }) => {
  const { actions } = useBudget();

  return (
    <div className="flex items-start gap-4">
      <div className="min-w-[2px] bg-gray-200 h-full" />
      <div className="flex-1">
        <div className="bg-white p-3 rounded shadow-sm">
          <div className="flex justify-between mb-1">
            <div>
              <span className="font-medium">{transaction.description}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">${transaction.amount}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem 
                    onClick={() => actions.openModal('edit-transaction', {
                      ...transaction
                    })}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => actions.deleteTransaction(transaction.id)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(transaction.date).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;