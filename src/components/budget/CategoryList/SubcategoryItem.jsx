// components/budget/CategoryList/SubcategoryItem.jsx
import React, { useState } from 'react';
import { MoreVertical, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../ui/dropdown-menu';
import TransactionList from '../TransactionList';
import { useBudget } from '../../../contexts/BudgetContext';

const SubcategoryItem = ({ item }) => {
  const [showTransactions, setShowTransactions] = useState(false);
  const { actions } = useBudget();

  // Calculate if over budget
  const isOverBudget = item.spending > item.allotted;

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      {/* Main Info Section */}
      <div className="flex justify-between items-center p-4">
        <span className="font-medium">{item.name}</span>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-600">Allotted: </span>
            <span className="font-medium">${item.allotted}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-600">Spent: </span>
            <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              ${item.spending}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem 
                onClick={() => actions.openModal('edit-subcategory', {
                  id: item.id,
                  allotted: item.allotted,
                  spending: item.spending,
                  name: item.name
                })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => actions.deleteSubcategory(item.id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Transactions Accordion Header */}
      <div 
        className={`border-t bg-gray-50 p-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors
          ${showTransactions ? 'border-b' : ''}`}
        onClick={() => setShowTransactions(!showTransactions)}
      >
        <div className="flex items-center gap-2">
          {showTransactions ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
          <span className="font-medium text-gray-600">Transactions</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            actions.openModal('transaction', { subcategory_id: item.id });
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Transactions Content */}
      {showTransactions && (
        <div className="bg-gray-50">
          <TransactionList subcategory={item} />
        </div>
      )}
    </div>
  );
};

export default SubcategoryItem;