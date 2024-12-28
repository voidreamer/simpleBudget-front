import React from 'react';
import { useBudget } from '../../../contexts/BudgetContext';
import CategoryItem from './CategoryItem';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';

const CategoryList = () => {
  const { state, actions } = useBudget();
  const { categories, expandedCategories } = state;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(categories).map(([categoryName, categoryData]) => (
          <CategoryItem
            key={categoryName}
            categoryName={categoryName}
            categoryData={categoryData}
            isExpanded={expandedCategories.includes(categoryName)}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryList;