import React from 'react';
import { useBudget } from '../../../contexts/BudgetContext';
import CategoryItem from './CategoryItem';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';

const CategoryList = () => {
  const { state } = useBudget();
  const { categories, expandedCategories } = state;

  return (
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
        <div className="text-center py-8 text-gray-500 bg-white rounded-lg border">
          <p className="font-medium">No categories yet</p>
          <p className="text-sm">Add a category to get started</p>
        </div>
      )}
    </div>
  );
};

export default CategoryList;