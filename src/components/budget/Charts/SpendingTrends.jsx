import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';

const SpendingTrends = ({ transactions }) => {
  // Group transactions by date and calculate daily totals
  const dailyTotals = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + transaction.amount;
    return acc;
  }, {});

  const chartData = Object.entries(dailyTotals)
    .map(([date, total]) => ({
      date,
      total
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => `$${value}`}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6" 
                name="Daily Spending"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
export SpendingTrends;