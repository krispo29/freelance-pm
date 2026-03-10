"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarDays, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateTaskStatus, deleteTask } from "@/server/actions/tasks";
import { useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: any;
}

const priorityColors = {
  low: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300",
};

export function TaskItem({ task }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const isDone = task.status === "done";

  const handleToggle = () => {
    startTransition(async () => {
      const newStatus = isDone ? "todo" : "done";
      const res = await updateTaskStatus(task.id, task.projectId, newStatus);
      if (!res.success) {
        toast.error("Failed to update task");
      }
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      startTransition(async () => {
        const res = await deleteTask(task.id, task.projectId);
        if (res.success) {
          toast.success("Task deleted");
        } else {
          toast.error("Failed to delete task");
        }
      });
    }
  };

  return (
    <div className={cn(
      "group flex items-center gap-3 p-3 rounded-md border bg-card text-card-foreground transition-all",
      isDone && "opacity-60 bg-muted/50",
      isPending && "opacity-50 pointer-events-none"
    )}>
      <Button variant="ghost" size="icon" className="h-6 w-6 cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4" />
      </Button>

      <Checkbox 
        checked={isDone} 
        onCheckedChange={handleToggle}
        className="h-5 w-5 rounded-[4px]"
      />
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium leading-none mb-1",
          isDone && "line-through text-muted-foreground"
        )}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 h-4 border-none font-normal", priorityColors[task.priority as keyof typeof priorityColors])}>
            {task.priority}
          </Badge>
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          )}
        </div>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete}
        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
