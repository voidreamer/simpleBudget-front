// components/budget/CategoryList/CategoryItem.jsx
import React from 'react';
import { ChevronDown, ChevronRight, MoreVertical } from 'lucide-react';
import { Button } from '../../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../ui/dropdown-menu';
import SubcategoryItem from './SubcategoryItem';
import { useBudget } from '../../../contexts/BudgetContext';

const CategoryItem = ({ categoryName, categoryData, isExpanded }) => {
  const { actions } = useBudget();

  const handleDelete = async () => {
    try {
      // Add console.log to debug
      console.log('Deleting category:', categoryData.id);
      await actions.deleteCategory(categoryData.id);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={() => actions.toggleCategory(categoryName)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          <span className="font-medium">{categoryName}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Budget: ${categoryData.budget}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  actions.openModal('subcategory', { id: categoryData.id, name: categoryName });
                }}
              >
                Add Subcategory
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="text-red-600"
              >
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t bg-gray-50">
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