"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

export function GlassCard({ children, className, noPadding = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "glass-card rounded-2xl relative overflow-hidden group transition-all duration-300",
        !noPadding && "p-6",
        className
      )}
      {...props}
    >
      {/* Top Border Glow - Signature Detail */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
      
      {/* Hover Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo/10 via-transparent to-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  )
}

export function BentoGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[minmax(180px,auto)]", className)}>
      {children}
    </div>
  )
}

interface BentoCardProps extends GlassCardProps {
  colSpan?: string // e.g., "md:col-span-4"
  rowSpan?: string // e.g., "row-span-2"
}

export function BentoCard({ children, className, colSpan = "md:col-span-4", rowSpan = "", ...props }: BentoCardProps) {
  return (
    <GlassCard className={cn(colSpan, rowSpan, className)} {...props}>
      {children}
    </GlassCard>
  )
}
