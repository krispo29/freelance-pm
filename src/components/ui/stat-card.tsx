"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { GlassCard } from "./glass-card"
import { ResponsiveContainer, AreaChart, Area } from "recharts"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  chartData?: any[]
  chartColor?: string
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  trend,
  chartData,
  chartColor = "#6366F1",
  className,
}: StatCardProps) {
  return (
    <GlassCard className={cn("flex flex-col justify-between h-full min-h-[160px]", className)}>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight">{value}</span>
          {trend && (
            <span className={cn(
              "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
              trend.isPositive 
                ? "bg-teal/10 text-teal border border-teal/20" 
                : "bg-amber/10 text-amber border border-amber/20"
            )}>
              {trend.isPositive ? "+" : "-"}{trend.value}%
            </span>
          )}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>

      {chartData && (
        <div className="h-10 mt-4 -mx-2 -mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${title})`}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  )
}
