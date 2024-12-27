// TransactionList.jsx
import React from 'react';
import { MoreVertical, Plus } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '../ui/dropdown-menu.jsx';
import Button from '../ui/button.jsx';

const TransactionList = ({ 
  subcategory, 
  onAddTransaction, 
  onEditTransaction, 
  onDeleteTransaction 
}) => (
  <div className="border rounded-lg p-4 mt-2">
    <div className="flex items-center justify-between mb-4">
      <h4 className="font-medium">{subcategory.name} Transactions</h4>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onAddTransaction(subcategory)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Transaction
      </Button>
    </div>
    <div className="space-y-4">
      {subcategory.transactions?.map(transaction => (
        <div key={transaction.id} className="flex items-start gap-4">
          <div className="min-w-[2px] bg-gray-200 h-full" />
          <div className="flex-1">
            <div className="bg-gray-50 p-3 rounded">
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
                        onClick={() => onEditTransaction(transaction)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteTransaction(transaction.id)}
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
      ))}
      {(!subcategory.transactions || subcategory.transactions.length === 0) && (
        <div className="text-center text-gray-500 py-4">
          No transactions yet
        </div>
      )}
    </div>
  </div>
);

export default TransactionList;