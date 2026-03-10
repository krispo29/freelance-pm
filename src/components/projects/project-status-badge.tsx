import { Badge } from "@/components/ui/badge";
import { ProjectStatus } from "@/types";

const statusConfig: Record<ProjectStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline", className?: string }> = {
  not_started: { label: "Not Started", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "default", className: "bg-blue-500 hover:bg-blue-600" },
  near_done: { label: "Near Done", variant: "default", className: "bg-amber-500 hover:bg-amber-600" },
  completed: { label: "Completed", variant: "default", className: "bg-green-500 hover:bg-green-600" },
  maintenance: { label: "Maintenance", variant: "outline", className: "border-purple-500 text-purple-500" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
