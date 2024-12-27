import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, MoreVertical } from 'lucide-react';
import Button from '../ui/button.jsx';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu.jsx';
import TransactionList from './TransactionList.jsx';

const CategoryList = ({
  categories,
  expandedCategories,
  toggleCategory,
  openModal,
  handleDeleteCategory,
  handleDeleteSubcategory,
  handleEditSubcategory,
  onAddTransaction
}) => {
  return (
    <div className="h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Categories</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.entries(categories).map(([categoryName, categoryData]) => (
          <CategoryItem
            key={categoryName}
            categoryName={categoryName}
            categoryData={categoryData}
            isExpanded={expandedCategories.includes(categoryName)}
            onToggle={() => toggleCategory(categoryName)}
            onAddSubcategory={() => openModal('subcategory', { id: categoryData.id, name: categoryName })}
            onDeleteCategory={() => handleDeleteCategory(categoryData.id)}
            onDeleteSubcategory={handleDeleteSubcategory}
            onEditSubcategory={handleEditSubcategory}
            onAddTransaction={onAddTransaction}
          />
        ))}
      </div>
    </div>
  );
};

const CategoryItem = ({
  categoryName,
  categoryData,
  isExpanded,
  onToggle,
  onAddSubcategory,
  onDeleteCategory,
  onDeleteSubcategory,
  onEditSubcategory,
  onAddTransaction
}) => {
  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
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
              <DropdownMenuItem onClick={onAddSubcategory}>
                Add Subcategory
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDeleteCategory}
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
              key={item.name}
              item={item}
              onEdit={onEditSubcategory}
              onDelete={onDeleteSubcategory}
              onAddTransaction={onAddTransaction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryActions = ({ onAddSubcategory, onDeleteCategory, categoryId }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onAddSubcategory(categoryId)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Subcategory
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            console.log('Delete clicked', onDeleteCategory); // Debug
            onDeleteCategory();
          }}
          className="text-red-600"
        >
          Delete Category
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SubcategoryList = ({ items, categoryName, onDeleteSubcategory, onAddTransaction, onEditSubcategory }) => (
  <div className="border-t border-gray-200">
    {items.map((item) => (
      <SubcategoryItem
        key={item.name}
        item={item}
        onAddTransaction={onAddTransaction}
        categoryName={categoryName}
        onDeleteSubcategory={onDeleteSubcategory}
        onEditSubcategory={onEditSubcategory}
      />
    ))}
  </div>
);

const SubcategoryItem = ({
  item,
  onAddTransaction,
  onEditSubcategory,
  onDeleteSubcategory,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [showTransactions, setShowTransactions] = useState(false);
  console.log('subcategory data:', item);

  const handleEditTransaction = (transaction) => {
    console.log('Edit transaction:', transaction);
    // Call your edit function
  };

  const handleDeleteTransaction = (transactionId) => {
    console.log('Delete transaction:', transactionId);
    // Call your delete function
  };

  return (
    <div className="p-3 pl-10">
      <div className="flex justify-between items-center">
        <div>
          <span>{item.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTransactions(!showTransactions)}
          >
            {showTransactions ? 'Hide' : 'Show'} Transactions
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <span>${item.allotted}</span>
          <span>${item.spending}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onEditSubcategory({ id: item.id, allotted: item.allotted, spending: item.spending })}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteSubcategory(item.id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {showTransactions && (
        <TransactionList
          subcategory={item}
          onAddTransaction={onAddTransaction}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      )}
    </div>
  );
};

export default CategoryList;