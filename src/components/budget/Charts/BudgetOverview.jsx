import React from 'react';
import { useBudget } from '../../../contexts/BudgetContext';
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
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';

const BudgetOverview = () => {
  const { state } = useBudget();
  const { categories } = state;

  // Transform data for charts
  const chartData = Object.entries(categories).map(([name, data]) => ({
    name,
    Budget: data.budget,
    Allotted: data.items.reduce((sum, item) => sum + item.allotted, 0),
    Spending: data.items.reduce((sum, item) => sum + item.spending, 0),
  }));

  // Calculate totals
  const totals = Object.values(categories).reduce((acc, category) => {
    const categorySpending = category.items.reduce((sum, item) => sum + item.spending, 0);
    const categoryBudget = category.budget;
    
    return {
      totalBudget: acc.totalBudget + categoryBudget,
      totalSpending: acc.totalSpending + categorySpending
    };
  }, { totalBudget: 0, totalSpending: 0 });

  const remaining = totals.totalBudget - totals.totalSpending;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Bar dataKey="Budget" fill="#4ade80" name="Total Budget" />
              <Bar dataKey="Allotted" fill="#93c5fd" name="Allotted" />
              <Bar dataKey="Spending" fill="#fca5a5" name="Actual Spending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Budget</p>
            <p className="text-2xl font-bold text-green-600">
              ${totals.totalBudget.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Spending</p>
            <p className="text-2xl font-bold text-blue-600">
              ${totals.totalSpending.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Remaining</p>
            <p className={`text-2xl font-bold ${
              remaining >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${remaining.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetOverview;