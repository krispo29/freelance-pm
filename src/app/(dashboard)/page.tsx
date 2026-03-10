import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjects } from "@/server/actions/projects";
import { getIncomeStats } from "@/server/actions/income";
import { FolderKanban, CheckCircle2, Banknote, AlertCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const projects = await getProjects();
  const incomeStats = await getIncomeStats();

  const activeProjects = projects.filter(p => p.status === "in_progress" || p.status === "near_done");
  const completedProjects = projects.filter(p => p.status === "completed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your work.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Income</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{incomeStats.totalPending.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Income</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">฿{incomeStats.totalOverdue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Could add recent activities or upcoming deadlines here */}
    </div>
  );
}
