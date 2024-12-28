// components/budget/TransactionList/index.jsx
import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '../../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../ui/dropdown-menu';
import { useBudget } from '../../../contexts/BudgetContext';

const TransactionList = ({ subcategory }) => {
  const { actions } = useBudget();

  return (
    <div className="divide-y">
      {subcategory.transactions?.map(transaction => (
        <div key={transaction.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">{transaction.description}</div>
              <div className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-green-600">${transaction.amount}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => actions.openModal('edit-transaction', transaction)}
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
        </div>
      ))}
      
      {(!subcategory.transactions || subcategory.transactions.length === 0) && (
        <div className="py-8 text-center text-gray-500">
          <p className="text-sm">No transactions yet</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;