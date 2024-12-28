import React from 'react';
import { BudgetProvider } from '../../contexts/BudgetContext';
import BudgetDashboard from './BudgetDashboard';

const BudgetApp = () => (
  <BudgetProvider>
    <div className="flex flex-col h-screen bg-gray-50">
      <BudgetDashboard />
    </div>
  </BudgetProvider>
);

export default BudgetApp;