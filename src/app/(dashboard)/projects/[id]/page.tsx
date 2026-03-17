import { getProjectById } from "@/server/actions/projects";
import { getClients } from "@/server/actions/clients";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskViewSwitcher } from "@/components/tasks/task-view-switcher";
import { IncomeTable } from "@/components/income/income-table";
import { IncomeDialog } from "@/components/income/income-dialog";
import { QuickInvoiceButton } from "@/components/income/quick-invoice-button";
import { MilestoneDialog } from "@/components/milestones/milestone-dialog";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import { ArrowLeft, CalendarDays, User, CheckCircle2, Wallet, Target, Activity } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { BlockRenderer } from "@/components/ui/block-renderer";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, clients] = await Promise.all([
    getProjectById(id),
    getClients()
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Navigation & Header */}
      <div className="space-y-6">
        <Link 
          href="/projects" 
          className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-indigo transition-colors group"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> 
          Back to workspace
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-4 flex-wrap">
               <span className="text-4xl md:text-5xl filter drop-shadow-xl">{project.emoji}</span>
               <div className="flex flex-col gap-1">
                 <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-white">
                   {project.name}
                 </h1>
                 <div className="flex items-center gap-2">
                    <ProjectStatusBadge status={project.status} />
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] uppercase tracking-wider">
                      {project.client?.name || "No Client"}
                    </Badge>
                 </div>
               </div>
            </div>
            
            {project.description && (
              <div className="text-muted-foreground leading-relaxed text-lg font-light italic">
                <BlockRenderer content={project.description} />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <EditProjectDialog project={project} clients={clients} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <GlassCard className="p-4 flex flex-col gap-3 group">
            <div className="p-2 rounded-lg bg-indigo/10 w-fit text-indigo group-hover:bg-indigo group-hover:text-white transition-colors">
              <User className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Client Partner</p>
              <p className="font-medium text-white">{project.client?.name || "None"}</p>
            </div>
         </GlassCard>

         <GlassCard className="p-4 flex flex-col gap-3 group">
            <div className="p-2 rounded-lg bg-teal/10 w-fit text-teal group-hover:bg-teal group-hover:text-white transition-colors">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Project Timeline</p>
              <p className="font-medium text-white">
                {project.startDate ? format(new Date(project.startDate), "MMM d") : "..."} 
                <span className="mx-2 text-muted-foreground opacity-50">→</span>
                {project.deadline ? format(new Date(project.deadline), "MMM d, yyyy") : "TBD"}
              </p>
            </div>
         </GlassCard>

         <GlassCard className="p-4 flex flex-col gap-3 group">
            <div className="p-2 rounded-lg bg-amber/10 w-fit text-amber group-hover:bg-amber group-hover:text-white transition-colors">
              <Wallet className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Budget Allocation</p>
              <p className="font-bold text-white text-lg">
                {project.paymentType === "monthly" 
                  ? (project.monthlyRate ? `฿${Number(project.monthlyRate).toLocaleString()}/mo` : "N/A")
                  : (project.totalPrice ? `฿${Number(project.totalPrice).toLocaleString()}` : "N/A")}
              </p>
            </div>
         </GlassCard>

         <GlassCard className="p-4 flex flex-col gap-3 group">
            <div className="p-2 rounded-lg bg-indigo/10 w-fit text-indigo group-hover:bg-indigo group-hover:text-white transition-colors">
              <Activity className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Completion</p>
              <div className="flex items-baseline gap-2">
                <p className="font-bold text-white text-lg">72%</p>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden min-w-[60px]">
                  <div className="h-full bg-indigo w-[72%] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                </div>
              </div>
            </div>
         </GlassCard>
      </div>

      {/* Main Content Sections */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl h-auto flex-wrap sm:flex-nowrap mb-8 inline-flex">
          <TabsTrigger value="tasks" className="rounded-lg data-[state=active]:bg-indigo data-[state=active]:text-white px-6 py-2.5 text-sm font-medium transition-all">
            Tasks <Badge variant="secondary" className="ml-2 bg-white/10 border-transparent text-[10px]">{project.tasks.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="income" className="rounded-lg data-[state=active]:bg-indigo data-[state=active]:text-white px-6 py-2.5 text-sm font-medium transition-all">
            Financials <Badge variant="secondary" className="ml-2 bg-white/10 border-transparent text-[10px]">{project.incomeEntries.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="milestones" className="rounded-lg data-[state=active]:bg-indigo data-[state=active]:text-white px-6 py-2.5 text-sm font-medium transition-all">
            Milestones <Badge variant="secondary" className="ml-2 bg-white/10 border-transparent text-[10px]">{project.milestones.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="m-0 focus-visible:outline-none">
          <GlassCard noPadding className="border-white/5 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-indigo" />
                <h2 className="font-serif text-2xl font-bold">Deliverables</h2>
              </div>
              <TaskDialog projectId={project.id} />
            </div>
            <div className="p-6">
              <TaskViewSwitcher tasks={project.tasks} projectId={project.id} />
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="income" className="m-0 focus-visible:outline-none">
          <GlassCard noPadding className="border-white/5 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-teal" />
                <h2 className="font-serif text-2xl font-bold">Invoicing & Ledger</h2>
              </div>
              <div className="flex gap-2">
                {project.paymentType === "monthly" && project.monthlyRate && (
                  <QuickInvoiceButton projectId={project.id} monthlyRate={Number(project.monthlyRate)} />
                )}
                <IncomeDialog projects={[project]} defaultProjectId={project.id} />
              </div>
            </div>
            <div className="p-6 overflow-auto">
              <IncomeTable entries={project.incomeEntries} />
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="milestones" className="m-0 focus-visible:outline-none">
          <GlassCard noPadding className="border-white/5 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-amber" />
                <h2 className="font-serif text-2xl font-bold">Project Milestones</h2>
              </div>
              <MilestoneDialog projectId={project.id} />
            </div>
            <div className="p-6">
              {project.milestones.length === 0 ? (
                <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
                  <p className="text-muted-foreground text-sm italic">No roadmap defined for this venture yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {project.milestones.map((milestone: any) => (
                    <div key={milestone.id} className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo/30 transition-all">
                      <div className={cn(
                        "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                        milestone.isDone ? "bg-teal border-teal text-white" : "border-white/20 group-hover:border-indigo"
                      )}>
                        {milestone.isDone && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "font-medium text-sm transition-all",
                          milestone.isDone ? "text-muted-foreground line-through" : "text-white"
                        )}>{milestone.title}</p>
                      </div>
                      {milestone.dueDate && (
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          <CalendarDays className="h-3 w-3" />
                          {format(new Date(milestone.dueDate), "MMM d")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
