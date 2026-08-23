// app/components/admin/Chart.tsx
'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const lineData = [
  { month: 'Jan', revenue: 4000, orders: 2400 },
  { month: 'Feb', revenue: 3000, orders: 1398 },
  { month: 'Mar', revenue: 9800, orders: 2000 },
  { month: 'Apr', revenue: 3908, orders: 2780 },
  { month: 'May', revenue: 4800, orders: 1890 },
  { month: 'Jun', revenue: 3800, orders: 2390 },
];

const pieData = [
  { name: 'Direct', value: 400, color: '#3B82F6' },
  { name: 'Social', value: 300, color: '#8B5CF6' },
  { name: 'Referral', value: 300, color: '#10B981' },
  { name: 'Email', value: 200, color: '#F59E0B' },
];

interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
}

export default function Chart({ type }: ChartProps) {
  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'doughnut') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return null;
}