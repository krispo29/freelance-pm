"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  FolderKanban, 
  Banknote, 
  CalendarDays, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  Zap
} from "lucide-react"
import { useUIStore } from "@/store/ui-store"
import { signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const NavItem = ({ item, pathname, onClick }: { item: any; pathname: string; onClick: () => void }) => {
  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
  const Icon = item.icon
  
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300",
        isActive
          ? "bg-indigo/10 text-indigo"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      {/* Active Indicator Glow */}
      {isActive && (
        <motion.div
          layoutId="active-nav-bg"
          className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-indigo rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.8)]"
        />
      )}
      
      <Icon className={cn(
        "h-5 w-5 shrink-0 transition-colors",
        isActive ? "text-indigo" : "group-hover:text-indigo"
      )} />
      <span className="flex-1">{item.name}</span>
      {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
    </Link>
  )
}

const NavGroup = ({ title, items, pathname, onItemClick }: { title: string; items: any[]; pathname: string; onItemClick: () => void }) => (
  <div className="mb-6">
    <h3 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
      {title}
    </h3>
    <div className="space-y-1">
      {items.map((item) => (
        <NavItem key={item.name} item={item} pathname={pathname} onClick={onItemClick} />
      ))}
    </div>
  </div>
)

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const closeSidebar = () => setSidebarOpen(false)

  const workspaceItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Timeline", href: "/timeline", icon: CalendarDays },
  ]

  const projectItems = [
    { name: "All Projects", href: "/projects", icon: FolderKanban },
    { name: "Clients", href: "/clients", icon: Users },
  ]

  const financeItems = [
    { name: "Revenue", href: "/income", icon: Banknote },
  ]

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex-col glass border-r transition-all duration-500 lg:static lg:flex lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-20 items-center px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo to-teal flex items-center justify-center shadow-lg shadow-indigo/20">
              <Zap className="h-6 w-6 text-white fill-white/20" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">Freelance</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo leading-none">Manager</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <NavGroup title="Workspace" items={workspaceItems} pathname={pathname} onItemClick={closeSidebar} />
          <NavGroup title="Projects" items={projectItems} pathname={pathname} onItemClick={closeSidebar} />
          <NavGroup title="Finance" items={financeItems} pathname={pathname} onItemClick={closeSidebar} />
          
          <div className="mt-8">
            <h3 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
              System
            </h3>
            <NavItem item={{ name: "Settings", href: "/settings", icon: Settings }} pathname={pathname} onClick={closeSidebar} />
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 mt-auto space-y-4">
          {/* Usage Indicator */}
          <div className="rounded-xl bg-muted/50 border border-border p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-medium text-muted-foreground">Free Plan</span>
              <span className="text-[10px] font-bold text-foreground">80%</span>
            </div>
            <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo to-teal w-[80%]" />
            </div>
            <button className="w-full mt-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors">
              Upgrade Pro
            </button>
          </div>

          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">Pro Consultant</p>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 text-muted-foreground hover:text-amber transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
