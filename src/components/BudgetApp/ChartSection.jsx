import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';

const ChartSection = ({ chartData, categories }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate totals
  const totals = Object.values(categories).reduce((acc, category) => {
    const categorySpending = category.items.reduce((sum, item) => sum + item.spending, 0);
    const categoryBudget = category.items.reduce((sum, item) => sum + item.allotted, 0);
    
    return {
      totalBudget: acc.totalBudget + categoryBudget,
      totalSpending: acc.totalSpending + categorySpending
    };
  }, { totalBudget: 0, totalSpending: 0 });

  return (
    <div className="w-1/2 bg-white rounded-lg shadow">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between bg-blue-500 text-white rounded-t-lg hover:bg-blue-600"
      >
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5" />
          <span className="font-semibold">Budget Overview</span>
        </div>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </button>

      {/* Chart */}
      {isExpanded && (
        <div className="p-4">
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
        </div>
      )}

      {/* Totals Section */}
      <div className="p-4 border-t">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-gray-600">Total Budget</p>
            <p className="text-2xl font-bold text-green-600">
              ${totals.totalBudget.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Total Spending</p>
            <p className="text-2xl font-bold text-blue-600">
              ${totals.totalSpending.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Remaining</p>
          <p className={`text-2xl font-bold ${
            totals.totalBudget - totals.totalSpending >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${(totals.totalBudget - totals.totalSpending).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;