import { getProjectById } from "@/server/actions/projects";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { TaskList } from "@/components/tasks/task-list";
import { IncomeTable } from "@/components/income/income-table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, MoreHorizontal, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/projects" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to projects
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <span className="text-2xl">{project.emoji}</span>
                {project.name}
              </h1>
              <ProjectStatusBadge status={project.status} />
            </div>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
          
          <Button variant="outline" size="icon">
             <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="p-4 border rounded-lg bg-card flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
              <User className="h-3 w-3" /> Client
            </span>
            <span className="font-medium">{project.client?.name || "None"}</span>
         </div>
         <div className="p-4 border rounded-lg bg-card flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> Start Date
            </span>
            <span className="font-medium">{project.startDate ? format(new Date(project.startDate), "dd MMM yyyy") : "Not set"}</span>
         </div>
         <div className="p-4 border rounded-lg bg-card flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> Deadline
            </span>
            <span className="font-medium">{project.deadline ? format(new Date(project.deadline), "dd MMM yyyy") : "Not set"}</span>
         </div>
         <div className="p-4 border rounded-lg bg-card flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase">
              Total Value
            </span>
            <span className="font-medium text-green-600 dark:text-green-500">
               {project.totalPrice ? `฿${Number(project.totalPrice).toLocaleString()}` : "-"}
            </span>
         </div>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
          <TabsTrigger value="tasks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 h-full">
            Tasks ({project.tasks.length})
          </TabsTrigger>
          <TabsTrigger value="income" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 h-full">
            Income ({project.incomeEntries.length})
          </TabsTrigger>
          <TabsTrigger value="milestones" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 h-full">
            Milestones ({project.milestones.length})
          </TabsTrigger>
        </TabsList>
        <div className="pt-6">
          <TabsContent value="tasks" className="m-0 focus-visible:outline-none">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Project Tasks</h2>
              <Button size="sm">Add Task</Button>
            </div>
            <TaskList tasks={project.tasks} />
          </TabsContent>
          <TabsContent value="income" className="m-0 focus-visible:outline-none">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Income & Invoices</h2>
              <Button size="sm">Add Income</Button>
            </div>
            <IncomeTable entries={project.incomeEntries} />
          </TabsContent>
          <TabsContent value="milestones" className="m-0 focus-visible:outline-none">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Project Milestones</h2>
              <Button size="sm">Add Milestone</Button>
            </div>
            {project.milestones.length === 0 && (
              <div className="text-center p-8 border border-dashed rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No milestones yet.</p>
              </div>
            )}
            {/* TODO: Milestone List Component */}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
