'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface ChartsProps {
  riskData: Array<{ name: string; value: number }>
  regionData: Array<{ name: string; value: number }>
}

const COLORS = {
  EMERGENCY: '#ef4444',
  CONSULT: '#f59e0b', 
  SELF_CARE: '#22c55e'
}

export function Charts({ riskData, regionData }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Level Distribution */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Distribusi Tingkat Risiko
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={riskData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {riskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Regions */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Laporan per Wilayah
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={regionData.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
