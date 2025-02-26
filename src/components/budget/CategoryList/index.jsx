import React from 'react';
import { useBudget } from '../../../contexts/BudgetContext';
import CategoryItem from './CategoryItem';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { PlusCircle } from 'lucide-react';

const CategoryList = () => {
  const { state, actions } = useBudget();
  const { categories, expandedCategories } = state;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Budget Categories</h2>
      
      <div className="space-y-4">
        {Object.entries(categories).map(([categoryName, categoryData]) => (
          <CategoryItem
            key={categoryName}
            categoryName={categoryName}
            categoryData={categoryData}
            isExpanded={expandedCategories.includes(categoryName)}
          />
        ))}

        {Object.keys(categories).length === 0 && (
          <div 
            className="flex flex-col items-center justify-center p-8 rounded-lg border border-dashed border-border bg-background/50 cursor-pointer hover:bg-background transition-colors"
            onClick={() => actions.openModal('category')}
          >
            <PlusCircle className="w-10 h-10 text-primary/60 mb-2" />
            <p className="font-medium text-foreground">No categories yet</p>
            <p className="text-sm text-muted-foreground">Click to add your first budget category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;