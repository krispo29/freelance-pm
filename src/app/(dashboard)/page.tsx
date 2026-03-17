import { BentoGrid, BentoCard } from "@/components/ui/glass-card"
import { StatCard } from "@/components/ui/stat-card"
import { 
  Plus, 
  Clock, 
  Calendar,
  Briefcase,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getProjects } from "@/server/actions/projects"
import { getIncomeStats, getAllIncome } from "@/server/actions/income"
import { format } from "date-fns"
import { auth } from "@/auth"
import { FinancialCharts } from "@/components/dashboard/financial-charts"

export default async function DashboardPage() {
  const session = await auth()
  const [projects, incomeStats, recentIncome] = await Promise.all([
    getProjects("all"),
    getIncomeStats(),
    getAllIncome()
  ])

  const activeProjects = projects.filter(p => p.status === "in_progress" || p.status === "near_done")
  const upcomingTasksCount = projects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === "todo").length, 0)

  const revenueData = [
    { value: 400 }, { value: 300 }, { value: 600 }, { value: 800 }, 
    { value: 500 }, { value: 900 }, { value: incomeStats.totalReceived / 100 }
  ]

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
            Workspace <span className="text-muted-foreground italic font-normal">Hub</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md">
            Welcome back, <span className="text-white font-medium">{session?.user?.name || "Partner"}</span>. You have <span className="text-indigo-400 font-medium">{activeProjects.length} active projects</span> and {upcomingTasksCount} pending tasks.
          </p>
        </div>
        
        <Link 
          href="/projects"
          className="flex items-center gap-2 bg-indigo hover:bg-indigo/90 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo/20 transition-all self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Link>
      </div>

      <BentoGrid>
        {/* Revenue Stat */}
        <BentoCard colSpan="md:col-span-4" className="flex flex-col justify-between p-0 overflow-hidden">
          <StatCard 
            title="Total Revenue" 
            value={`฿${incomeStats.totalReceived.toLocaleString()}`} 
            description="Total confirmed income"
            trend={{ value: 8, label: "from last month", isPositive: true }}
            chartData={revenueData}
            chartColor="#2DD4BF"
            className="border-0 shadow-none bg-transparent"
          />
        </BentoCard>

        {/* Financial Health */}
        <BentoCard colSpan="md:col-span-4" className="flex flex-col items-center justify-center p-6 text-center">
          <div className="w-full flex justify-between items-center mb-2">
             <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Financial Health</span>
             <TrendingUp className="h-4 w-4 text-teal" />
          </div>
          
          <FinancialCharts incomeStats={incomeStats} />

          <div className="flex gap-4 mt-3 text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-teal" />
              <span className="text-muted-foreground">Received</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo" />
              <span className="text-muted-foreground">Pending</span>
            </div>
          </div>
        </BentoCard>

        {/* Quick Links / Actions */}
        <BentoCard colSpan="md:col-span-4" className="flex flex-col gap-3">
           <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Quick Actions</span>
           <div className="grid grid-cols-2 gap-3">
             <Link href="/projects" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-indigo/50 hover:bg-white/10 transition-all flex flex-col gap-2 group">
                <Briefcase className="h-4 w-4 text-indigo" />
                <span className="text-xs font-medium">Projects</span>
             </Link>
             <Link href="/income" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-teal/50 hover:bg-white/10 transition-all flex flex-col gap-2 group">
                <TrendingUp className="h-4 w-4 text-teal" />
                <span className="text-xs font-medium">Finance</span>
             </Link>
             <Link href="/timeline" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber/50 hover:bg-white/10 transition-all flex flex-col gap-2 group">
                <Clock className="h-4 w-4 text-amber" />
                <span className="text-xs font-medium">Timeline</span>
             </Link>
             <Link href="/clients" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all flex flex-col gap-2 group">
                <Calendar className="h-4 w-4 text-white" />
                <span className="text-xs font-medium">Clients</span>
             </Link>
           </div>
        </BentoCard>

        {/* Active Projects */}
        <BentoCard colSpan="md:col-span-7" rowSpan="row-span-2" className="flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo/10 flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-indigo" />
              </div>
              <h3 className="font-serif text-xl font-bold">Active Ventures</h3>
            </div>
            <Link href="/projects" className="text-xs text-muted-foreground hover:text-white transition-colors">View All</Link>
          </div>

          <div className="space-y-4">
            {activeProjects.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                <p className="text-muted-foreground text-sm italic">No active projects found.</p>
                <Link href="/projects" className="text-indigo-400 text-xs mt-2 inline-block hover:underline">Start something new</Link>
              </div>
            ) : (
              activeProjects.slice(0, 4).map((project) => (
                <Link 
                  href={`/projects/${project.id}`}
                  key={project.id}
                  className="group flex flex-col gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{project.emoji || "📁"}</span>
                      <div>
                        <h4 className="font-medium text-sm text-white group-hover:text-indigo-300 transition-colors">{project.name}</h4>
                        <p className="text-[10px] text-muted-foreground">{project.client?.name || "No Client"}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider bg-white/5 border-white/10 py-0 h-5">
                      {project.status.replace("_", " ")}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-muted-foreground font-medium uppercase tracking-widest">Progress</span>
                      <span className="text-white font-bold">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo to-teal transition-all duration-1000 ease-out"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </BentoCard>

        {/* Critical Deadlines */}
        <BentoCard colSpan="md:col-span-5" className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-amber" />
              </div>
              <h3 className="font-serif text-xl font-bold">Crucial Dates</h3>
            </div>
          </div>

          <div className="space-y-3">
            {projects.filter(p => p.deadline).sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()).slice(0, 3).map((p) => {
               const isOverdue = new Date(p.deadline!) < new Date() && p.status !== "completed";
               return (
                <div key={p.id} className={cn(
                  "p-3 rounded-xl flex items-start gap-3 border transition-colors",
                  isOverdue ? "bg-amber/10 border-amber/30" : "bg-white/5 border-white/10"
                )}>
                  <div className={cn(
                    "p-2 rounded-lg",
                    isOverdue ? "bg-amber text-amber-950" : "bg-white/10 text-white"
                  )}>
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      isOverdue ? "text-amber-400" : "text-muted-foreground"
                    )}>
                      {isOverdue ? "Attention Required" : format(new Date(p.deadline!), "dd MMM yyyy")}
                    </p>
                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  </div>
                </div>
               )
            })}
            {projects.filter(p => p.deadline).length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-4">No deadlines set.</p>
            )}
          </div>
        </BentoCard>

        {/* Financial Pulse */}
        <BentoCard colSpan="md:col-span-5" className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-teal/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-teal" />
            </div>
            <h3 className="font-serif text-xl font-bold">Financial Pulse</h3>
          </div>
          
          <div className="space-y-3">
            {recentIncome.slice(0, 3).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                   <div className={cn(
                     "h-2 w-2 rounded-full",
                     entry.status === "received" ? "bg-teal" : entry.status === "overdue" ? "bg-amber" : "bg-indigo"
                   )} />
                   <div>
                     <p className="text-[11px] font-medium text-white group-hover:text-indigo-300 transition-colors truncate max-w-[120px]">{entry.label}</p>
                     <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">{entry.project?.name || "Direct"}</p>
                   </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white">฿{Number(entry.amount).toLocaleString()}</p>
                  <p className="text-[8px] text-muted-foreground">{entry.dueDate ? format(new Date(entry.dueDate), "MMM d") : "No date"}</p>
                </div>
              </div>
            ))}
            {recentIncome.length === 0 && (
              <p className="text-xs text-muted-foreground italic text-center py-4">No income records yet.</p>
            )}
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
