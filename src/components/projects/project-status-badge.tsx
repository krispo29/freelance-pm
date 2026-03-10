"use client"

import { Badge } from "@/components/ui/badge";
import { ProjectStatus } from "@/types";
import { useUIStore } from "@/store/ui-store";
import { getTranslation } from "@/lib/translations";
import { useEffect, useState } from "react";

const statusConfig: Record<ProjectStatus, { variant: "default" | "secondary" | "destructive" | "outline", className?: string }> = {
  not_started: { variant: "secondary" },
  in_progress: { variant: "default", className: "bg-blue-500 hover:bg-blue-600" },
  near_done: { variant: "default", className: "bg-amber-500 hover:bg-amber-600" },
  completed: { variant: "default", className: "bg-green-500 hover:bg-green-600" },
  maintenance: { variant: "outline", className: "border-purple-500 text-purple-500" },
  cancelled: { variant: "destructive" },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { language } = useUIStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const t = getTranslation(language);
  const config = statusConfig[status];
  const label = t.projects.status[status] || status;
  
  if (!mounted) {
    return <Badge variant="outline">...</Badge>;
  }

  return (
    <Badge variant={config.variant} className={config.className}>
      {label}
    </Badge>
  );
}
