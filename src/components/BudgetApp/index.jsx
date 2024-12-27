import React, { useState, useEffect } from 'react';
import Header from './Header';
import Button from '../ui/button.jsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import CategoryList from './CategoryList';
import ChartSection from './ChartSection';
import Footer from './Footer';
import CategoryModal from './CategoryModal';
import EditSubcategoryModal from './EditSubcategoryModal';
import LoadingState from './LoadingState';
import TransactionModal from './TransactionModal';
import EditTransactionModal from './EditTransactionModal';
import { budgetApi } from '../../services/api';

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

  const handleEditTransaction = async (data) => {
    try {
      await budgetApi.updateTransaction(data.id, {
        description: data.description,
        amount: parseFloat(data.amount),
        date: data.date
      });
      const [month, year] = selectedDate.split(' ');
      await loadBudgetData(year, month);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await budgetApi.deleteTransaction(transactionId);
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

      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">Budget Dashboard</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded p-2"
          >
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button onClick={() => openModal('category')} className="bg-blue-500 text-white">
              Add Category
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <LoadingState />
          </div>
        ) : (

          <div className="flex-1 grid grid-cols-3 gap-6 p-6">
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
                />
              </div>
            </div>

            {/* Summary and Charts */}
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid gap-4">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="text-sm text-gray-600">Total Budget</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ${totals.budget.toFixed(2)}
                  </p>
                </div>
                <div className={`border rounded-lg p-4 ${totals.spending > totals.budget ? 'bg-red-50' : 'bg-green-50'
                  }`}>
                  <h3 className="text-sm text-gray-600">Total Spending</h3>
                  <p className={`text-2xl font-bold ${totals.spending > totals.budget ? 'text-red-600' : 'text-green-600'
                    }`}>
                    ${totals.spending.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="font-bold mb-4">Budget Overview</h3>
                <div className="h-[300px]">
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
              </div>
            </div>
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