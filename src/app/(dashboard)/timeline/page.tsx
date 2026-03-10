import { getProjects } from "@/server/actions/projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isPast, isToday } from "date-fns";
import { CalendarDays, AlertCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function TimelinePage() {
  const projects = await getProjects();
  
  // Filter projects with deadlines and sort by date
  const projectsWithDeadlines = projects
    .filter(p => p.deadline && p.status !== "completed" && p.status !== "cancelled")
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
        <p className="text-muted-foreground">Upcoming project deadlines.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarDays className="h-5 w-5" /> Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projectsWithDeadlines.length === 0 ? (
             <div className="text-center p-8 border border-dashed rounded-lg bg-muted/20">
               <p className="text-muted-foreground">No upcoming deadlines.</p>
             </div>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
              {projectsWithDeadlines.map((project, index) => {
                const date = new Date(project.deadline!);
                const isLate = isPast(date) && !isToday(date);
                
                return (
                  <div key={project.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${isLate ? 'border-destructive/30 text-destructive' : 'text-primary'}`}>
                      {isLate ? <AlertCircle className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}
                    </div>
                    {/* Content */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border bg-card shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant={isLate ? "destructive" : "secondary"}>
                           {format(date, "dd MMM yyyy")}
                        </Badge>
                        <span className="text-xs font-medium text-muted-foreground">
                          {isLate ? "Overdue" : "Upcoming"}
                        </span>
                      </div>
                      <Link href={`/projects/${project.id}`} className="font-semibold text-lg hover:underline text-primary line-clamp-1 mt-2 mb-1">
                        {project.name}
                      </Link>
                      {project.client?.name && (
                        <p className="text-sm text-muted-foreground">{project.client.name}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
