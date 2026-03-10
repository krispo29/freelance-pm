import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ProjectStatusBadge } from "./project-status-badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, CheckCircle2, CircleDashed } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: any; // Using any for now to avoid strict type errors with relations
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Calculate completed tasks
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter((t: any) => t.status === "done").length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : project.progress || 0;

  const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.status !== "completed";

  return (
    <Link href={`/projects/${project.id}`} className="block transition-transform hover:-translate-y-1">
      <Card className="h-full flex flex-col hover:border-primary/50 transition-colors">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start mb-2">
            <div className="w-8 h-8 rounded-md flex items-center justify-center text-lg" style={{ backgroundColor: `${project.color}20` }}>
              {project.emoji || "📁"}
            </div>
            <ProjectStatusBadge status={project.status} />
          </div>
          <h3 className="font-semibold text-lg line-clamp-1">{project.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {project.client?.name || "No client"}
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-2 flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
             <CalendarDays className="h-4 w-4" />
             <span className={isOverdue ? "text-destructive font-medium" : ""}>
               {project.deadline ? (
                  isOverdue ? `Overdue by ${formatDistanceToNow(new Date(project.deadline))}` : `Due in ${formatDistanceToNow(new Date(project.deadline))}`
               ) : "No deadline"}
             </span>
          </div>

          <div className="space-y-1.5 mt-auto">
             <div className="flex justify-between text-xs font-medium">
               <span className="flex items-center gap-1">
                 <CheckCircle2 className="h-3 w-3 text-green-500" />
                 {completedTasks}/{totalTasks} tasks
               </span>
               <span>{progressPercent}%</span>
             </div>
             <Progress value={progressPercent} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
