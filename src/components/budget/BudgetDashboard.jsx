// components/budget/BudgetDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useBudget } from '../../contexts/BudgetContext';
import { BarChart2, Clock, TrendingUp } from 'lucide-react';
import CategoryList from './CategoryList';
import BudgetOverview from './Charts/BudgetOverview';
import { Button } from '../ui/button';
import LoadingState from '../ui/LoadingState';
import BaseModal from '../modals/BaseModal';

const BudgetDashboard = () => {
  const { state, actions } = useBudget();
  const { categories, isLoading, modal } = state;
  const [showGraph, setShowGraph] = useState(true);
  const [dates, setDates] = useState([]);

  const getCurrentMonthYear = () => {
    const date = new Date();
    return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  };

  // Generate last 12 months
  useEffect(() => {
    const currentDate = new Date();
    const monthsList = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      monthsList.push(monthYear);
    }

    setDates(monthsList);
    if (!state.selectedDate) {
      actions.setSelectedDate(monthsList[0]);
    }
  }, []);

  if (isLoading) return <LoadingState />;

  return (
    <>
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-xl">Budget Dashboard</h1>
          <div className="flex items-center gap-4">
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
        <div className="flex justify-between items-center">
          <select
            value={state.selectedDate || ''}
            onChange={(e) => actions.setSelectedDate(e.target.value)}
            className="border rounded p-2 bg-white"
          >
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
          <Button
            onClick={() => actions.openModal('category')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryList />
          {showGraph && <BudgetOverview onClose={() => setShowGraph(false)} />}
        </div>
      </div>

      {/* Modal */}
      <BaseModal
        isOpen={modal.isOpen}
        onClose={actions.closeModal}
        type={modal.type}
        initialValues={modal.data}
        onSubmit={(data) => {
          switch (modal.type) {
            case 'category':
              actions.createCategory({
                ...data,
                month: state.selectedDate.split(' ')[0],
                year: state.selectedDate.split(' ')[1]
              });
              break;
            case 'subcategory':
              actions.createSubcategory({
                ...data,
                category_id: modal.data.id
              });
              break;
            case 'transaction':
              actions.createTransaction({
                ...data,
                subcategory_id: modal.data.subcategory_id
              });
              break;
            case 'edit-transaction':
              actions.updateTransaction(modal.data.id, data);
              break;
            case 'edit-subcategory':
              actions.updateSubcategory(modal.data.id, data);
              break;
          }
          actions.closeModal();
        }}
      />
    </>
  );
};

export default BudgetDashboard;