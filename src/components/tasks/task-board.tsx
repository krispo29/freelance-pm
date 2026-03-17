"use client";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState, useTransition, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarDays, MoreHorizontal } from "lucide-react";
import { updateTaskStatus, reorderTasks } from "@/server/actions/tasks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

const priorityColors = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

interface TaskBoardProps {
  tasks: any[];
  projectId: string;
}

export function TaskBoard({ tasks: initialTasks, projectId }: TaskBoardProps) {
  const [isPending, startTransition] = useTransition();
  const [tasks, setTasks] = useState(initialTasks);

  // Sync tasks when initialTasks change
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = source.droppableId;
    const finish = destination.droppableId;

    // Local update for better UX
    const newTasks = Array.from(tasks);
    const draggedTaskIndex = newTasks.findIndex(t => t.id === draggableId);
    const draggedTask = { ...newTasks[draggedTaskIndex] };

    if (start === finish) {
      // Reorder in the same list
      const columnTasks = newTasks.filter(t => t.status === start);
      columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, draggedTask);

      // Reconstruct full list with updated order
      const updatedTasks = [
        ...newTasks.filter(t => t.status !== start),
        ...columnTasks
      ];
      setTasks(updatedTasks);

      // Save order
      startTransition(async () => {
        const ids = columnTasks.map(t => t.id);
        const res = await reorderTasks(projectId, ids);
        if (!res.success) toast.error("Failed to reorder tasks");
      });
    } else {
      // Move between columns
      draggedTask.status = finish as any;
      newTasks[draggedTaskIndex] = draggedTask;
      
      const sourceCol = newTasks.filter(t => t.status === start);
      const destCol = newTasks.filter(t => t.status === finish);

      setTasks(newTasks);

      // Save status change
      startTransition(async () => {
        const res = await updateTaskStatus(draggableId, projectId, finish as any);
        if (!res.success) toast.error("Failed to update task status");
      });
    }
  };

  const getColumnTasks = (status: string) => {
    return tasks
      .filter(t => t.status === status)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="bg-muted/40 rounded-xl p-3 flex flex-col min-w-[280px]">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-bold">
                  {getColumnTasks(column.id).length}
                </span>
              </div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "flex-1 min-h-[500px] flex flex-col gap-3 transition-colors rounded-lg p-1",
                    snapshot.isDraggingOver && "bg-muted/60"
                  )}
                >
                  {getColumnTasks(column.id).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={cn(
                            "bg-card border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow select-none",
                            snapshot.isDragging && "shadow-xl ring-2 ring-primary ring-offset-2",
                            task.status === "done" && "opacity-60"
                          )}
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className={cn(
                                "text-sm font-medium leading-tight",
                                task.status === "done" && "line-through text-muted-foreground"
                              )}>
                                {task.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge 
                                variant="secondary" 
                                className={cn("text-[10px] h-4 px-1 border-none", priorityColors[task.priority as keyof typeof priorityColors])}
                              >
                                {task.priority}
                              </Badge>
                              
                              {task.dueDate && (
                                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                  <CalendarDays className="h-3 w-3" />
                                  {format(new Date(task.dueDate), "MMM d")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
