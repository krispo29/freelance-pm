import { getProjects } from "@/server/actions/projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays, startOfDay } from "date-fns";
import { CalendarDays, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { TimelineNotifier } from "./timeline-notifier";

export const dynamic = 'force-dynamic';

export default async function TimelinePage() {
  const projects = await getProjects();
  
  // Filter projects with deadlines and sort by date
  const projectsWithDeadlines = projects
    .filter(p => p.deadline && p.status !== "completed" && p.status !== "cancelled")
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

  const today = startOfDay(new Date());

  // Count urgent projects for notifications
  const urgentProjects = projectsWithDeadlines.filter(p => {
    const days = differenceInDays(startOfDay(new Date(p.deadline!)), today);
    return days <= 5;
  });

  return (
    <div className="space-y-6">
      <TimelineNotifier urgentProjects={urgentProjects} />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
        <p className="text-muted-foreground">Upcoming project deadlines.</p>
      </div>

      {urgentProjects.length > 0 && (
        <div className="p-4 border border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold">Attention Required</h3>
            <p className="text-sm">You have {urgentProjects.length} project(s) due within the next 5 days.</p>
          </div>
        </div>
      )}

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
              {projectsWithDeadlines.map((project) => {
                const date = new Date(project.deadline!);
                const deadlineDate = startOfDay(date);
                const daysUntilDeadline = differenceInDays(deadlineDate, today);
                
                const isLate = daysUntilDeadline < 0;
                const isUrgent = daysUntilDeadline >= 0 && daysUntilDeadline <= 1; // 0 or 1 day left
                const isWarning = daysUntilDeadline > 1 && daysUntilDeadline <= 5; // 2 to 5 days left

                // Determine styling based on urgency
                let iconColor = "text-primary";
                let borderColor = "border-primary/30";
                let badgeClass = "bg-primary text-primary-foreground";
                let statusText = "Upcoming";

                if (isLate) {
                  iconColor = "text-red-600 dark:text-red-500";
                  borderColor = "border-red-600/30 dark:border-red-500/30";
                  badgeClass = "bg-red-600 text-white";
                  statusText = "Overdue";
                } else if (isUrgent) {
                  iconColor = "text-red-500 dark:text-red-400";
                  borderColor = "border-red-500/30 dark:border-red-400/30";
                  badgeClass = "bg-red-500 text-white";
                  statusText = daysUntilDeadline === 0 ? "Due Today" : "Due Tomorrow";
                } else if (isWarning) {
                  iconColor = "text-orange-500 dark:text-orange-400";
                  borderColor = "border-orange-500/30 dark:border-orange-400/30";
                  badgeClass = "bg-orange-500 text-white hover:bg-orange-600";
                  statusText = `Due in ${daysUntilDeadline} days`;
                } else {
                  statusText = `Due in ${daysUntilDeadline} days`;
                }

                return (
                  <div key={project.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${borderColor} ${iconColor}`}>
                      {isLate ? <AlertCircle className="h-4 w-4" /> : (isUrgent || isWarning ? <Clock className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />)}
                    </div>
                    {/* Content */}
                    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border bg-card shadow-sm transition-colors hover:border-primary/50 ${(isLate || isUrgent) ? "border-red-500/50" : (isWarning ? "border-orange-500/50" : "")}`}>
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className={`border-transparent ${badgeClass}`}>
                           {format(date, "dd MMM yyyy")}
                        </Badge>
                        <span className={`text-xs font-bold ${(isLate || isUrgent) ? "text-red-500" : (isWarning ? "text-orange-500" : "text-muted-foreground")}`}>
                          {statusText}
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
