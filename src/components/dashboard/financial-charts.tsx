"use client"

import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface FinancialChartsProps {
  incomeStats: {
    totalReceived: number
    totalPending: number
    totalOverdue: number
    totalExpected: number
  }
}

export function FinancialCharts({ incomeStats }: FinancialChartsProps) {
  const healthData = [
    { name: "Received", value: incomeStats.totalReceived, color: "#2DD4BF" },
    { name: "Pending", value: incomeStats.totalPending, color: "#6366F1" },
    { name: "Overdue", value: incomeStats.totalOverdue, color: "#F59E0B" },
  ]

  return (
    <div className="relative h-28 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={healthData}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={45}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {healthData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">
          {incomeStats.totalExpected > 0 
            ? Math.round((incomeStats.totalReceived / incomeStats.totalExpected) * 100) 
            : 0}%
        </span>
        <span className="text-[8px] text-muted-foreground uppercase font-bold">Collected</span>
      </div>
    </div>
  )
}
