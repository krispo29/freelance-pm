"use client"

import { useUIStore } from "@/store/ui-store"
import { Menu, Search, Bell, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { motion } from "framer-motion"

export function Topbar() {
  const { toggleSidebar } = useUIStore()

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 bg-transparent px-4 sm:px-6 md:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden shrink-0 text-foreground hover:bg-accent"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      {/* Command Search */}
      <div className="flex-1 max-w-md">
        <div className="group relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo transition-colors" />
          <input 
            type="text" 
            placeholder="Search projects, clients..." 
            className="w-full bg-muted/50 border border-border rounded-xl py-2 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo/50 transition-all placeholder:text-muted-foreground/50 text-foreground"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background text-[10px] text-muted-foreground">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl bg-muted/50 border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
        </motion.button>
        
        <div className="h-8 w-px bg-border mx-1" />
        
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
