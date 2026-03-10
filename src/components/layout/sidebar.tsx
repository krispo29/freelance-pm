"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderKanban, Banknote, CalendarDays, Users, LogOut } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { getTranslation } from "@/lib/translations";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, language } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = getTranslation(language);

  const navItems = [
    { name: t.common.dashboard, href: "/", icon: LayoutDashboard },
    { name: t.common.projects, href: "/projects", icon: FolderKanban },
    { name: t.common.income, href: "/income", icon: Banknote },
    { name: t.common.timeline, href: "/timeline", icon: CalendarDays },
    { name: t.common.clients, href: "/clients", icon: Users },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex-col border-r bg-background transition-transform lg:static lg:flex lg:translate-x-0",
          sidebarOpen ? "flex translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <FolderKanban className="h-6 w-6" />
            Freelance PM
          </Link>
        </div>

        <nav className="flex-1 overflow-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t mt-auto">
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })} 
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            {t.common.logout}
          </button>
        </div>
      </aside>
    </>
  );
}
