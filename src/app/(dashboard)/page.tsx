import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getProjects } from "@/server/actions/projects";
import { getIncomeStats, getAllIncome } from "@/server/actions/income";
import { getUpcomingTasks } from "@/server/actions/tasks";
import { FolderKanban, CheckCircle2, Banknote, AlertCircle, Clock, CalendarDays, ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getI18n } from "@/lib/i18n-server";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [{ t }, projects, incomeStats, upcomingTasks, allIncome] = await Promise.all([
    getI18n(),
    getProjects(),
    getIncomeStats(),
    getUpcomingTasks(5),
    getAllIncome(),
  ]);

  // Include "maintenance" and "not_started" in active projects for the dashboard
  const activeProjects = projects.filter(p => 
    p.status === "in_progress" || 
    p.status === "near_done" || 
    p.status === "maintenance" ||
    p.status === "not_started"
  );
  
  // Recent income (last 5)
  const recentIncome = allIncome.slice(0, 5);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t.common.dashboard}</h1>
        <p className="text-muted-foreground">{t.dashboard.welcome} {t.dashboard.overview}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.activeProjects}</CardTitle>
            <FolderKanban className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">{t.dashboard.activeProjects}</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.totalRevenue}</CardTitle>
            <Banknote className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{incomeStats.totalReceived.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t.dashboard.totalRevenue}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.pendingIncome}</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{incomeStats.totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t.dashboard.pendingIncome}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.overdue}</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">฿{incomeStats.totalOverdue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t.dashboard.overdue}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Main Content: Active Projects */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">{t.dashboard.activeProjects}</h2>
            <Link 
              href="/projects" 
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-[min(var(--radius-md),12px)] text-[0.8rem] font-medium whitespace-nowrap transition-all h-7 gap-1 px-2.5",
                "hover:bg-muted hover:text-foreground",
                "flex items-center gap-1"
              )}
            >
              {t.dashboard.viewAll} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {activeProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activeProjects.slice(0, 4).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-[200px] text-center p-6">
                <FolderKanban className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground font-medium">{t.dashboard.noActiveProjects}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.dashboard.startNewProject}</p>
                <Link 
                  href="/projects" 
                  className={cn(
                    "inline-flex shrink-0 items-center justify-center rounded-[min(var(--radius-md),12px)] text-[0.8rem] font-medium whitespace-nowrap transition-all h-7 gap-1 px-2.5",
                    "border-border bg-background hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
                    "mt-4"
                  )}
                >
                  {t.common.add} {t.common.projects}
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar: Tasks and Income */}
        <div className="lg:col-span-3 space-y-6">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                {t.dashboard.upcomingTasks}
              </CardTitle>
              <CardDescription>{t.dashboard.tasksDue}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingTasks.length > 0 ? (
                <div className="divide-y">
                  {upcomingTasks.map((task: any) => (
                    <div key={task.id} className="p-4 flex flex-col gap-1 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm line-clamp-1">{task.title}</span>
                        {task.priority === "high" && (
                          <Badge variant="destructive" className="text-[10px] h-4 px-1">High</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="line-clamp-1">{task.project?.name}</span>
                        <span>{task.dueDate ? format(new Date(task.dueDate), "MMM d") : "No date"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  {t.dashboard.allCaughtUp}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Income */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Banknote className="h-5 w-5 text-green-500" />
                {t.dashboard.recentIncome}
              </CardTitle>
              <CardDescription>{t.dashboard.financialActivity}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {recentIncome.length > 0 ? (
                <div className="divide-y">
                  {recentIncome.map((income: any) => (
                    <div key={income.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <span className="font-medium text-sm truncate">{income.label}</span>
                        <span className="text-xs text-muted-foreground truncate">{income.project?.name}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-sm">฿{Number(income.amount).toLocaleString()}</div>
                        <Badge variant={income.status === "received" ? "secondary" : "outline"} className="text-[10px] h-4 px-1">
                          {income.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  {t.dashboard.noRecentIncome}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
