// components/budget/CategoryList/SubcategoryItem.jsx
import React, { useState } from 'react';
import { MoreVertical, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../ui/dropdown-menu';
import TransactionList from '../TransactionList';
import { useBudget } from '../../../contexts/BudgetContext';
import { LoadingSpinner } from '../../ui/LoadingState';

const SubcategoryItem = ({ item }) => {
  const [showTransactions, setShowTransactions] = useState(false);
  const { state, actions } = useBudget();
  const { loadingStates } = state;

  // Calculate if over budget
  const isOverBudget = item.spending > item.allotted;

  return (
    <div className="bg-white">
      {/* Subcategory Header */}
      <div className="pl-6 pr-4 py-3 border-l-4 border-l-gray-200 hover:border-l-blue-400 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowTransactions(!showTransactions)}
              className="p-1 hover:bg-gray-100 rounded-md"
            >
              {showTransactions ? 
                <ChevronDown className="w-4 h-4 text-gray-600" /> : 
                <ChevronRight className="w-4 h-4 text-gray-600" />
              }
            </button>
            <div>
              <h4 className="font-medium text-gray-900">{item.name}</h4>
              <div className="text-sm">
                <span className="text-gray-600">Allotted: </span>
                <span className="font-medium">${item.allotted}</span>
                <span className="mx-2">•</span>
                <span className="text-gray-600">Spent: </span>
                <span className={`font-medium ${
                  isOverBudget ? 'text-red-600' : 'text-green-600'
                }`}>${item.spending}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => actions.openModal('transaction', { 
                subcategory_id: item.id 
              })}
              disabled={loadingStates?.addingTransaction === item.id}
            >
              {loadingStates?.addingTransaction === item.id ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add Transaction
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
      </div>

      {/* Transactions */}
      {showTransactions && <TransactionList subcategory={item} />}
    </div>
  );
};

export default SubcategoryItem;