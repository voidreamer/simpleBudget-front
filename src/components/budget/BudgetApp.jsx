import React from 'react';
import { BudgetProvider } from '../../contexts/BudgetContext';
import BudgetDashboard from './BudgetDashboard';
import ThemeToggle from '../ui/theme-toggle';

const BudgetApp = () => (
  <BudgetProvider>
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border p-4">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">SimpleBudget</h1>
          <ThemeToggle />
        </div>
      </header>
      <BudgetDashboard />
    </div>
  </BudgetProvider>
);

export default BudgetApp;