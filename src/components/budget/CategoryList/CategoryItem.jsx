import React from 'react';
import { ChevronDown, ChevronRight, MoreVertical } from 'lucide-react';
import { Button } from '../../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../ui/dropdown-menu';
import SubcategoryItem from './SubcategoryItem';
import { useBudget } from '../../../contexts/BudgetContext';
import { LoadingSpinner } from '../../ui/LoadingState';

const CategoryItem = ({ categoryName, categoryData, isExpanded }) => {
  const { state, actions } = useBudget();
  const { loadingStates } = state;

  return (
    <div className="border rounded-lg shadow-sm bg-white overflow-visible">
      {/* Category Header */}
      <div className="p-4 bg-blue-50 border-b flex items-center justify-between">
        {/* Clickable area for expand/collapse */}
        <div
          className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-blue-100 rounded-md p-2 -ml-2"
          onClick={() => actions.toggleCategory(categoryName)}
        >
          {isExpanded ?
            <ChevronDown className="w-5 h-5 text-blue-600" /> :
            <ChevronRight className="w-5 h-5 text-blue-600" />
          }
          <div>
            <h3 className="font-semibold text-lg text-blue-900">{categoryName}</h3>
            <p className="text-sm text-blue-600">Budget: ${categoryData.budget}</p>
          </div>
        </div>

        {/* Options menu */}
        <div onClick={e => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => actions.openModal('edit-category', {
                  id: categoryData.id,
                  name: categoryName,
                  budget: categoryData.budget
                })}
              >
                Edit Category
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => actions.openModal('subcategory', {
                  id: categoryData.id,
                  name: categoryName
                })}
              >
                Add Subcategory
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => actions.deleteCategory(categoryData.id)}
                className="text-red-600"
              >
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Subcategories */}
      {isExpanded && (
        <div className="divide-y">
          {categoryData.items.map((item) => (
            <SubcategoryItem
              key={item.id}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;