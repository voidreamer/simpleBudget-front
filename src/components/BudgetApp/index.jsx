import React, { useState, useEffect } from 'react';
import Header from './Header';
import Button from '../ui/button.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2, Clock, TrendingUp } from 'lucide-react';
import CategoryList from './CategoryList';
import ChartSection from './ChartSection';
import Footer from './Footer';
import CategoryModal from './CategoryModal';
import EditSubcategoryModal from './EditSubcategoryModal';
import LoadingState from './LoadingState';
import TransactionModal from './TransactionModal';
import EditTransactionModal from './EditTransactionModal';
import { budgetApi } from '../../services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog.jsx";

const BudgetApp = () => {
  const [expandedCategories, setExpandedCategories] = useState(['Fixed Expenses']);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [modalType, setModalType] = useState('category');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [addingTransactionTo, setAddingTransactionTo] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categories, setCategories] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showGraph, setShowGraph] = useState(false);


  const getCurrentMonthYear = () => {
    const date = new Date();
    return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  };
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getCurrentMonthYear());

  // Business logic functions
  const toggleCategory = (category) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const openModal = (type, category = null) => {
    console.log('Opening modal:', type, category); // Debug
    setModalType(type);
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleAddCategory = async (data) => {
    try {
      const response = await budgetApi.createCategory(data);
      console.log('New category:', response); // Check if ID is returned
      await loadBudgetData(selectedDate.split(' ')[1], selectedDate.split(' ')[0]);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    console.log('handleDeleteCategory called with ID:', categoryId);
    if (!categoryId) {
      console.error('No category ID provided');
      return;
    }
    try {
      await budgetApi.deleteCategory(categoryId);
      const [month, year] = selectedDate.split(' ');
      await loadBudgetData(year, month);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleAddSubcategory = async (data) => {
    console.log('handleAddSubcategory :', selectedCategory?.id);
    if (!selectedCategory?.id) return;
    try {
      const subcategoryData = {
        name: data.name,
        allotted: data.allotted,
        category_id: selectedCategory.id
      };
      await budgetApi.createSubcategory(subcategoryData);
      const [month, year] = selectedDate.split(' ');
      await loadBudgetData(year, month);
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };

  const handleEditSubcategory = async (data) => {
    console.log('Editing subcategory:', data); // Debug
    if (!data?.id) return;
    try {
      await budgetApi.updateSubcategory(data.id, {
        allotted: parseFloat(data.allotted),
        spending: parseFloat(data.spending)
      });
      const [month, year] = selectedDate.split(' ');
      await loadBudgetData(year, month);
    } catch (error) {
      console.error('Error updating subcategory:', error);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    if (!subcategoryId) return;
    try {
      await budgetApi.deleteSubcategory(subcategoryId);
      const [month, year] = selectedDate.split(' ');
      await loadBudgetData(year, month);
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  const handleAddTransaction = async (data) => {
    console.log('Transaction data:', data);
    try {
      await budgetApi.createTransaction(data);
      const [month, year] = selectedDate.split(' ');
      await loadBudgetData(year, month);
      setAddingTransactionTo(null);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  // index.jsx
  const handleEditTransaction = async (transaction) => {
    if (!transaction?.id) return;
    try {
      await budgetApi.updateTransaction(transaction.id, {
        description: transaction.description,
        amount: parseFloat(transaction.amount),
        date: transaction.date
      });

      // Reload data after successful update
      const [month, year] = selectedDate.split(' ');
      await loadBudgetData(year, month);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!transactionId) return;
    try {
      await budgetApi.deleteTransaction(transactionId);

      // Reload data after successful deletion
      const [month, year] = selectedDate.split(' ');
      await loadBudgetData(year, month);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const loadBudgetData = async (year, month) => {
    try {
      setIsLoading(true);
      const data = await budgetApi.fetchBudgetData(year, month);
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading budget data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Transform data for chart
  const chartData = Object.entries(categories).map(([name, data]) => ({
    name,
    Budget: data.budget,
    Allotted: data.items.reduce((sum, item) => sum + item.allotted, 0),
    Spending: data.items.reduce((sum, item) => sum + item.spending, 0),
  }));

  useEffect(() => {
    const currentDate = new Date();
    const monthsList = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      monthsList.push(monthYear);
    }

    setDates(monthsList);
  }, [selectedDate]);

  useEffect(() => {
    const [month, year] = selectedDate.split(' ');
    console.log('Loading budget data for:', month, year);
    loadBudgetData(year, month);
  }, [selectedDate]);

  const totals = {
    budget: Object.values(categories).reduce((sum, cat) => sum + cat.budget, 0),
    spending: Object.values(categories).reduce((sum, cat) =>
      sum + cat.items.reduce((subSum, item) => subSum + item.spending, 0), 0
    )
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header with icons */}
      <div className="border-b p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-xl">Budget Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full"
                onClick={() => setShowGraph(prev => !prev)}
              >
                <BarChart2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full"
              >
                <Clock className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full"
              >
                <TrendingUp className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex items-center gap-4">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded p-2 bg-white"
            >
              {dates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
            <Button
              onClick={() => openModal('category')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Add Category
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <LoadingState />
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-blue-50">
                <h3 className="text-sm text-gray-600">Total Budget</h3>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  ${totals.budget.toFixed(2)}
                </p>
              </div>
              <div className={`border rounded-lg p-4 ${totals.spending > totals.budget ? 'bg-red-50' : 'bg-green-50'
                }`}>
                <h3 className="text-sm text-gray-600">Total Spending</h3>
                <p className={`text-xl sm:text-2xl font-bold ${totals.spending > totals.budget ? 'text-red-600' : 'text-green-600'
                  }`}>
                  ${totals.spending.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Categories and Transactions List */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow">
                <CategoryList
                  categories={categories}
                  expandedCategories={expandedCategories}
                  toggleCategory={toggleCategory}
                  openModal={openModal}
                  handleDeleteCategory={handleDeleteCategory}
                  handleDeleteSubcategory={handleDeleteSubcategory}
                  handleEditSubcategory={setEditingSubcategory}
                  onAddTransaction={setAddingTransactionTo}
                  onEditTransaction={setEditingTransaction}     // Add these
                  onDeleteTransaction={handleDeleteTransaction}
                />
              </div>
            </div>

            {/* Graph Dialog */}
            <Dialog open={showGraph} onOpenChange={setShowGraph}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Budget Overview</DialogTitle>
                </DialogHeader>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Bar dataKey="Budget" fill="#4ade80" />
                      <Bar dataKey="Spending" fill="#fca5a5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        type={modalType}
        selectedCategory={selectedCategory}
        onSubmit={modalType === 'category' ? handleAddCategory : handleAddSubcategory}
      />
      <EditSubcategoryModal
        isOpen={!!editingSubcategory}
        onClose={() => setEditingSubcategory(null)}
        subcategory={editingSubcategory}
        onSubmit={handleEditSubcategory}
      />
      <TransactionModal
        isOpen={!!addingTransactionTo}
        onClose={() => setAddingTransactionTo(null)}
        subcategory={addingTransactionTo}
        onSubmit={handleAddTransaction}
      />
      <EditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        onSubmit={handleEditTransaction}
      />
    </div>
  );
};

export default BudgetApp;